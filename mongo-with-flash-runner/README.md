# Readme

- Resources: - https://www.mongodb.com/docs/drivers/node/current/fundamentals/connection/connect/#std-label-node-connect-to-mongodb

  - Using `gte` and `lt` operators:

  ```js
  const findResult = await adminCollection.find({
  	name: 'Lemony Snicket',
  	date: {
  		$gte: new Date(new Date().setHours(00, 00, 00)),
  		$lt: new Date(new Date().setHours(23, 59, 59)),
  	},
  })
  ```
