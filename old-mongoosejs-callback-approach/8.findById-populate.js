const {personModel, log} = require('./0.mongoclient')

const useAsyncFunc = 1 // 0 = false, 1 = true

const asyncFuncPopulate = async () => {
	try {
		let reply = await personModel.findById(_id).populate('gadgetlist')
		log('::findById.js<Using async/await>', {reply})
		log(':: populatedpart', reply.gadgetlist)
	} catch (err) {
		log("Can't findbyid::", err)
	}
}

const syncFuncPopulate = () => {
	// not tested yet!!
	personModel
		.findById(_id)
		.populate('gadgetlist')
		.exec(function (err, reply) {
			if (err) log('::shit error')
			console.log('syncFuncPopulate', {reply})
			console.log('syncFuncPopulate,populatedpart', reply && reply.gadgetlist)
			// prints "The author is Ian Fleming"
		})
}

useAsyncFunc ? asyncFuncPopulate() : syncFuncPopulate()
