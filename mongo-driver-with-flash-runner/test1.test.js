require('dotenv').config({path: '.env.test'}) // Alway remember to use separate .env.test file for environment.
const {expect} = require('expect')
const {client, connect, COLLECTION_NAME} = require('./initMongo')
const {log} = console

const connectToDb = global.connectToDb,
	closeDb = global.closeDb,
	beforeAll = global.beforeAll,
	test = global.test

// LEARN: ALL CONNECTION AND MODEL RELATED STUFF GOES HERE..
connectToDb(async () => {
	await connect()
	log('Connected successfully to server')
})

closeDb(async () => {
	// Close connection asap in non-watch mode.
	await client.close() // Ensures that the client will close when you finish/error
})

let db, adminCollection

beforeAll(async () => {
	db = global.db
	adminCollection = global.adminCollection

	const collectionExists = await (
		await db.listCollections().toArray()
	).find((c) => c.name.toLowerCase() === COLLECTION_NAME)

	if (collectionExists) await adminCollection.drop() // Drop collection (to have pure testing)
	// await db.dropDatabase() // Drop db
})

const pennyObj = {
	name: 'penny',
	shape: 'round',
	pocket: ['pencil', 'eraser'],
	fire: {
		color: 'red',
		intensity: 'high',
	},
}

test('write', async () => {
	const result = await adminCollection.insertOne(pennyObj)

	const _id = typeof result.insertedId.toString()
	expect(_id).toBe('string')
})

test('read', async () => {
	// `collection.countDocuments()` to count documents in a collection: Returns (type: Number) the count of all documents which match the query we pass as parameter to this function
	let usersCursor = await adminCollection.find()
	const users = await usersCursor.toArray()
	console.log('c?', )

	const pennyDocCount = await adminCollection.countDocuments({
		name: 'penny',
	})
	expect(pennyDocCount).toBe(1)

	// Total Document Count `collection.estimatedDocumentCount()`
	const estimatedDocumentsCount = await adminCollection.estimatedDocumentCount() // Returns (type: Number) the count of all documents in a collection or view.
	expect(estimatedDocumentsCount).toEqual(1)
})

test('delete', async () => {
	const deletedCount = await adminCollection.deleteMany({name: 'penny'})
})

test('create/update lovely command', async () => {
	const createUser = async (user) => {
		console.log('Creaeting user in database:', user.username)
		await adminCollection.update(
			{username: user.username},
			{$set: {...user}},
			{upsert: true}
		)
	}
	await createUser({
		username: 'sahilrajput03',
		age: 25,
		class: 'superb',
	})
	await createUser({
		username: 'sahilrajput03',
		age: 25,
		class: 'superb',
	})
	await createUser({
		username: 'sahilrajput03',
		age: 25,
		class: 'superb',
	})
})

// const _bruno = {
// 	name: 'Bruno Mars',
// 	phoneNumber: 123456789,
// 	address: 'Some address here',
// }

// const _pikachu = {
// 	name: 'Pikachu',
// 	phoneNumber: 987654321,
// 	address: 'New York City',
// }

// LEARN: You may never use console.log but simply use debugger to debug values like reply below by placing breakpoint in the functin end brace.
// test('save bruno', async () => {
// 	let bruno = new personModel(_bruno) // LEARN: Placing this in beforeAll or top scope causes issues.
// 	expect(bruno).toHaveProperty('_id')
// 	// log(bruno._id)// a dynamic _id is assigned here already!

// 	expect(bruno).toMatchObject(_bruno)

// 	let reply1 = await bruno.save()
// 	expect(reply1).toMatchObject(_bruno)
// })

// test('save pikachu', async () => {
// 	let pikachu = new personModel(_pikachu)
// 	let reply2 = await pikachu.save()
// 	expect(reply2).toMatchObject(_pikachu)
// })

// test('find', async () => {
// 	/** @type object */
// 	let reply = await personModel.find() // This may find multiple docuemnts
// 	expect(() => {
// 		reply.toObject() // Since we can't call toObject directly to array so this throws error.
// 	}).toThrow()

// 	reply = reply.map((doc) => doc.toObject())

// 	expect(reply[0]).toMatchObject(_bruno)
// 	expect(reply[1]).toMatchObject(_pikachu)
// })

// test('findOne', async () => {
// 	const documentFilter = {name: 'Bruno Mars'}
// 	let person = await personModel.findOne(documentFilter) // This would only return first matching document only.
// 	expect(person).toMatchObject(_bruno) // works in v6

