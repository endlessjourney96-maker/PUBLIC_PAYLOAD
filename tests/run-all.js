// Single-command local/CI preflight for the AI work-style MVP.
// Run: node tests/run-all.js
// Exits non-zero on the first broken contract.
const { spawnSync } = require('node:child_process');

const suites = [
  'tests/recommendation-integration.test.js',
  'tests/analytics-contract.test.js',
  'tests/analytics-bridge.test.js'
];

for (const suite of suites) {
  const result = spawnSync(process.execPath, [suite], { stdio: 'inherit' });
  if (result.error) {
    console.error(`preflight failed to start: ${suite}: ${result.error.message}`);
    process.exit(1);
  }
  if (result.status !== 0) {
    console.error(`preflight failed: ${suite}`);
    process.exit(result.status || 1);
  }
}

console.log('MVP preflight: recommendation + analytics/assets + browser bridge contracts OK');
