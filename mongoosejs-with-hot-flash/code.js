const mongoose = require('mongoose')
require('dotenv').config()
const {expect} = require('expect')
// expect DOCS (from jest): https://jestjs.io/docs/expect
// toMatchObject: (src: https://jestjs.io/docs/expect#tomatchobjectobject) Used to check that a JavaScript object matches a subset of the properties of an object

// LEARN: ALL CONNECTION AND MODEL RELATED STUFF GOES HERE..
connectToDb(async () => {
	await require('./initMongodb.js')
})

beforeAll(async () => {
	log('::beforeAll::Dropping the database', DB_NAME)
	const db = mongoose.connection
	await db.dropDatabase() // This drops the currently connected database intelligently i.e., we don't need give the name of the db as it delete the same db to which we are connected to.
})

const _bruno = {
	name: 'Bruno Mars',
	phoneNumber: 123456789,
	address: 'Some address here',
}

const _pikachu = {
	name: 'Pikachu',
	phoneNumber: 987654321,
	address: 'New York City',
}
// LEARN: You may never use console.log but simply use debugger to debug values like reply below by placing breakpoint in the functin end brace.
test('save', async () => {
	let bruno = new personModel(_bruno) // LEARN: Placing this in beforeAll or top scope causes issues.
	expect(bruno).toHaveProperty('_id')
	// log(bruno._id)// a dynamic _id is assigned here already!

	expect(bruno).toMatchObject(_bruno)

	let reply1 = await bruno.save()
	expect(reply1).toMatchObject(bruno)

	let pikachu = new personModel(_pikachu)
	let reply2 = await pikachu.save()
	expect(reply2).toMatchObject(pikachu)
})

test('find', async () => {
	let reply = await personModel.find() // This may find multiple docuemnts
	expect(() => {
		reply.toObject() // Since we can't call toObject directly to array so this throws error.
	}).toThrow()

	reply = reply.map((doc) => doc.toObject())

	expect(reply[0]).toMatchObject(_bruno)
	expect(reply[1]).toMatchObject(_pikachu)
})

test('findOne', async () => {
	const documentFilter = {name: 'Bruno Mars'}
	let reply = await personModel.findOne(documentFilter) // This would only return first matching document only.

	expect(() => {
		expect(reply).toMatchObject(_bruno)
	}).toThrow()

	let person = reply.toObject() //? LEARN: Without .toObject we can't access the properties at all. Src: https://stackoverflow.com/a/32634029/10012446
	expect(person).toMatchObject(_bruno)
})

test('findById', async () => {
	let person = await personModel.findOne({name: 'Bruno Mars'})
	expect(() => {
		expect(reply).toMatchObject(_bruno)
	}).toThrow()

	let _id = person._id
	let reply = await personModel.findById(_id)
	expect(reply.toObject()).toMatchObject(_bruno)
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

	reply = reply.map((doc) => doc.toObject())

	// log(reply)
	reply.forEach((doc, idx) => {
		expect(doc).toMatchObject(arr[idx])
	})
})

test('deleteMany', async () => {
	let reply = await personModel.deleteMany({})
	expect(reply.ok).toBe(1)
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

	let manchanda = {
		_id,
		name: 'Bruno Mars',
		phoneNumber: 123456789,
		address: 'Some address here',
	}
	let ManchandaGoyal = new personModel(manchanda)
	let person = await ManchandaGoyal.save()

	expect(person).toMatchObject(ManchandaGoyal)

	// LEARN: We are updating nothing, this is safe i.e., not data will be overwritten.
	let newProperties = {} // LEARN: In mongodb, updation of document happens like: newDocument = {...updateDocument ,...oldDocuemnt} , that means older proeperties will persist even if you omit in `updatedObject` while updating a document. Yikes!!

	let updated = await personModel
		.findByIdAndUpdate(_id, newProperties)
		.populate('gadgetlist')
		.lean()
	// LEARN: lean() method above tells mongoose to call .toObject() method internally for this query. So, we don't need as:
	// xxx ^--> let updatePerson = updated.toObject()

	delete manchanda.gadgetlist // this was necessary to pass next test!
	expect(updated).toMatchObject(manchanda)
})

test('dropCollection', async () => {
	const db = mongoose.connection
	let status = await db.dropCollection(PERSON_COLLECTION_NAME) // LEARN: This will throw error if the colleciton is already not there!
	expect(status).toBe(true)
})

// OTHERS
// ? What is Projection operator ?
// Ans. It helps in overfetching data.
// We can use projection with mongoose using select as shown below:

// let reply = await personModel.find({}).select('name')
// LEARN: Using the select method we can limit the fields fetched from the db directly, i.e., we can make use of projection operator to fetch only the desired data only, and we can verify the execution query form mongoose as debug mode is on thereby it shows query as: ```persons.find({}, { projection: { name: 1 } })```
// ? Docs of select method: https://mongoosejs.com/docs/api.html#query_Query-select
