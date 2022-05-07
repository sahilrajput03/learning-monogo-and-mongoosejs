const {personModel, log} = require('./0.mongoclient')

const ManchandaGoyal = new personModel({
	name: 'Bigyan 1',
	phoneNumber: 123456789,
	address: 'Some address here',
})

// log("#debug manchandagoyal before saving: 'Object.keys(ManchandaGoyal)'", Object.keys(ManchandaGoyal));
// log("#debug manchandagoyal before saving: 'ManchandaGoyal._id'", ManchandaGoyal._id); //Learning you get _id as soon as you execute `new personMode()`,yikes!!

const asyncFunc = async () => {
	log('::Using async/await for save:')

	let reply = await ManchandaGoyal.save()
	log({reply})
	connection.close()
}

asyncFunc()
