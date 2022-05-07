const {personModel, log} = require('./0.mongoclient')

// NOTE: When a document is deleted from a collection, it gets logged as reply too. Yikes!

const useAsyncFunc = 1 // 0 = false, 1 = true

const message =
	"::Successfully deleted document of specific `_id` in the collection 'Person'..."

const id_via_cli = process.argv[2]

const _id = id_via_cli || '606c07e09d66af7c762b00e8'

const asyncFunc = async () => {
	log('::Using async/await:')

	try {
		let reply = await personModel.findByIdAndRemove(_id)
		if (reply) {
			log('::findByIdAndRemove.js', {reply})
			log(message)
		} else {
			log("::mylog:: Can't find any matching document to delete...")
		}
	} catch (err) {
		log('Error occured when trying to delete::', err)
	}
}

const syncFunc = () => {
	log('::Using callback:')

	personModel.findByIdAndRemove(_id, (err, reply) => {
		if (err) {
			return console.log('::me error', err)
		}
		if (reply) {
			log('::findByIdAndRemove.js', {reply})
			log(message)
		} else {
			log("::mylog:: Can't find any matching document to delete...")
		}
	})
}

useAsyncFunc ? asyncFunc() : syncFunc
// if (useAsyncFunc) {
//   asyncFunc();
// } else {
//   syncFunc();
// }
