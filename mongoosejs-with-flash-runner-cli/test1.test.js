const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.test' }); // Alway remember to use separate .env.test file for environment.

// Learn Jest and Expect Google Doc - https://docs.google.com/document/d/1PU8G6tpEYLJxXMgHoK5c37UFMbSXtENzpyIOohVsD_I/edit?tab=t.0
// 	Expect Docs: https://jestjs.io/docs/expect
const { expect } = require('expect');

const { connectPromise, DB_NAME } = require('./initMongodb.js');
const {
	PersonModel,
	gadgetModel,
	personsCollectionName,
	CarModel,
} = require('./models');

// @ts-ignore
const { connectToDb, closeDb, beforeAll, test } = global;

// Learn: Open db connection
connectToDb(async () => {
	await connectPromise;
});

// Close db connection in non-watch mode.
closeDb(async () => {
	// Runs .close() on all connections (mongoose docs)
	await mongoose.disconnect();
});

beforeAll(async () => {
	console.log('🎉beforeAll::Dropping the database', DB_NAME);
	const db = mongoose.connection;
	// const collectionNamesArray = await (await mongoose.connection.db.listCollections().toArray()).map(col => col.name);
	await db.dropDatabase(); // This drops the currently connected database intelligently i.e., we don't need give the name of the db as it delete the same db to which we are connected to.

	// Learn: We need to sync when we drop the database (above line)
	//          otherwise we do not get unique email error on test -
	//          "unique email test for car saving"
	// Learn: Are indexes updated automatically? tldr: YES (source - https://chatgpt.com/c/684abfd3-945c-8007-bb9a-3226f9922e7d)
	try {
		await CarModel.syncIndexes();
		console.log('🎉Indexes synced for CarModel');
	} catch (err) {
		console.error('❌Error syncing indexes for CarModel:', err);
	}
});

const sleep = async (timeMs = 1_000) => await new Promise((res) => setTimeout(res, timeMs));

const _bruno = {
	name: 'Bruno Mars',
	phoneNumber: 123456789,
	address: 'Some address here',
};

const _pikachu = {
	name: 'Pikachu',
	phoneNumber: 987654321,
	address: 'New York City',
};
// Learn: You may never use console.log but simply use debugger to debug values like doc below by placing breakpoint in the functin end brace.
test('save bruno', async () => {
	let person = new PersonModel(_bruno); // LEARN: Placing this in beforeAll or top scope causes issues.
	expect(person instanceof mongoose.Document).toBeTruthy();

	expect(person).toMatchObject(_bruno);
	expect(person).toHaveProperty('_id');
	expect(person._id instanceof mongoose.Types.ObjectId).toBeTruthy();
	await person.save();
});

test('save pikachu', async () => {
	let pikachu = new PersonModel(_pikachu);
	let doc = await pikachu.save();
	expect(doc).toMatchObject(_pikachu);
});

test('find', async () => {
	let personDocs = await PersonModel.find(); // This may find multiple docuemnts

	// ✅`Mongoose document instance` (not a plain JavaScript object)
	expect(personDocs[0] instanceof mongoose.Document).toBeTruthy();

	const persons = personDocs.map((doc) => doc.toObject());
	expect(persons[0]).toMatchObject(_bruno);
	expect(persons[1]).toMatchObject(_pikachu);
});

test('find with lean ❤️', async () => {
	// Learn: lean() method above tells mongoose to call .toObject()
	// 			method internally for this query.
	let persons = await PersonModel.find().lean();

	// ✅ We get a list of plain JavaScript objects instead of
	// 		`Mongoose document instance`
	expect(persons[0] instanceof mongoose.Document).toBeFalsy();
	expect(persons[0]).toMatchObject(_bruno);
	expect(persons[1]).toMatchObject(_pikachu);
});

