// FILE: 0.client file
const {Schema, model, connect, set, connection} = require('mongoose')

set('returnOriginal', false) //This makes returning of new updated object instead of old object(default in mongoose). Visit for more info: https://mongoosejs.com/docs/api/model.html#model_Model.findByIdAndUpdate
// IMPORTANT: ↑↑↑↑↑↑↑↑↑↑↑

set('debug', true)
// ^^ This to enable mongoose debug mode.

const DB_NAME = 'testdb'
const DB_URI = 'mongodb://localhost/' + DB_NAME
const PERSON_COLLECTION_NAME = 'persons' //* You should use pluras names, otherwise mongodb will itself change the name to plurals.
const GADGET_COLLECTION_NAME = 'gadgets' //* You should use pluras names, otherwise mongodb will itself change the name to plurals.

connect(DB_URI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	// useFindAndModify: false,
	// useCreateIndex: true,
})
.then(() => {
	console.log("Connection successful... ☺");
})
// .catch((error) => {
// 	console.log("error connection to MongoDB:", error.message);
// });

// LEARN: General schema definition.
// let personSchema = new Schema({name: String});

// LEARN: Using below personSchema is enables schemaless saving(i.e., strict: false) to db => https://stackoverflow.com/a/12389168
let personSchema = new Schema({gadgetlist: [{type: Schema.Types.ObjectId, ref: GADGET_COLLECTION_NAME}]}, {strict: false})
// ? Using above type of ref tells moongoose to treat, gadgets field as join from `GADGET_COLLECTION_NAME` collection.
const personModel = model(
	PERSON_COLLECTION_NAME, //LEARN: Model name(if third param is omiited, mongoose will pluralize `modelName` to get a `collectionName`.)
	personSchema,
	PERSON_COLLECTION_NAME //LEARN: Collection name(optional param but IMPORTANT) ensures that mongodb doesn't alter our name to pluras or sht thigs on itself.
)

let gadgetSchema = new Schema({deviceName: String}, {strict: false})
// ? Using above type of ref tells moongoose to treat, gadgets field as join from 'gadgetcollection' collection.
const gadgetModel = model(
	GADGET_COLLECTION_NAME,
	gadgetSchema,
	GADGET_COLLECTION_NAME //Using third parameter ensures that mongoose will only use this name as collection name, and won't pluralize it. Yikes!
)

// module.exports = {
// 	connection,
// 	personModel,
// 	gadgetModel,
// 	GADGET_COLLECTION_NAME,
// 	PERSON_COLLECTION_NAME,
// 	log,
// }


// setTimeout(() => {
// 	connection.close()
// }, 2000)

require('hot-module-replacement')({
	// options are optional
	ignore: /node_modules/, // regexp to decide if module should be ignored; also can be a function accepting string and returning true/false
})

//? Importing the module is must to apply hot odule replacement to it.
let code = require('./code.js') 

//? Loading module on file changes...
// When file code.js is changed it'll run that code.
if (module.hot) {
	module.hot.accept('./code.js', () => {
		console.log('callback executed..')
		// if foo.js or any files that foo.js depend on are modified this callback is invoked
		let code = require('./code.js') // by this time module cache entry for 'foo' already cleaned and module reloaded, requiring again is the easiest way of geting reference to new module. We need to assign it to local foo variable to make our local code in this file aware of it.
		code(personModel)
	})
}
