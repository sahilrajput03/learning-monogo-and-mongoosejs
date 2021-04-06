const {personModel, GADGET_COLLECTION_NAME, log} = require('./0.mongoclient')

const useAsyncFunc = 1 // 0 = false, 1 = true

const id_via_cli = process.argv[2]

const _id = id_via_cli || '606c07e09d66af7c762b00e8'

const asyncFunc = async () => {
	log('::Using async/await for fetching:')

	try {
		let reply = await personModel.findById(_id)
		log('::findById.js', {reply})
	} catch (err) {
		log("Can't findbyid::", err)
	}
}

const syncFunc = () => {
	log('::Using callback for fetching:')

	personModel.findById(_id, (err, reply) => {
		if (err) {
			console.log('::me error', err)
		} else {
			log({reply})
		}
	})
}

useAsyncFunc ? asyncFunc() : syncFunc()
