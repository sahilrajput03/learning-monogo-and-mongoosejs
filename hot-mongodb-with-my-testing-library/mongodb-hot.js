const mongoose = require('mongoose')
require('dotenv').config()
require('./_setup_test_globals.js')

require('hot-module-replacement')({
	ignore: /node_modules/,
})

// running codejs here..
require('./code.js')

let beforeAll = async () => {
	connection = await mongoose.connect(
		'mongodb://localhost:27017/test_' + process.env.DATABASE,
		{useNewUrlParser: true, useUnifiedTopology: true}
	)
	db = mongoose.connection
	const collection = process.env.COLLECTION

	global.customers = mongoose.model(
		'test_' + process.env.COLLECTION,
		mongoose.Schema({
			name: String,
			email: String,
		})
	)

	// We're ready to run tests now coz connection is successful
	runTests()
}

beforeAll()

if (module.hot) {
	console.log('here....')
	module.hot.accept('./code.js', () => {
		// LEARN: This callack is run only after code.js is loaded!
		
		// Clear the output of previous tests  ~ Sahil
		console.clear()

		runTests()
	})
}
