import { readFileSync } from 'fs';

try {
  let raw = readFileSync('./test-results.json', 'utf16le');
  const data = JSON.parse(raw.replace(/^\uFEFF/, ''));
  const failures = [];
  
  data.testResults.forEach(suite => {
    suite.assertionResults.forEach(test => {
      if (test.status === 'failed') {
        failures.push({
          suite: suite.name.split('/').pop(),
          test: test.title,
          error: test.failureMessages[0]?.substring(0, 300) || 'Unknown error'
        });
      }
    });
  });
  
  if (failures.length === 0) {
    console.log("All tests passed!");
  } else {
    console.log("FAILURES:");
    console.log(JSON.stringify(failures, null, 2));
  }
} catch (err) {
  console.log("Error parsing:", err.message);
}
