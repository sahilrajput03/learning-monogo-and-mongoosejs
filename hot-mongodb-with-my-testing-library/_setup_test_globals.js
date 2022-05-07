console.log('---> Starting test suite <---')

let tests = []

const test = (name, cb) => {
	tests.push({name, cb})
}

const testRunner = async ({name, cb}) => {
	log('\n::TEST::', name)
	try {
		await cb()
		log('\tTEST PASSED  ✅')
	} catch (e) {
		console.log('\tTEST FAILED:❌')
	}
}
// FYI :: I WOULD NEED TO RUN RUNTEST MANUALLY IN THE END OF THIS FILE.
const runTests = async () => {
	for await (const test of tests) {
		await testRunner(test)
	}

	tests = [] // IMPORTANT: Empty the tests array so later when we re-run the tests it won't rerun older queued tests.
}

// This doesn't work man idk why!
// global = {...global, tests, test, testRunner, runTests}
// global = {tests, test, testRunner, runTests}

// What is global in nodejs?
// Ans. https://stackoverflow.com/a/66293366/10012446

global.log = console.log

global.test = test
global.runTests = runTests