// 	// Learn: For v5 above test expectation throws error so one needs to call .toObject() method to get real js object like we do below:
// 	// person = person.toObject() //? LEARN: Without .toObject we can't access the properties at all. Src: https://stackoverflow.com/a/32634029/10012446
// 	// expect(person).toMatchObject(_bruno)
// })

// test('findById', async () => {
// 	let person = await personModel.findOne({name: 'Bruno Mars'})
// 	expect(() => {
// 		expect(reply).toMatchObject(_bruno)
// 	}).toThrow()

// 	let _id = person._id
// 	let reply = await personModel.findById(_id)
// 	expect(reply.toObject()).toMatchObject(_bruno)
// })

// test('findByIdAndRemove', async () => {
// 	let person = await personModel.findOne({name: 'Bruno Mars'})
// 	let _id = person._id

// 	let reply2 = await personModel.findByIdAndRemove(_id)
// 	// todo: add expectation here.
// })

// test('deleteOne', async () => {
// 	let person = await personModel.findOne({name: 'Pikachu'})
// 	let _id = person._id

// 	let reply = await personModel.deleteOne({_id})
// })

// test('insertMany', async () => {
// 	let arr = require('./data')
// 	let reply = await personModel.insertMany(arr) // Docs (insertMany): https://mongoosejs.com/docs/api.html#model_Model.insertMany

// 	reply = reply.map((doc) => doc.toObject())

// 	// log(reply)
// 	reply.forEach((doc, idx) => {
// 		expect(doc).toMatchObject(arr[idx])
// 	})
// })

// test('deleteMany', async () => {
// 	let reply = await personModel.deleteMany({})
// 	let numberOfInsertedDoc = require('./data').length

// 	// For v6
// 	expect(reply.deletedCount).toBe(numberOfInsertedDoc)

// 	// For v5
// 	// expect(reply.ok).toBe(1)
// })

// test('pagination', async () => {
// 	const page = 3 // Values: 1, 2, 3, ...
// 	const limit = 2
// 	const skip = (page - 1) * limit
// 	let reply = await personModel
// 		.find({})
// 		.sort({name: 'asc'})
// 		.limit(limit)
// 		.skip(skip) // PAGINATION ROCKS WITH MONGOOSE, SRC: HTTPS://STACKOVERFLOW.COM/A/61354694/10012446
// })

// test('populate', async () => {
// 	let iphoneDoc = new gadgetModel({
// 		deviceName: 'Parineeti',
// 		deviceId: 101,
// 	})
// 	let nokiaDoc = new gadgetModel({
// 		deviceName: 'Alia Bhatt',
// 		deviceId: 102,
// 	})

// 	await iphoneDoc.save()
// 	await nokiaDoc.save()

// 	let _id = new mongoose.Types.ObjectId() // creating `_id` manually to be able to avoid confusion later on; src: https://stackoverflow.com/a/17899751/10012446

// 	let personDoc = new personModel({
// 		_id,
// 		name: 'Bruno Mars',
// 		phoneNumber: 123456789,
// 		address: 'Some address here',
// 		gadgetlist: [iphoneDoc._id],
// 	})

// 	await personDoc.save()

// 	// Way 1 - Inserting a ObjectId to array i.e., `gadgetlist` property.
// 	// Pushing item to array using $push method
// 	// let reply = await personModel.findByIdAndUpdate(_id, {
// 	// 	$push: {
// 	// 		gadgetlist: [nokiaDoc._id],
// 	// 	},
// 	// })

// 	// Way 2 - FSO - Inserting a ObjectId to array i.e., `gadgetlist` property.
// 	personDoc.gadgetlist = personDoc.gadgetlist.concat(nokiaDoc._id)
// 	await personDoc.save({debug: true})

// 	let gadgetList = [iphoneDoc._id, nokiaDoc._id]
// 	let personGadgetList = personDoc.gadgetlist

// 	const includesAllIds = gadgetList.every((gadgetId) =>
// 		personGadgetList.includes(gadgetId)
// 	)

// 	// First Assertion
// 	if (!includesAllIds) {
// 		throw new Error('gadget 1 or 2 or both are not there..!')
// 	}
// 	/*
// 	# Get a populated person
// 	let replyPopulated = await personModel.findById(_id).populate('gadgetlist

// 	# Get a populated person (populate after save, src: populate afer save: https://stackoverflow.com/a/50334013/10012446)
// 	await personDoc.populate('gadgetlist').execPopulate() // works in v5 but doesn't work in v6 as execPopulate is discarded for documents in v6.
// 	# Docs: execPopulate: https://mongoosejs.com/docs/migrating_to_6.html#removed-execpopulate
// 	# Mongoose: Migrating from v5 to v6: https://mongoosejs.com/docs/migrating_to_6.html#removed-execpopulate
// 	*/

