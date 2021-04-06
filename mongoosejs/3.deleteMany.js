const {personModel, log} = require('./0.mongoclient')

const useAsyncFunc = 0 // 0 = false, 1 = true

const message = "Deleted all the documents in the collection 'Person'"

const asyncFunc = async () => {
	log('::Using async/await for fetching:')

	let reply = await personModel.deleteMany({})
	log('::get.js', {reply})
	log(message)
}

const syncFunc = () => {
	log('::Using callback for fetching:')

	personModel.deleteMany({}, (err, reply) => {
		if (err) {
			console.log('::me error', err)
		} else {
			log(reply)
			log(message)
		}
	})
}

useAsyncFunc ? asyncFunc() : syncFunc()
