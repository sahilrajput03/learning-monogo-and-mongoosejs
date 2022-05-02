// other file
// const {personModel, log} = require('./0.mongoclient')

module.exports = (personModel) => {
	let log = console.log
	log()
	const useAsyncFunc = 1 // * 1 is true, 0 is false.

	const ManchandaGoyal = new personModel({
		// All below properties are saved bcoz we have set strict: false in database.
		name: 'Bigyan 3',
		phoneNumber: 123456789,
		address: 'Some address here',
		addressAlternate: 'Australia rocks',
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
}
