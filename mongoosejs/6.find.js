const {personModel, log} = require('./0.mongoclient')

const useAsyncFunc = 0 // 0 = false, 1 = true

const asyncFunc = async () => {
	log('::Using async/await for fetching:')

	let reply = await personModel.find({})
	// For populating a property:
	// let reply = await personModel.find({}).populate('somefield')

	log('::get.js', {reply})
}

const syncFunc = () => {
	log('::Using callback for fetching:')

	personModel.find({}, function (err, reply) {
		if (err) return console.error(err)
		log('::get.js', {reply})
		// To know about synchronous mode of populate, refer: 8.findById-populate.js
	})
}

useAsyncFunc ? asyncFunc() : syncFunc()
