const path = require("path");
const { readFileSync } = require("fs");
const assert = require("uvu/assert");
const prettier = require("prettier");

const testRoot = (...args) => path.join(__dirname, ...args);

const testResultsPath = testRoot("results/test-results.json");
const multiMeasureResultsPath = testRoot("results/multi-measure-results.json");

/** @type {import('../src/global').TachResults} */
const testResults = JSON.parse(readFileSync(testResultsPath, "utf8"));

/** @type {() => import('../src/global').TachResults} */
const copyTestResults = () => JSON.parse(JSON.stringify(testResults));

const multiMeasureResults = JSON.parse(
	readFileSync(multiMeasureResultsPath, "utf8")
);

/** @type {() => import('../src/global').TachResults} */
const getMultiMeasureResults = () =>
	JSON.parse(JSON.stringify(multiMeasureResults));

/** @type {(html: string) => string} */
const formatHtml = (html) =>
	prettier.format(html, { parser: "html", useTabs: true });

const shouldAssertFixtures =
	process.env.TACH_REPORTER_SKIP_SNAPSHOT_TESTS !== "true";

if (!shouldAssertFixtures) {
	console.log("Skipping asserting fixtures");
}

function assertFixture(actual, expected, message) {
	if (shouldAssertFixtures) {
		assert.fixture(actual, expected, message);
	}
}

const getBenchmarkSectionId = (id) =>
	`tachometer-reporter-action--results-${id ? id : ""}`;
const getSummaryId = (id) =>
	`tachometer-reporter-action--summary-${id ? id : ""}`;
const getSummaryListId = () => `tachometer-reporter-action--summaries`;
const getResultsContainerId = () => `tachometer-reporter-action--results`;

/**
 * @template T
 * @template K
 * @param {T} obj
 * @param {K} keys
 * @returns {Pick<T, K>}
 */
function pick(obj, keys) {
	let newObj = {};

	// @ts-ignore
	for (let key of keys) {
		newObj[key] = obj[key];
	}

	// @ts-ignore
	return newObj;
}

function skipSuite(suite) {
	function fakeSuite(...params) {}
	fakeSuite.run = function fakeRun(...params) {};
	fakeSuite.before = function fakeBefore(...params) {};
	fakeSuite.before.each = function fakeBeforeEach(...params) {};
	fakeSuite.after = function fakeAfter(...params) {};
	fakeSuite.after.each = function fakeAfterEach(...params) {};

	return fakeSuite;
}

module.exports = {
	pick,
	skipSuite,
	testRoot,
	copyTestResults,
	getMultiMeasureResults,
	formatHtml,
	shouldAssertFixtures,
	assertFixture,
	getBenchmarkSectionId,
	getSummaryId,
	getSummaryListId,
	getResultsContainerId,
};
