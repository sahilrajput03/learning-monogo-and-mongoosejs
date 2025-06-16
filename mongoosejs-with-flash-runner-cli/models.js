const mongoose = require('mongoose');
const { Schema, model } = require('mongoose');


// Note: We use pluras names, otherwise mongodb will itself change the
// 		name to plurals and we might know only when changes are saved to
// 		db.
// @ts-ignore
const personsCollectionName = mongoose.pluralize()('persons');
// @ts-ignore
const gadgetsCollectionName = mongoose.pluralize()('gadgets');
// @ts-ignore
const carsCollectionName = mongoose.pluralize()('cars');

let personSchema = new Schema(
	{
		// Using "ref" tells moongoose to join gadget docs from 'gadgetsCollectionName' collection.
		gadgetList: [{ type: Schema.Types.ObjectId, ref: gadgetsCollectionName }],
		favouriteGadget: { type: Schema.Types.ObjectId, ref: gadgetsCollectionName },
	},
	// Learn: `strict: false` means any property can be saved
	// 		irrespective of the schema definition. (https://stackoverflow.com/a/12389168)
	{ strict: false }
);
const PersonModel = model(personsCollectionName, personSchema);


let gadgetSchema = new Schema({ deviceName: String }, { strict: false });
const gadgetModel = model(gadgetsCollectionName, gadgetSchema);

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
	email: {
		type: String,
		unique: true, // `email` must be unique (validates on saving any doc)
	},
	report: [{
		_id: Schema.Types.ObjectId,
		reason: String
	}]
});
const CarModel = model(carsCollectionName, carSchema);
// carSchema.index(
// 	{ email: 1 }
// );


module.exports = {
	PersonModel,
	gadgetModel,
	personsCollectionName,
	gadgetsCollectionName,
	CarModel,
};