test('findOne', async () => {
	const documentFilter = { name: 'Bruno Mars' };
	let person = await PersonModel.findOne(documentFilter); // This would only return first matching document only.
	expect(person).toMatchObject(_bruno); // works in v6

	// Learn: For v5 above test expectation throws error so one needs to call .toObject() method to get real js object like we do below:
	// person = person.toObject() //? LEARN: Without .toObject we can't access the properties at all. Src: https://stackoverflow.com/a/32634029/10012446
	// expect(person).toMatchObject(_bruno)
});

test('findById', async () => {
	let person = await PersonModel.findOne({ name: 'Bruno Mars' });
	expect(() => {
		expect(doc).toMatchObject(_bruno);
	}).toThrow();

	let _id = person._id;
	let doc = await PersonModel.findById(_id);
	expect(doc.toObject()).toMatchObject(_bruno);
});

test('findByIdAndRemove', async () => {
	let person = await PersonModel.findOne({ name: 'Bruno Mars' });
	let _id = person._id;
	let personDeletedDoc = await PersonModel.findByIdAndRemove(_id);
	expect(personDeletedDoc._id.toString()).toBe(_id.toString());

	let doc = await PersonModel.findOne({ name: 'Bruno Mars' });
	expect(doc).toBeNull();
});

test('findOneAndUpdate 🎯', async () => {
	const db = mongoose.connection;
	const collectioName = 'kids';
	let status = await db.dropCollection(collectioName); // LEARN: This will throw error if the colleciton is already not there!
	// console.log("✅ Drop kids collection:", status);

	let kidSchema = new mongoose.Schema({
		name: String,
		age: Number,
		height: Number,
		weight: Number,
	});

	// Note: We need `mongoose.models[collectioName] ||` in below line else we get error - "OverwriteModelError: Cannot overwrite `cartoons` model once compiled.  at Mongoose.model"
	// const KidModel = mongoose.models[collectioName] || mongoose.model(collectioName, kidSchema); // Way 1 ✅ [Works Tested but I fail to update schema in watch mode that's why prefering below 2nd way.]
	if (mongoose.models[collectioName]) { delete mongoose.models[collectioName]; } // Way 2 ✅ [Works Tested]

	const KidModel = mongoose.model(collectioName, kidSchema);

	const kid = { name: 'Brian', age: 10, weight: null };
	await KidModel.create(kid);

	const filter = kid;
	const update = { name: 'Bruno', height: 200 };
	const kidUpdated = await KidModel.findOneAndUpdate(filter, update, { upsert: true, new: true }).lean();
	const expected = { ...kid, ...update }; // ✅ ❤️

	expect(kidUpdated).toEqual({
		_id: expect.any(mongoose.Types.ObjectId),
		__v: 0,
		...expected,
	});
});

test('deleteOne', async () => {
	let person = await PersonModel.findOne({ name: 'Pikachu' });
	let _id = person._id;

	let doc = await PersonModel.deleteOne({ _id });
});

test('insertMany', async () => {
	let arr = require('./data');
	let docs = await PersonModel.insertMany(arr); // Docs (insertMany): https://mongoosejs.com/docs/api.html#model_Model.insertMany

	docs = docs.map((doc) => doc.toObject());

	docs.forEach((doc, idx) => {
		expect(doc).toMatchObject(arr[idx]);
	});
});

test('deleteMany', async () => {
	let doc = await PersonModel.deleteMany({});
	let numberOfInsertedDoc = require('./data').length;

	expect(doc.deletedCount).toBe(numberOfInsertedDoc); // For v6
	// expect(doc.ok).toBe(1) // For v5
});

test('pagination', async () => {
	const page = 3; // Values: 1, 2, 3, ...
	const limit = 2;
	const skip = (page - 1) * limit;
	const doc = await PersonModel
		.find({})
		.sort({ name: 'asc' })
		.limit(limit)
		.skip(skip); // PAGINATION ROCKS WITH MONGOOSE, SRC: HTTPS://STACKOVERFLOW.COM/A/61354694/10012446
});

