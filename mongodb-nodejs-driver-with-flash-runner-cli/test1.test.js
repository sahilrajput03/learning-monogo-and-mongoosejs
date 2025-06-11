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
