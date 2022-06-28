const {Schema, model} = require('mongoose')

const PERSON_COLLECTION = 'persons' //* You should use pluras names, otherwise mongodb will itself change the name to plurals.
const GADGET_COLLECTION = 'gadgets' //* You should use pluras names, otherwise mongodb will itself change the name to plurals.

// LEARN: General schema definition.
// let personSchema = new Schema({name: String});

// LEARN: Using below personSchema is enables schemaless saving(i.e., strict: false) to db => https://stackoverflow.com/a/12389168
let personSchema = new Schema(
	{gadgetlist: [{type: Schema.Types.ObjectId, ref: GADGET_COLLECTION}]},
	{strict: false}
)
// ? Using above type of ref tells moongoose to treat, gadgets field as join from `GADGET_COLLECTION_NAME` collection.
const personModel = model(
	PERSON_COLLECTION, //LEARN: Model name(if third param is omiited, mongoose will pluralize `modelName` to get a `collectionName`.)
	personSchema,
	PERSON_COLLECTION //LEARN: Collection name(optional param but IMPORTANT) ensures that mongodb doesn't alter our name to pluras or sht thigs on itself.
)

let gadgetSchema = new Schema({deviceName: String}, {strict: false})
// ? Using above type of ref tells moongoose to treat, gadgets field as join from 'gadgetcollection' collection.
const gadgetModel = model(
	GADGET_COLLECTION,
	gadgetSchema,
	GADGET_COLLECTION //Using third parameter ensures that mongoose will only use this name as collection name, and won't pluralize it. Yikes!
)

module.exports = {
	personModel,
	gadgetModel,
	PERSON_COLLECTION,
	GADGET_COLLECTION,
}
