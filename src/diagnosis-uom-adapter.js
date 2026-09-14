// Minimal adapter from the existing 3-question diagnosis to User Operating Model.
// It deliberately infers only fields supported by current answers; no extra questions,
// identity, free text, or affiliate data are introduced.
(function(root,factory){
  const api=factory(typeof module==='object'&&module.exports?require('./user-operating-model.js'):root.UserOperatingModel);
  if(typeof module==='object'&&module.exports) module.exports=api;
  else root.DiagnosisUOMAdapter=api;
})(typeof globalThis!=='undefined'?globalThis:this,function(UOM){
  const PAIN_BY_PATTERN={
    information:'information_overload', writing:'document_work', coordination:'coordination',
    numbers:'spreadsheet_work', repetition:'repetitive_tasks', customer:'customer_response',
    field:'field_work', teaching:'knowledge_transfer', creative:'creative_work',
    technical:'technical_work', management:'decision_bottleneck', other:'unstructured_work'
  };
  const GOAL_BY_PATTERN={
    information:'save_time', writing:'save_time', coordination:'reduce_stress', numbers:'save_time',
    repetition:'delegate', customer:'improve_quality', field:'reduce_stress', teaching:'improve_quality',
    creative:'improve_quality', technical:'save_time', management:'reduce_stress', other:'learn'
  };
  function fromDiagnosis(input={}){
    const pattern=typeof input.pattern==='string'&&PAIN_BY_PATTERN[input.pattern]?input.pattern:'other';
    return UOM.create({
      goal:GOAL_BY_PATTERN[pattern],
      pains:[PAIN_BY_PATTERN[pattern]],
      budget:input.budget,
      // Current three questions do not support honest inference of skill/setup tolerance.
      // Keep privacy-safe UOM defaults until user behavior or explicit future input supports them.
      ai_skill:'beginner', automation_preference:pattern==='repetition'?'high':'medium', setup_tolerance:'medium'
    });
  }
  return {fromDiagnosis};
});
