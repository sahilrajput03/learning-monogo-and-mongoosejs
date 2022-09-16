const {MongoClient} = require('mongodb')

const URI = 'mongodb://localhost:27017/?maxPoolSize=20&w=majority' // Connection URI
const DB_NAME = 'testdb'

const client = new MongoClient(URI) // Create a new MongoClient

void (async function iif() {
	try {
		await client.connect() // Connect the client to the server (optional starting in v4.7)
		await client.db(DB_NAME).command({ping: 1}) // Establish and verify connection
		const db = client.db(DB_NAME)
		const adminCollection = db.collection('my_collection')
		console.log('Connected successfully to server')

		await main(adminCollection)
	} catch (e) {
		console.dir(e)
	} finally {
		await client.close() // Ensures that the client will close when you finish/error
	}
})()

async function main(adminCollection) {
	// Write
	const result = await adminCollection.insertOne({
		name: 'penny',
		shape: 'round',
		pocket: ['pencil', 'eraser'],
		fire: {
			color: 'red',
			intensity: 'high',
		},
	})
	// console.log(result.insertedId.toString()) // get the _id

	// Read
	const cursor = await adminCollection.find({
		name: 'penny',
	})

	await cursor.forEach(console.log)
}
