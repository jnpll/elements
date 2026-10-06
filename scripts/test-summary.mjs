import { appendFileSync, readFileSync } from "node:fs";

const outcome = process.env.TEST_OUTCOME || "unknown";
let summary = `## Elements Unit Tests\n\nWorkflow test step: **${outcome}**\n\n`;
try {
  const results = JSON.parse(readFileSync("test-results/unit/results.json", "utf8"));
  summary += `| Total | Passed | Failed | Skipped |\n| --- | --- | --- | --- |\n| ${results.numTotalTests} | ${results.numPassedTests} | ${results.numFailedTests} | ${results.numPendingTests} |\n`;
} catch {
  summary += "No test report was produced. Check the install, build, and test logs.\n";
}
summary += "\nJUnit, JSON, and coverage reports are available in the test-results artifact when produced.\n";
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, summary);
else process.stdout.write(summary);
