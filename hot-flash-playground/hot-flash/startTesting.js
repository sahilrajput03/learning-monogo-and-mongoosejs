const mongoose = require('mongoose')
require('dotenv').config()
// require('./_setup_test_globals.js')
require('flash') // I linked to this local _setup_test_globas.js file using `npm link`, so you might need to run `npm link flash` in this project once to make it work with npm.

require('hot-module-replacement')({
	ignore: /node_modules/,
})

let _beforeAll
global.beforeAll = async (cb) => {
	_beforeAll = cb || (() => {})
}

let connected = false
global.persistConnection = null
global.connectToDb = async (cb) => {
	if (connected) {
		// RE-RUN BEFOREALL BEFORE RUNNING TESTSUITE
		// LEARN*1: I run beforeAll even when the connection is active, this is beneficial say when you want your dbs or collecitons to cleared off.
		await _beforeAll()
		return
	}

	// log('...here...')
	// log(persistConnection, connected)

	await mongoose.disconnect()
	await cb()
	connected = true

	// Run beforeAll method (FYI: See LEARN*1)
	await _beforeAll()

	// We're ready to run tests now coz connection is successful
	runTests()
}

// running codejs here..
require('./code.js')

if (module.hot) {
	// console.log('here....')
	module.hot.accept('./code.js', () => {
		// LEARN: This callack is run only after code.js is loaded!

		// Clear the output of previous tests  ~ Sahil
		console.clear()

		runTests()
	})
}