test('populate', async () => {
	let iphoneDoc = new gadgetModel({
		deviceName: 'Parineeti',
		deviceId: 101,
	});
	let nokiaDoc = new gadgetModel({
		deviceName: 'Alia Bhatt',
		deviceId: 102,
	});

	await iphoneDoc.save();
	await nokiaDoc.save();

	// We create `_id` manually to be able to avoid confusion later on;
	// 		src: https://stackoverflow.com/a/17899751/10012446
	let _id = new mongoose.Types.ObjectId();

	let personDoc = new PersonModel({
		_id,
		name: 'Bruno Mars',
		phoneNumber: 123456789,
		address: 'Some address here',
		gadgetList: [iphoneDoc._id],
		favouriteGadget: iphoneDoc._id,
	});

	await personDoc.save();

	// Way 1 - Inserting a ObjectId to array i.e., `gadgetList` property.
	// Pushing item to array using $push method
	// let doc = await personModel.findByIdAndUpdate(_id, {
	// 	$push: {
	// 		gadgetList: [nokiaDoc._id],
	// 	},
	// })

	// Way 2 - FSO - Inserting a ObjectId to array i.e., `gadgetList` property.
	// LEARN: Both `ARRAY.concat` and `spread operator` works well
	personDoc.gadgetList = personDoc.gadgetList.concat(nokiaDoc._id);
	// personDoc.gadgetList = [...personDoc.gadgetList, nokiaDoc._id]
	await personDoc.save({ debug: true }); // this doesn't work ~Sahil

	let gadgetList = [iphoneDoc._id, nokiaDoc._id];

	const includesAllIds = gadgetList.every((gadgetId) =>
		personDoc.gadgetList.includes(gadgetId)
	);

	// First Assertion
	if (!includesAllIds) {
		throw new Error('gadget 1 or 2 or both are not there..!');
	}
	/*
	# Get a populated person
	let docPopulated = await personModel.findById(_id).populate('gadgetList

	# Get a populated person (populate after save, src: populate afer save: https://stackoverflow.com/a/50334013/10012446)
	await personDoc.populate('gadgetList').execPopulate() // works in v5 but doesn't work in v6 as execPopulate is discarded for documents in v6.
	# Docs: execPopulate: https://mongoosejs.com/docs/migrating_to_6.html#removed-execpopulate
	# Mongoose: Migrating from v5 to v6: https://mongoosejs.com/docs/migrating_to_6.html#removed-execpopulate
	*/

	await personDoc.populate('gadgetList'); // will populate the array
	await personDoc.populate('favouriteGadget'); // will populate favourite item
	// log('personDoc?', personDoc)

	// GADGETLIST
	const deviceNames = [iphoneDoc.deviceName, nokiaDoc.deviceName];
	const includesAllNames = deviceNames.every((deviceName) =>
		Boolean(personDoc.gadgetList.find((p) => p.deviceName === deviceName))
	);

	// Second Assertion
	if (!includesAllNames) {
		throw new Error('Does not include any or all of the devices!');
	}

	// FAVOURITE GADGET
	expect(personDoc.favouriteGadget.toObject()).toMatchObject(
		iphoneDoc.toObject()
	);
});

test('update never delete older data', async () => {
	let _id = new mongoose.Types.ObjectId();

	let _manchanda = {
		_id,
		name: 'Bruno Mars',
		phoneNumber: 123456789,
		address: 'Some address here',
	};
	let person = new PersonModel(_manchanda);
	person = await person.save();

	expect(person).toMatchObject(_manchanda);

	// Learn: We are updating nothing, this is safe i.e., not data will be overwritten.
	let newProperties = {}; // LEARN: In mongodb, updation of document happens like: newDocument = {...updateDocument ,...oldDocuemnt} , that means older proeperties will persist even if you omit in `updatedObject` while updating a document. Yikes!!

	person = await PersonModel
		.findByIdAndUpdate(_id, newProperties)
		.populate('gadgetList')
		.lean();
	// LEARN: lean() method above tells mongoose to call .toObject() method internally for this query. So, we don't need as:
	// xxx ^--> let updatePerson = person.toObject()

	delete _manchanda.gadgetList; // this was necessary to pass next test!
	expect(person).toMatchObject(_manchanda);
});

