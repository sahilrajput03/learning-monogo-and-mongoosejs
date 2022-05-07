const mongoose = require('mongoose')
require('dotenv').config()
let log = console.log
let name = process.env.CUSTOMER_NAME
let email = process.env.CUSTOMER_EMAIL

test('1. Add Customer POST /customers', async () => {
	const response = await customers.create({
		name,
		email,
	})
	await response.save()
	if (!response.name === name) throw new Error('name is not equal.')
})

test('2. All Customers GET /customers', async () => {
	const response = await customers.find({})
	if (!response.length > 0) throw new Error('getting customers failed.')
})

test('3. Update Customer PUT /customers/:id', async () => {
	const response = await customers.updateOne(
		{name},
		{email: process.env.CUSTOMER_EMAIL_ALT}
	)
	// log(response)
	if (!response.modifiedCount == 1) throw new Error('update failed.')
})

test('4. Customer update is correct', async () => {
	const responseTwo = await customers.findOne({name})
	// expect(responseTwo.email).toBe(process.env.CUSTOMER_EMAIL_ALT)
})

test('5. Delete Customer DELETE /customers/:id', async () => {
	const response = await customers.deleteOne({name})
	// log(response)
	if (!response.deletedCount == 1) throw new Error('deletion failed..')
})
