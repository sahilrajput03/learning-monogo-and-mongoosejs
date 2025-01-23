const {connect, set} = require('mongoose')

set('returnOriginal', false) //This makes returning of new updated object instead of old object(default in mongoose). Visit for more info: https://mongoosejs.com/docs/api/model.html#model_Model.findByIdAndUpdate
// IMPORTANT: ↑↑↑↑↑↑↑↑↑↑↑

// set('debug', true)
// ^^ This to enable mongoose debug mode.

const DB_NAME = 'testdb'
const DB_URI = 'mongodb://localhost/' + DB_NAME

async function connectFn() {
	return await connect(DB_URI, {
		// @ts-ignore
		useNewUrlParser: true,
		useUnifiedTopology: true,

		//? LEARN useFindAndModify and useCreateIndex are not supported in mongoose v6 but supported in v5
		// useFindAndModify: false,
		// useCreateIndex: true,
	})

	console.log(':INFO: CONNECTION TO DB SUCCESSFUL.')
}

let connectPromise = connectFn()

module.exports = {connectPromise, DB_NAME, DB_URI}
