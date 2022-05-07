const {personModel, log} = require('./0.mongoclient')

const asyncFunc = async () => {
	log('::Using async/await for fetching:')

	// ? wow! Using projection operator with mongoose is a piece of cake!
	// ? Docs of select method: https://mongoosejs.com/docs/api.html#query_Query-select
	// let reply = await personModel.find({}).select('name')
	// ^^ using the select method we can limit the fields fetched from the db directly, i.e., we can make use of projection operator to fetch only the desired data only, and we can verify the execution query form mongoose as debug mode is on thereby it shows query as: ```persons.find({}, { projection: { name: 1 } })```

	// PAGINATION ROCKS WITH MONGOOSE, SRC: HTTPS://STACKOVERFLOW.COM/A/61354694/10012446
	const page = 3 // Values: 1, 2, 3, ...
	const limit = 2
	let reply = await personModel
		.find({})
		.sort({name: 'asc'})
		.limit(limit)
		.skip((page - 1) * limit)
	log('::get.js', {reply})
}

asyncFunc()
