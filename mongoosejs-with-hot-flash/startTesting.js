require('dotenv').config()
// require('./_setup_test_globals.js')
require('flash') // I linked to this local _setup_test_globas.js file using `npm link`, so you might need to run `npm link flash` in this project once to make it work with npm.

require('hot-module-replacement')({
	ignore: /node_modules/,
})

// Check if user passed -w or --watch flag
let watching = process.argv.includes('-w') || process.argv.includes('--watch')

let beforeAllFn = () => {}
global.beforeAll = (cb) => {
	beforeAllFn = cb
}

let closeDbFn = () => {}
global.closeDb = (cb) => {
	closeDbFn = cb
}

let connected = false
global.persistConnection = null
global.connectToDb = async (cb) => {
	if (connected) return

	await cb()
	connected = true

	// Run beforeAll method (FYI: See LEARN*1)
	await beforeAllFn()

	// We're ready to run tests now coz connection is successful
	runTests()

	if (!watching) {
		await closeDbFn()
	} else {
		// Keep the event loop busy with minimal load!
		setTimeout(() => {}, 24 * 60 * 60 * 1000) // 24hrs
	}
}

// running codejs here..
require('./code.js')

if (module.hot) {
	// console.log('here....')
	module.hot.accept('./code.js', async () => {
		// LEARN: This callack is run only after code.js is loaded!

		// RE-RUN BEFOREALL BEFORE RUNNING TESTSUITE
		// LEARN*1: I run beforeAll even when the connection is active, this is beneficial say when you want your dbs or collecitons to cleared off.
		clearLogs() // Learn: Using clearLogs here helps us print logs of beforeAll on each execution as well. Yikes!
		await beforeAllFn()

		runTests()
	})
}

function clearLogs() {
	// Clear the output of previous tests  ~ Sahil
	console.clear()

	// Clearn tmux-scroll history
	const {execSync} = require('child_process')
	// execSync('tmux clear-history', {stdio: 'pipe'})
	// This is true craziness!

	try {
		execSync(
			'tmux clear-history -t $(tmux display -pt "${TMUX_PANE:?}" "#{pane_index}")',
			{stdio: 'pipe'}
		)
		// LEARN: Please keep this ^^ line always before the below line!
		execSync('badCommand', {stdio: 'pipe'}) // mimic for people who don't have tmux installed should also be able to run without errors!
	} catch (error) {}
}
