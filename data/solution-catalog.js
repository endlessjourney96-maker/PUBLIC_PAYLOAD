// Concrete solution catalog. Ranking must remain fit-first; affiliate payout is never a score input.
(function(root,factory){
 const api=factory(); if(typeof module==='object'&&module.exports) module.exports=api; else root.SolutionCatalog=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
 const items=[
  {id:'chatgpt',kind:'ai_saas',name:'ChatGPT',provider:'OpenAI',cost_band:'free_or_paid',tags:['ai','writing','search','knowledge','creative','coding','management'],why:'文章・調査・整理・壁打ちを1つの入口にまとめやすい',next:'まず無料/既存契約の範囲で、毎週繰り返す1作業だけ試す'},
  {id:'notebooklm',kind:'ai_saas',name:'NotebookLM',provider:'Google',cost_band:'free_or_paid',tags:['knowledge','search','training','information'],why:'手元資料を根拠に整理・質問する用途と相性がよい',next:'よく参照する資料を小さくまとめ、質問時間が減るか測る'},
  {id:'make',kind:'ai_saas',name:'Make',provider:'Make',cost_band:'free_or_paid',tags:['automation','integration','rpa','spreadsheet'],why:'転記・通知・サービス間連携の反復を減らしやすい',next:'最頻の転記1本だけを対象に、手動時間と失敗率を比較する'},
  {id:'zapier',kind:'ai_saas',name:'Zapier',provider:'Zapier',cost_band:'free_or_paid',tags:['automation','integration','rpa'],why:'多数のSaaS間で定型処理をつなぐ候補になる',next:'既存ツール同士の1フローだけ試し、追加契約前に効果を見る'},
  {id:'codex',kind:'ai_saas',name:'Codex',provider:'OpenAI',cost_band:'plan_dependent',tags:['coding','devops','ai'],why:'実装・修正・レビューなど開発作業をエージェント化しやすい',next:'小さな修正をテスト条件込みで任せ、完了時間を比較する'},
  {id:'second-monitor',kind:'physical',name:'サブモニター / モバイルモニター',provider:'multiple',cost_band:'one_time',tags:['physical','mobile','spreadsheet','writing','coding'],why:'参照しながら入力する作業では画面切替を減らせる可能性がある',next:'まず手持ち端末や既存モニターで2画面を試し、購入は効果確認後'},
  {id:'headset',kind:'physical',name:'ヘッドセット / マイク',provider:'multiple',cost_band:'one_time',tags:['communication','customer','training','mobile'],why:'会議・接客・音声入力が多い場合の摩擦を減らせる可能性がある',next:'現在の音声トラブル頻度を確認し、問題がなければ買わない'},
  {id:'workflow-review',kind:'service',name:'業務改善スポット診断',provider:'specialist',cost_band:'quote',tags:['workflow','management','decision','discovery'],why:'ツール導入前に業務そのものを変えた方が大きく効く場合がある',next:'まず無料改善を試し、複数人・複数部署にまたがる時だけ検討する'}
 ];
 function find(tags,kind){return items.map(x=>({...x,fit:x.tags.filter(t=>tags.includes(t)).length})).filter(x=>x.fit>0&&(!kind||x.kind===kind)).sort((a,b)=>b.fit-a.fit).map(({fit,...x})=>x)}
 return {items,find};
});
