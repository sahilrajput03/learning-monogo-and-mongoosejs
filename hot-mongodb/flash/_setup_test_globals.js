console.log('---> Starting test suite <---')

let tests = []
let onlyTests = [] // facilitates to run a list of test.only tests to be run.

const test = (name, cb) => {
	tests.push({name, cb})
}
test.only = (name, cb) => {
	onlyTests.push({name, cb})
}

const testRunner = async ({name, cb}) => {
	log('\n::TEST::', name)
	try {
		await cb()
		log('\tTEST PASSED  ✅')
	} catch (e) {
		console.log('\tTEST FAILED:❌')
		console.log(e)
	}
}
// FYI :: I WOULD NEED TO RUN RUNTEST MANUALLY IN THE END OF THIS FILE.
const runTests = async () => {
	if (onlyTests.length > 0) {
		log('----->>>USING TEST.ONLY<<<<----')
		for await (const test of onlyTests) {
			await testRunner(test)
		}
	} else {
		for await (const test of tests) {
			await testRunner(test)
		}
	}

	tests = [] // IMPORTANT: Empty the tests array so later when we re-run the tests it won't rerun older queued tests.
	onlyTests = [] // IMPORTANT: Empty the tests array so later when we re-run the tests it won't rerun older queued tests.
}

// This doesn't work man idk why!
// global = {...global, tests, test, testRunner, runTests}
// global = {tests, test, testRunner, runTests}

// What is global in nodejs?
// Ans. https://stackoverflow.com/a/66293366/10012446

global.log = console.log

global.test = test
global.runTests = runTests
