const { Schema, model } = require('mongoose');

//* You should use pluras names, otherwise mongodb will itself change the name to plurals.
const personsCollectionName = 'persons';
const gadgetsCollectionName = 'gadgets';
const carsCollectionName = 'cars';

let personSchema = new Schema(
	{
		gadgetList: [{ type: Schema.Types.ObjectId, ref: gadgetsCollectionName }],
		favouriteGadget: { type: Schema.Types.ObjectId, ref: gadgetsCollectionName },
	},
	// Learn: `strict: false` means any property can be saved
	// 		irrespective of the schema definition. (https://stackoverflow.com/a/12389168)
	{ strict: false }
);

// Using above type of ref tells moongoose to treat, gadgets field as
// 		join from `GADGET_COLLECTION_NAME` collection.
const PersonModel = model(
	personsCollectionName, //LEARN: Model name(if third param is omiited, mongoose will pluralize `modelName` to get a `collectionName`.)
	personSchema,
	personsCollectionName //LEARN: Collection name(optional param but IMPORTANT) ensures that mongodb doesn't alter our name to pluras or sht thigs on itself.
);

let gadgetSchema = new Schema({ deviceName: String }, { strict: false });
// ? Using above type of ref tells moongoose to treat, gadgets field as join from 'gadgetcollection' collection.
const gadgetModel = model(
	gadgetsCollectionName,
	gadgetSchema,
	gadgetsCollectionName //Using third parameter ensures that mongoose will only use this name as collection name, and won't pluralize it. Yikes!
);

const carSchema = new Schema({
	carName: {
		type: String,
		validate: {
			// Custom validator src: https://mongoosejs.com/docs/validation.html#custom-validators
			validator: (value) => {
				const isValid = value === 'audi' || value === 'bmw';
				if (typeof isValid === 'undefined')
					throw 'isValid got undefined value in carName validator function.';

				return isValid;
			},
			message: (props) =>
				`${props.value} is not allowed. Only audi and bmw cars are allowed.`,
		},
	},
	// Email id to be unique (validates on saving any doc).
	email: {
		type: String,
		unique: true, // `email` must be unique
	},
	report: [{
		_id: Schema.Types.ObjectId,
		reason: String
	}]
});
// carSchema.index(
// 	{ email: 1 }
// );

const CarModel = model(
	carsCollectionName,
	carSchema,
	carsCollectionName //Using third parameter ensures that mongoose will only use this name as collection name, and won't pluralize it. Yikes!
);

module.exports = {
	PersonModel,
	gadgetModel,
	personsCollectionName,
	gadgetsCollectionName,
	CarModel,
};
