const {personModel, log} = require('./0.mongoclient')

const useAsyncFunc = 0 // * 1 is true, 0 is false.

// const ManchandaGoyal = new personModel({
// 	name: 'Bigyan 1',
// 	phoneNumber: 123456789,
// 	address: 'Some address here',
// })

const arr = [
	{
		name: 'Bigyan 1',
		phoneNumber: 123456789,
		address: 'Some address here',
	},
	{
		name: 'Bigyan 2',
		phoneNumber: 123456789,
		address: 'Some address here',
	},
	{
		name: 'Bigyan 3',
		phoneNumber: 123456789,
		address: 'Some address here',
	},
	{
		name: 'Bigyan 4',
		phoneNumber: 123456789,
		address: 'Some address here',
	},
	{
		name: 'Bigyan 5',
		phoneNumber: 123456789,
		address: 'Some address here',
	},
	{
		name: 'Bigyan 6',
		phoneNumber: 123456789,
		address: 'Some address here',
	},
	{
		name: 'Bigyan 7',
		phoneNumber: 123456789,
		address: 'Some address here',
	},
]

// log("#debug manchandagoyal before saving: 'Object.keys(ManchandaGoyal)'", Object.keys(ManchandaGoyal));
// log("#debug manchandagoyal before saving: 'ManchandaGoyal._id'", ManchandaGoyal._id); //Learning you get _id as soon as you execute `new personMode()`,yikes!!

const asyncFunc = async () => {
	log('::Using async/await for save:')

	let reply = await personModel.insertMany(arr)
	// insertMany docs: https://mongoosejs.com/docs/api.html#model_Model.insertMany
	log('::save.js', {reply})
}

const syncFunc = () => {
	log('::Using callback for save:')

	personModel.insertMany(arr, function (err, reply) {
		if (err) return console.error(err)
		log('::save.js', {reply})
	})
}

useAsyncFunc ? asyncFunc() : syncFunc()