// 	await personDoc.populate('gadgetlist')

// 	const deviceNames = [iphoneDoc.deviceName, nokiaDoc.deviceName]
// 	const personDeviceNames = personDoc.gadgetlist.map((g) => g.deviceName)

// 	const includesAllNames = deviceNames.every((g) =>
// 		personDeviceNames.includes(g)
// 	)
// 	// log({deviceNames, personDeviceNames})// DEBUG

// 	// Second Assertion
// 	if (!includesAllNames) {
// 		throw new Error('Does not include any or all of the devices!')
// 	}
// })

// test('update never delete older data', async () => {
// 	let _id = new mongoose.Types.ObjectId()

// 	let _manchanda = {
// 		_id,
// 		name: 'Bruno Mars',
// 		phoneNumber: 123456789,
// 		address: 'Some address here',
// 	}
// 	let person = new personModel(_manchanda)
// 	person = await person.save()

// 	expect(person).toMatchObject(_manchanda)

// 	// LEARN: We are updating nothing, this is safe i.e., not data will be overwritten.
// 	let newProperties = {} // LEARN: In mongodb, updation of document happens like: newDocument = {...updateDocument ,...oldDocuemnt} , that means older proeperties will persist even if you omit in `updatedObject` while updating a document. Yikes!!

// 	person = await personModel
// 		.findByIdAndUpdate(_id, newProperties)
// 		.populate('gadgetlist')
// 		.lean()
// 	// LEARN: lean() method above tells mongoose to call .toObject() method internally for this query. So, we don't need as:
// 	// xxx ^--> let updatePerson = person.toObject()

// 	delete _manchanda.gadgetlist // this was necessary to pass next test!
// 	expect(person).toMatchObject(_manchanda)
// })

// test('dropCollection', async () => {
// 	const db = mongoose.connection
// 	// log(db)
// 	let status = await db.dropCollection(PERSON_COLLECTION) // LEARN: This will throw error if the colleciton is already not there!
// 	expect(status).toBe(true)
// })

// test('custom validator function with custom message', async () => {
// 	// Valid `carName` is `audi` or `bmw`.
// 	let car1Doc = new carModel({
// 		carName: 'audi',
// 	})
// 	let car1 = await car1Doc.save()
// 	// log({car1})
// 	// Above is car is saved successfully!

// 	// Trying to get validation error message (custom validator defined in `carSchema` in models file).
// 	let expectErrName = 'ValidatorError'
// 	let expectedErrMessg = ' is not allowed. Only audi and bmw cars are allowed.'
// 	let error
// 	let car2Doc
// 	try {
// 		car2Doc = new carModel({
// 			carName: 'random-audi',
// 		})
// 		let car2 = await car2Doc.save()
// 	} catch (e) {
// 		error = e
// 	}
// 	expect(error.errors.carName instanceof Error).toBe(true)
// 	expect(error.errors.carName.name).toBe(expectErrName)
// 	expect(error.errors.carName.message).toBe(car2Doc.carName + expectedErrMessg)

// 	// log(error.errors.carName.name)
// 	// log(error.errors.carName.message)
// })

//! Unique key doesn't seem to throw error in watch mode after first execution, why??
// test('unique email test for car saving', async () => {
// 	let car1Doc = new carModel({
// 		carName: 'audi',
// 		email: 'sahil@rajput.com',
// 	})
// 	let car1 = await car1Doc.save()
// 	log({car1})

// 	let expectedErrorName = 'MongoServerError'

// 	let error
// 	try {
// 		// Trying to save new car with an existing email id, should throw unique error:
// 		let car2Doc = new carModel({
// 			carName: 'audi',
// 			email: 'sahil@rajput.com',
// 		})
// 		let car2 = await car2Doc.save()
// 		log({car2})
// 	} catch (e) {
// 		error = e
// 	}
// 	log('got e.name', error?.name)
// 	log('got e.message', error?.message)
// 	log('got e as:', error)
// 	// expect(error?.name).toBe(expectedErrorName)
// 	// expect(error.message).toBe(expectedErrorName)
// })

// OTHERS
// ? What is Projection operator ?
// Ans. It helps in overfetching data.
// We can use projection with mongoose using select as shown below:

// let reply = await personModel.find({}).select('name')
// LEARN: Using the select method we can limit the fields fetched from the db directly, i.e., we can make use of projection operator to fetch only the desired data only, and we can verify the execution query form mongoose as debug mode is on thereby it shows query as: ```persons.find({}, { projection: { name: 1 } })```
// ? Docs of select method: https://mongoosejs.com/docs/api.html#query_Query-select
