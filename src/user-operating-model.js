// Minimal User Operating Model (UOM) for the AI Work Environment MVP.
// Purpose: preserve user intent/constraints separately from products so the same
// model can later power SaaS, physical-product, service and B2B DX recommendations.
// Privacy: this schema intentionally excludes names, email, free text and identifiers.
(function(root,factory){
  const api=factory();
  if(typeof module==='object'&&module.exports) module.exports=api;
  else root.UserOperatingModel=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(){
  const ENUMS={
    goal:new Set(['save_time','reduce_stress','improve_quality','reduce_cost','learn','delegate']),
    budget:new Set(['zero','low','mid']),
    ai_skill:new Set(['beginner','intermediate','advanced']),
    automation_preference:new Set(['low','medium','high']),
    setup_tolerance:new Set(['low','medium','high'])
  };

  function enumValue(key,value,fallback){
    return ENUMS[key].has(value)?value:fallback;
  }

  function safeTokens(values,max=8){
    if(!Array.isArray(values)) return [];
    return [...new Set(values.filter(v=>typeof v==='string'&&/^[a-z0-9_.:-]{1,40}$/i.test(v)))].slice(0,max);
  }

  function create(input={}){
    return {
      schema_version:1,
      goal:enumValue('goal',input.goal,'save_time'),
      pains:safeTokens(input.pains),
      budget:enumValue('budget',input.budget,'zero'),
      ai_skill:enumValue('ai_skill',input.ai_skill,'beginner'),
      automation_preference:enumValue('automation_preference',input.automation_preference,'medium'),
      setup_tolerance:enumValue('setup_tolerance',input.setup_tolerance,'medium'),
      existing_tools:safeTokens(input.existing_tools),
      recommendation_history:[]
    };
  }

  function recordDecision(model,decision={}){
    const next=create(model);
    const history=Array.isArray(model&&model.recommendation_history)?model.recommendation_history:[];
    const item={
      recommendation_id:typeof decision.recommendation_id==='string'?decision.recommendation_id.slice(0,40):'none',
      decision:['accepted','rejected','buy_nothing'].includes(decision.decision)?decision.decision:'rejected'
    };
    next.recommendation_history=[...history.slice(-9),item];
    return next;
  }

  // Adapter for the existing recommendation engine. UOM enriches context without
  // making affiliate payout, identity, or sensitive profile data ranking inputs.
  function toRecommendationContext(model){
    const m=create(model);
    return {
      budget:m.budget,
      preference_tags:[
        `goal:${m.goal}`,
        `automation:${m.automation_preference}`,
        `setup:${m.setup_tolerance}`,
        ...m.pains.map(x=>`pain:${x}`)
      ]
    };
  }

  return {create,recordDecision,toRecommendationContext};
});
