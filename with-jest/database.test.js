const mongoose = require('mongoose')
require('dotenv').config()
let log = console.log

let name = process.env.CUSTOMER_NAME
let email = process.env.CUSTOMER_EMAIL

describe('Customer CRUD', () => {
	let connection
	let database
	const customers = mongoose.model(
		'test_' + process.env.COLLECTION,
		mongoose.Schema({
			name: String,
			email: String,
		})
	)

	beforeAll(async () => {
		connection = await mongoose.connect(
			'mongodb://localhost:27017/test_' + process.env.DATABASE,
			{useNewUrlParser: true, useUnifiedTopology: true}
		)
		db = mongoose.connection
		const collection = process.env.COLLECTION
		await db.createCollection(collection)
	})

	afterAll(async () => {
		const collection = 'test_' + process.env.COLLECTION
		await db.dropCollection(collection)
		await db.dropDatabase()
		await db.close()
		// await connection.close(); // Doesn't work anymore.
		await mongoose.disconnect() // Mongoose Docs: Runs .close() on all connections in parallel.
	})

	test('Add Customer POST /customers', async () => {
		const response = await customers.create({
			name,
			email,
		})
		await response.save()
		expect(response.name).toBe(name)
	})

	test('All Customers GET /customers', async () => {
		const response = await customers.find({})
		expect(response.length).toBeGreaterThan(0)
	})

	test('Update Customer PUT /customers/:id', async () => {
		const response = await customers.updateOne(
			{name},
			{email: process.env.CUSTOMER_EMAIL_ALT}
		)
		// log(response)
		expect(response.modifiedCount).toEqual(1)
	})

	test('Customer update is correct', async () => {
		const responseTwo = await customers.findOne({name})
		expect(responseTwo.email).toBe(process.env.CUSTOMER_EMAIL_ALT)
	})

	test('Delete Customer DELETE /customers/:id', async () => {
		const response = await customers.deleteOne({name})
		// log(response)
		expect(response.deletedCount).toBe(1)
	})
})
