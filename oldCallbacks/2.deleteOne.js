const mongoose = require('mongoose')
const {personModel, log} = require('./0.mongoclient')

const useAsyncFunc = 0 // 0 = false, 1 = true

const message = "Deleted document of specific `_id` in the collection 'Person'"

const id_via_cli = process.argv[2]

const _id = id_via_cli || '606c07e09d66af7c762b00e8'

const asyncFunc = async () => {
	log('::Using async/await for fetching:')
	try {
		let reply = await personModel.deleteOne({_id})
		log('::get.js', {reply})
		log(message)
	} catch (err) {
		log("Can't delete::", err)
	}
}

const syncFunc = () => {
	log('::Using callback for fetching:')
	personModel.deleteOne({_id}, (err, reply) => {
		if (err) {
			console.log('::me error', err)
		} else {
			log(reply)
			log(message)
		}
	})
}

useAsyncFunc ? asyncFunc() : syncFunc()
