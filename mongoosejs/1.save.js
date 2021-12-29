const {personModel, log} = require('./0.mongoclient')

const useAsyncFunc = 1 // * 1 is true, 0 is false.

const ManchandaGoyal = new personModel({
	name: 'old Bigyan 7',
	phoneNumber: 8360267243,
	address: 'Boooo',
	// gadgetlist: [
	// 	'60096d427d8b711e40ecf6c6',
	// 	'60096102b684d8259c8cd527',
	// 	'60096d427d8b711e40ecf6c6',
	// ],
})

// log("#debug manchandagoyal before saving: 'Object.keys(ManchandaGoyal)'", Object.keys(ManchandaGoyal));
// log("#debug manchandagoyal before saving: 'ManchandaGoyal._id'", ManchandaGoyal._id); //Learning you get _id as soon as you execute `new personMode()`,yikes!!

const asyncFunc = async () => {
	log('::Using async/await for save:')

	let reply = await ManchandaGoyal.save()
	log('::save.js', {reply})
}

const syncFunc = () => {
	log('::Using callback for save:')

	ManchandaGoyal.save(function (err, reply) {
		if (err) return console.error(err)
		log('::save.js', {reply})
	})
}

useAsyncFunc ? asyncFunc() : syncFunc()
