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
	useFindAndModify: false,
	useCreateIndex: true,
})
// .then(() => {
// 	console.log("Connection successful... ☺");
// })
// .catch((error) => {
// 	console.log("error connection to MongoDB:", error.message);
// });

// LEARN: General schema definition.
// let personSchema = new Schema({name: String});

// LEARN: Using below personSchema is enables schemaless saving(i.e., strict: false) to db => https://stackoverflow.com/a/12389168
let personSchema = new Schema(
	{gadgetlist: [{type: Schema.Types.ObjectId, ref: GADGET_COLLECTION_NAME}]},
	{strict: false}
)
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

let {log} = console

module.exports = {
	connection,
	personModel,
	gadgetModel,
	GADGET_COLLECTION_NAME,
	PERSON_COLLECTION_NAME,
	log,
}

setTimeout(() => {
	connection.close()
}, 2000)
