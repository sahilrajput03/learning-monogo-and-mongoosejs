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

// & Learn: You may never use console.log but simply use debugger to debug values like doc below by placing breakpoint in the functin end brace.

test('create', async () => {
	// Bruno
	const doc = await PersonModel.create(_bruno);
	expect(doc instanceof mongoose.Document).toBeTruthy();

	expect(doc).toMatchObject(_bruno);

	expect(doc.toObject()).toEqual({
		..._bruno,
		_id: expect.any(mongoose.Types.ObjectId),
		__v: 0,
		gadgetList: [],
	});
});

test('save', async () => {
	// Pikachu 
	let person = new PersonModel(_pikachu); // LEARN: Placing this in beforeAll or top scope causes issues.
	expect(person instanceof mongoose.Document).toBeTruthy();

	expect(person).toMatchObject(_pikachu);
	expect(person).toHaveProperty('_id');
	expect(person._id instanceof mongoose.Types.ObjectId).toBeTruthy();
	await person.save();
});

test('find (without lean)', async () => {
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
	let person = await PersonModel.findOne(documentFilter).lean(); // This would only return first matching document only.

	expect(person).toMatchObject(_bruno); // works in v6
});

test('findById', async () => {
	let person = await PersonModel.findOne({ name: 'Bruno Mars' }).lean();
	let _id = person._id;
	let doc = await PersonModel.findById(_id).lean();
	expect(doc).toMatchObject(_bruno);
});

test('findByIdAndRemove', async () => {
	let person = await PersonModel.findOne({ name: 'Bruno Mars' }).lean();
	let _id = person._id;
	let personDeletedDoc = await PersonModel.findByIdAndRemove(_id);
	expect(personDeletedDoc._id.toString()).toBe(_id.toString());

	let doc = await PersonModel.findOne({ name: 'Bruno Mars' }).lean();
	expect(doc).toBeNull();
});

test('findOneAndUpdate 🎯', async () => {
	// ✅ Works exactly same in mongoose v8 as well. [✅Tested in qr soluion project]
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

	// ✅ Two ways to fix for `OverwriteModelError` which happens for line - `const KidModel = mongoose.model(collectioName, kidSchema);`.
	// const KidModel = mongoose.models[collectioName] || mongoose.model(collectioName, kidSchema); // Way 1 ✅ [Works Tested but I fail to update schema in watch mode that's why prefering below 2nd way.]
	if (mongoose.models[collectioName]) { delete mongoose.models[collectioName]; } // Way 2 ✅ [Works Tested]

	// For below line in watch mode we get error - "OverwriteModelError: Cannot overwrite `cartoons` model once compiled.  at Mongoose.model" that's why we need one of above two ways to fix this issue:
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
	let person = await PersonModel.findOne({ name: 'Pikachu' }).lean();
	let _id = person._id;

	let doc = await PersonModel.deleteOne({ _id });
});

test('insertMany', async () => {
	let arr = require('./data');
	let personDocs = await PersonModel.insertMany(arr); // Docs (insertMany): https://mongoosejs.com/docs/api.html#model_Model.insertMany

	const persons = personDocs.map((doc) => doc.toObject());

	persons.forEach((person, idx) => {
		expect(person).toMatchObject(arr[idx]);
	});
});

test('deleteMany', async () => {
	let doc = await PersonModel.deleteMany({});
	let numberOfInsertedDoc = require('./data').length;

	expect(doc.deletedCount).toBe(numberOfInsertedDoc); // For v6
	// expect(doc.ok).toBe(1) // For v5
});

// TODO: Check if lean() function works with this as well? (already applied lean() to other tests)
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
	const iphoneDoc = await gadgetModel.create({
		deviceName: 'Parineeti',
		deviceId: 101,
	});
	const nokiaDoc = await gadgetModel.create({
		deviceName: 'Alia Bhatt',
		deviceId: 102,
	});

	// We create `_id` manually to be able to avoid confusion later on;
	// 		src: https://stackoverflow.com/a/17899751/10012446
	let _id = new mongoose.Types.ObjectId();

	await PersonModel.create({
		_id,
		name: 'Bruno Mars',
		phoneNumber: 123456789,
		address: 'Some address here',
		gadgetList: [iphoneDoc._id],
		favouriteGadget: iphoneDoc._id,
	});

	// Way 1 - Inserting a ObjectId to array i.e., `gadgetList` property.
	// Pushing item to array using $push method
	// let doc = await personModel.findByIdAndUpdate(_id, {
	// 	$push: {
	// 		gadgetList: [nokiaDoc._id],
	// 	},
	// })

	// Way 2 - FSO - Inserting a ObjectId to array i.e., `gadgetList` property.
	// LEARN: Both `ARRAY.concat` and `spread operator` works well
	const p = await PersonModel.findById(_id);
	p.gadgetList = p.gadgetList.concat([nokiaDoc._id]);
	// personDoc.gadgetList = [...personDoc.gadgetList, nokiaDoc._id, ] // Works too ✅
	await p.save();

	/*
	# Get a populated person
	let docPopulated = await personModel.findById(_id).populate('gadgetList favouriteGadget')

	# Get a populated person (populate after save, src: populate afer save: https://stackoverflow.com/a/50334013/10012446)
	await personDoc.populate('gadgetList').execPopulate() // works in v5 but doesn't work in v6 as execPopulate is discarded for documents in v6.
	# Docs: execPopulate: https://mongoosejs.com/docs/migrating_to_6.html#removed-execpopulate
	# Mongoose: Migrating from v5 to v6: https://mongoosejs.com/docs/migrating_to_6.html#removed-execpopulate
	*/

	let person = await PersonModel.findById(_id).populate('gadgetList favouriteGadget');

	// GADGETLIST
	const deviceNames = [iphoneDoc.deviceName, nokiaDoc.deviceName];
	const includesAllNames = deviceNames.every((deviceName) =>
		Boolean(person.gadgetList.find((p) => p.deviceName === deviceName))
	);

	if (!includesAllNames) {
		throw new Error('Does not include any or all of the devices!');
	}

	// FAVOURITE GADGET
	expect(person.favouriteGadget).toMatchObject(
		iphoneDoc.toObject()
	);
});

test('findByIdAndUpdate with update={} should show no sideeffect', async () => {
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
	let update = {}; // LEARN: In mongodb, updation of document happens like: newDocument = {...updateDocument ,...oldDocuemnt} , that means older proeperties will persist even if you omit in `updatedObject` while updating a document. Yikes!!

	person = await PersonModel
		.findByIdAndUpdate(_id, update)
		.populate('gadgetList')
		.lean();

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

test('Add to items to an array field using .concat() js method', async () => {
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
	await CarModel.create({ carName: 'audi', email });


	// Trying to save new car with an existing email id, should throw unique error:
	let car2Doc = new CarModel({ carName: 'bmw', email });

	let expectedErrorName = 'MongoServerError';
	let expectedErrorMessageSlug = 'E11000 duplicate key error collection:';

	let error;
	try {
		await car2Doc.save();
	} catch (e) {
		error = e;
		// console.log('Successfully got error ✅');
	}
	expect(error.name).toBe(expectedErrorName);
	expect(error.message).toContain(expectedErrorMessageSlug);

	let error2;
	try {
		await CarModel.create({ carName: 'bmw', email });
	} catch (e) {
		error2 = e;
		// console.log('Successfully got error ✅');
	}
	expect(error2.name).toBe(expectedErrorName);
	expect(error2.message).toContain(expectedErrorMessageSlug);
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