test('dropCollection', async () => {
	const db = mongoose.connection;
	let status = await db.dropCollection(personsCollectionName); // LEARN: This will throw error if the colleciton is already not there!
	expect(status).toBe(true);
});

test('custom validator function with custom message', async () => {
	// Valid `carName` is `audi` or `bmw`.
	let car1Doc = new CarModel({
		carName: 'audi',
	});
	await car1Doc.save();

	// Trying to get validation error message (custom validator defined in `carSchema` in models file).
	const expectErrName = 'ValidatorError';
	const expectedErrMessg = ' is not ❌ allowed. Only audi and bmw cars are allowed. ✅';
	let error;
	let car2Doc;
	try {
		car2Doc = new CarModel({
			carName: 'random-audi',
		});
		await car2Doc.save();
	} catch (e) {
		error = e;
	}
	expect(error.errors.carName instanceof Error).toBe(true);
	expect(error.errors.carName.name).toBe(expectErrName);
	expect(error.errors.carName.message).toBe(car2Doc.carName + expectedErrMessg);
	expect(error.errors.carName.reason).toBe('carName is not valid ⭕️');
});

test('Saving array of objects (for demo to eric)', async () => {
	let g1 = new CarModel({
		carName: 'audi',
		deviceId: 501,
		report: [{ _id: new mongoose.Types.ObjectId(), reason: 'Inappropriate User' }],
		email: 'sahil@rajput.com'
	});
	await g1.save();

	// Add more to `report` field
	g1.report = g1.report.concat({ _id: new mongoose.Types.ObjectId(), reason: 'Seemed Scammer' });
	await g1.save();
});

test('unique email test for car saving', async () => {
	const email = 'mohit@rajput.com';
	let car1Doc = new CarModel({
		carName: 'audi',
		email,
	});
	await car1Doc.save();

	let error;
	try {
		// Trying to save new car with an existing email id, should throw unique error:
		let car2Doc = new CarModel({
			carName: 'bmw',
			email,
		});
		await car2Doc.save();
	} catch (e) {
		error = e;
		console.log('Successfully got error ✅');
	}
	let expectedErrorName = 'MongoServerError';
	let expectedErrorMessageSlug = 'E11000 duplicate key error collection:';
	expect(error.name).toBe(expectedErrorName);
	expect(error.message).toContain(expectedErrorMessageSlug);
});

test('projection', async () => {
	// Projection operator - It helps by fixing the overfetching
	// 		issue. We can use projection with mongoose using select as
	// 		shown below:
	// Learn: Using the select method we can limit the fields
	//      fetched from the db directly, i.e., we can make use of
	//      projection operator to fetch only the desired data only,
	//      and we can verify the execution query form mongoose as
	//      debug mode is on thereby it shows query as:
	//      ```persons.find({}, { projection: { name: 1 } })```
	const bruno = new PersonModel(_bruno); // LEARN: Placing this in beforeAll or top scope causes issues.
	await bruno.save();

	// Without projection
	const personDocs = await PersonModel.find({}).lean();
	personDocs.forEach(doc => {
		expect(Object.keys(doc)).toEqual(['_id', 'gadgetList', 'name', 'phoneNumber', 'address', '__v']);
	});

	// With projection usign .select() in mongoose
	// 		Docs - https://mongoosejs.com/docs/api.html#query_Query-select
	const personDocsWithProjection = await PersonModel.find({}).lean().select('name');
	personDocsWithProjection.forEach(doc => {
		expect(Object.keys(doc)).toEqual(['_id', 'name']);
	});
});
