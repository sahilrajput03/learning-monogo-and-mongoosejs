const {personModel, log} = require('./0.mongoclient.js')

console.log('message...')
console.error('message...')
console.warn('message...')

const useAsyncFunc = 1 // 0 = false, 1 = true
//LEARN: I have already that in mongoclient.js file(see in that file) => set("returnOriginal", false); //This makes returning of new updated object instead of old object(default in mongoose). Visit for more info: https://mongoosejs.com/docs/api/model.html::model_Model.findByIdAndUpdate
const message = "Updated document of specific `_id` in the collection 'Person'"

const id_via_cli = process.argv[2]

const _id = id_via_cli || '606c07e09d66af7c762b00e8'

const updatedObject = {
	// NOTE: In mongodb, updation of document happens like: newDocument = {...updateDocument ,...oldDocuemnt} , that means older proeperties will persist even if you omit in `updatedObject` while updating a document. Yikes!!
	name: 'old Bigyan',
	tommy: 'Boooooooo',
	gadgetlist: [
		'60096d427d8b711e40ecf6c6',
		'60096102b684d8259c8cd527',
		'60096d427d8b711e40ecf6c6',
	],
}

const asyncFunc = async () => {
	try {
		let reply = await personModel.findByIdAndUpdate(_id, updatedObject)
		log('::findByIdAndUpdate.js', {reply})
		log(message)
	} catch (err) {
		log("Can't delete::", err)
	}
}

const syncFunc = () => {
	// not tested yet!!
	personModel.findByIdAndUpdate(_id, updatedObject, (err, reply) => {
		if (err) {
			console.log('::me error', err)
		} else {
			log(reply)
			log(message)
		}
	})
}

if (useAsyncFunc) {
	log('::Using async/await for fetching:')
	asyncFunc()
} else {
	log('::Using callback for fetching:')
	syncFunc()
}
