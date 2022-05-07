const {personModel, log} = require('./0.mongoclient')

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

// Docs (insertMany): https://mongoosejs.com/docs/api.html#model_Model.insertMany
const asyncFunc = async () => {
	let reply = await personModel.insertMany(arr)
	log('::save.js', {reply})
}
