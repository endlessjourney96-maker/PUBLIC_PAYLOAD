// Work-pattern-first recommendation engine for AI Work Environment MVP
// Pure recommendation functions plus a fail-open browser analytics bridge.
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  else root.WorkPatternEngine=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const SOLUTIONS=[
    {id:'free-template',kind:'free',tags:['template','workflow','writing','communication','management','training'],name:'無料テンプレート化',cost:0},
    {id:'free-process',kind:'free',tags:['workflow','discovery','decision'],name:'業務フローの整理',cost:0},
    {id:'ai-general',kind:'ai_saas',tags:['ai','writing','search','knowledge','creative','coding','management'],name:'汎用AIアシスタント',cost:3000},
    {id:'automation',kind:'ai_saas',tags:['automation','integration','rpa','spreadsheet'],name:'自動化・連携ツール',cost:3000},
    {id:'knowledge',kind:'ai_saas',tags:['knowledge','training','search'],name:'ナレッジ基盤',cost:3000},
    {id:'physical-work',kind:'physical',tags:['physical','mobile'],name:'作業環境・モバイル用品',cost:10000},
    {id:'service-help',kind:'service',tags:['workflow','management','decision'],name:'専門家・業務改善支援',cost:10000}
  ];

  function normalizeBudget(value){
    if(value==='zero') return 0;
    if(value==='low') return 3000;
    if(value==='mid') return 10000;
    const n=Number(value); return Number.isFinite(n)&&n>=0?n:0;
  }

  function score(solution,pattern,budget){
    const overlap=solution.tags.filter(t=>(pattern.solution_tags||[]).includes(t)).length;
    if(!overlap) return -1;
    if(solution.cost>budget) return -1;
    // Fit dominates. Price/revenue/affiliate payout is deliberately absent.
    return overlap*10 + (solution.kind==='free'?5:0) + (solution.cost===0?2:0);
  }

  function recommend(pattern,budgetValue){
    if(!pattern||!pattern.id) return {free_first:'まず作業を記録し、最も時間を使う工程を1つ特定してください。',decision:'buy_nothing',recommendations:[]};
    const budget=normalizeBudget(budgetValue);
    const ranked=SOLUTIONS.map(s=>({...s,score:score(s,pattern,budget)})).filter(s=>s.score>=0).sort((a,b)=>b.score-a.score||a.cost-b.cost);
    const free=ranked.filter(x=>x.kind==='free').slice(0,1);
    const paid=budget>0?ranked.filter(x=>x.kind!=='free').slice(0,2):[];
    return {
      pattern_id:pattern.id,
      free_first:pattern.free_first,
      decision:paid.length?'compare_options':'buy_nothing',
      recommendations:[...free,...paid].map(({score,...x})=>x),
      ranking_policy:'fit_first_no_affiliate_payout'
    };
  }

  // Bridge the existing local MVP event log to the anonymous Worker endpoint.
  // This keeps local diagnostics intact and fails open if analytics is unavailable.
  if(typeof window!=='undefined' && window.localStorage && !window.__mvpAnalyticsBridge){
    window.__mvpAnalyticsBridge=true;
    const allowedEvents=new Set(['page_view','diagnosis_start','diagnosis_complete','recommendation_click']);
    const allowedKeys=new Set(['pattern','budget','decision','recommendation_id','kind','rank']);
    const safe=/^[a-zA-Z0-9_.:-]{1,80}$/;
    const originalSetItem=Storage.prototype.setItem;
    function sendEvent(event){
      if(!event||!allowedEvents.has(event.name)) return;
      const payload={name:event.name};
      for(const [key,value] of Object.entries(event)){
        const mapped=key==='solution_id'?'recommendation_id':key;
        if(!allowedKeys.has(mapped)) continue;
        const normalized=typeof value==='number'?String(value):value;
        if(typeof normalized==='string'&&safe.test(normalized)) payload[mapped]=normalized;
      }
      try{
        const body=JSON.stringify(payload);
        if(navigator.sendBeacon){
          const blob=new Blob([body],{type:'application/json'});
          if(navigator.sendBeacon('/api/events',blob)) return;
        }
        fetch('/api/events',{method:'POST',headers:{'content-type':'application/json'},body,keepalive:true,credentials:'omit',cache:'no-store'}).catch(()=>{});
      }catch(_){ }
    }
    Storage.prototype.setItem=function(key,value){
      const result=originalSetItem.apply(this,arguments);
      if(this===window.localStorage&&key==='mvp_events'){
        try{
          const events=JSON.parse(value||'[]');
          sendEvent(events[events.length-1]);
        }catch(_){ }
      }
      return result;
    };
  }

  return {SOLUTIONS,normalizeBudget,recommend};
});
