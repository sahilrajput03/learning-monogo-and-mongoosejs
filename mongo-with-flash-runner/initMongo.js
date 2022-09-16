const {MongoClient} = require('mongodb')

const URI = 'mongodb://localhost:27017/?maxPoolSize=20&w=majority' // Connection URI
const DB_NAME = 'testdb'
const COLLECTION_NAME = 'my_collection'

const client = new MongoClient(URI) // Create a new MongoClient

const connect = async () => {
	try {
		await client.connect() // Connect the client to the server (optional starting in v4.7)
		await client.db(DB_NAME).command({ping: 1}) // Establish and verify connection
		const db = client.db(DB_NAME)
		const adminCollection = db.collection(COLLECTION_NAME)
		global.db = db
		global.adminCollection = adminCollection
	} catch (e) {
		console.dir(e)
	}
}

module.exports = {
	client,
	connect,
}
