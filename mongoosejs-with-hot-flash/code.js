const mongoose = require('mongoose')
require('dotenv').config()

// LEARN: ALL CONNECTION AND MODEL RELATED STUFF GOES HERE..
connectToDb(async () => {
	await require('./initMongodb.js')
})

beforeAll(async () => {
	log('::beforeAll::Dropping the database', DB_NAME)
	const db = mongoose.connection
	await db.dropDatabase() // This drops the currently connected database intelligently i.e., we don't need give the name of the db as it delete the same db to which we are connected to.
})

// LEARN: You may never use console.log but simply use debugger to debug values like reply below by placing breakpoint in the functin end brace.
test('save', async () => {
	// LEARN: Placing this in beforeAll or top scope causes issues.
	let bruno = new personModel({
		name: 'Bruno Mars',
		phoneNumber: 123456789,
		address: 'Some address here',
	})
	let reply1 = await bruno.save()
	if (reply1.name !== 'Bruno Mars') throw new Error('Pikachu not saved!')

	let pikachu = new personModel({
		name: 'Pikachu',
		phoneNumber: 987654321,
		address: 'New York City',
	})
	let reply2 = await pikachu.save()
	if (reply2.name !== 'Pikachu') throw new Error('Pikachu not saved!')
})

test('find', async () => {
	let reply = await personModel.find() // This may find multiple docuemnts
	// log(reply)
})

test('findOne', async () => {
	const documentFilter = {name: 'Bruno Mars'}
	let reply = await personModel.findOne(documentFilter) // This would only return first matching document only.

	let person = reply.toObject() //? LEARN: Without .toObject we can't access the properties at all. Src: https://stackoverflow.com/a/32634029/10012446
	if (person.name !== 'Bruno Mars')
		throw new Error('Did not found the document.')
})

test('findById', async () => {
	let person = await personModel.findOne({name: 'Bruno Mars'})
	let _id = person._id
	let reply = await personModel.findById(_id)
})

test('findByIdAndRemove', async () => {
	let person = await personModel.findOne({name: 'Bruno Mars'})
	let _id = person._id

	let reply2 = await personModel.findByIdAndRemove(_id)
})

test('deleteOne', async () => {
	let person = await personModel.findOne({name: 'Pikachu'})
	let _id = person._id

	let reply = await personModel.deleteOne({_id})
})

test('insertMany', async () => {
	let arr = require('./data')
	let reply = await personModel.insertMany(arr) // Docs (insertMany): https://mongoosejs.com/docs/api.html#model_Model.insertMany
})

test('deleteMany', async () => {
	let reply = await personModel.deleteMany({})
})

test('pagination', async () => {
	const page = 3 // Values: 1, 2, 3, ...
	const limit = 2
	const skip = (page - 1) * limit
	let reply = await personModel
		.find({})
		.sort({name: 'asc'})
		.limit(limit)
		.skip(skip) // PAGINATION ROCKS WITH MONGOOSE, SRC: HTTPS://STACKOVERFLOW.COM/A/61354694/10012446
})

test('populate', async () => {
	const iphone = new gadgetModel({
		deviceName: 'Parineeti',
		deviceId: 101,
	})
	const nokia = new gadgetModel({
		deviceName: 'Alia Bhatt',
		deviceId: 102,
	})

	let gadget1 = await iphone.save()
	let gadget2 = await nokia.save()

	let _id = mongoose.Types.ObjectId() // creating `_id` manually to be able to avoid confusion later on; src: https://stackoverflow.com/a/17899751/10012446

	let ManchandaGoyal = new personModel({
		_id,
		name: 'Bruno Mars',
		phoneNumber: 123456789,
		address: 'Some address here',
		gadgetlist: [gadget1._id],
	})
	let reply1 = await ManchandaGoyal.save()

	// Pushing item to array using $push method
	let reply = await personModel.findByIdAndUpdate(_id, {
		$push: {
			gadgetlist: [gadget2._id],
		},
	})

	let gadgetList = [gadget1._id, gadget2._id]
	let personGadgetList = reply.gadgetlist

	const includesAllIds = gadgetList.every((gadgetId) =>
		personGadgetList.includes(gadgetId)
	)

	// First Assertion
	if (!includesAllIds) {
		throw new Error('gadget 1 or 2 or both are not there..!')
	}

	// Get a populated person
	let replyPopulated = await personModel.findById(_id).populate('gadgetlist')
	const deviceNames = [gadget1.deviceName, gadget2.deviceName]
	const personDeviceNames = replyPopulated.gadgetlist.map((g) => g.deviceName)

	const includesAllNames = deviceNames.every((g) =>
		personDeviceNames.includes(g)
	)
	// log({deviceNames, personDeviceNames})// DEBUG

	// Second Assertion
	if (!includesAllNames) {
		throw new Error('Does not include any or all of the devices!')
	}
})

test('update never delete older data', async () => {
	let _id = mongoose.Types.ObjectId()

	let ManchandaGoyal = new personModel({
		_id,
		name: 'Bruno Mars',
		phoneNumber: 123456789,
		address: 'Some address here',
	})
	let person = await ManchandaGoyal.save()

	// LEARN: We are updating nothing, this is safe i.e., not data will be overwritten.
	let newProperties = {} // LEARN: In mongodb, updation of document happens like: newDocument = {...updateDocument ,...oldDocuemnt} , that means older proeperties will persist even if you omit in `updatedObject` while updating a document. Yikes!!

	let updated = await personModel.findByIdAndUpdate(_id, newProperties)
	let updatePerson = updated.toObject()

	let c1 = person.name === 'Bruno Mars'
	let c2 = person.phoneNumber === 123456789
	let c3 = person.address === 'Some address here'

	let c4 = updatePerson.name === 'Bruno Mars'
	let c5 = updatePerson.phoneNumber === 123456789
	let c6 = updatePerson.address === 'Some address here'
	// log({c1, c2, c3, c4, c5, c6})

	let good = c1 && c2 && c3 && c4 && c5 && c6
	if (!good) throw new Error('some value got deleted.')
})

test('dropCollection', async () => {
	const db = mongoose.connection
	await db.dropCollection(PERSON_COLLECTION_NAME) // LEARN: This will throw error if the colleciton is already not there!
})

// OTHERS
// ? What is Projection operator ?
// Ans. It helps in overfetching data.
// We can use projection with mongoose using select as shown below:

// let reply = await personModel.find({}).select('name')
// LEARN: Using the select method we can limit the fields fetched from the db directly, i.e., we can make use of projection operator to fetch only the desired data only, and we can verify the execution query form mongoose as debug mode is on thereby it shows query as: ```persons.find({}, { projection: { name: 1 } })```
// ? Docs of select method: https://mongoosejs.com/docs/api.html#query_Query-select
