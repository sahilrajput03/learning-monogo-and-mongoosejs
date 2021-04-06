const {personModel, log} = require('./0.mongoclient')

const useAsyncFunc = 1 // 0 = false, 1 = true

const asyncFunc = async () => {
	log('::Using async/await for fetching:')

	let reply = await personModel.find({})
	log('::get.js', {reply})
}

const syncFunc = () => {
	log('::Using callback for fetching:')

	personModel.find({}, function (err, reply) {
		if (err) return console.error(err)
		log('::get.js', {reply})
	})
}

useAsyncFunc ? asyncFunc() : syncFunc()
