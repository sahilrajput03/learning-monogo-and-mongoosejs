// @ts-nocheck
db = db.getSiblingDB('mydb');
db.datingLikes.drop();
// db.createCollection('datingLikes') // Learn ~Sahil: With .js file creating new collection is not necessary
db.datingLikes.insertMany([
	{ from: 1, to: 9 },
	{ from: 2, to: 9 },
	{ from: 3, to: 9 },
	// others
	{ from: 4, to: 5 },
	{ from: 5, to: 4 },
]);

// print('\n🚀Printing each document of datingLikes collection:');
// let myCursor = db.datingLikes.find();
// myCursor.forEach(printjson);

print('\n🚀Printing each document of datingLikes collection (oneliner):');
db.datingLikes.find().forEach(printjson);

let filters = [1, 2, 3].map(item => ({ from: item, to: 9 }));

let matches = db.datingLikes.find({
	$or: filters
});
print('\n🚀Printing found matches:');
matches.forEach(printjson);

myObjectId = ObjectId("507c7f79bcf86cd7994f6c0e");
print(typeof myObjectId == 'object'); // true
print(myObjectId.toString() === '507c7f79bcf86cd7994f6c0e'); // true
print(typeof myObjectId.toString() === 'string'); // true
