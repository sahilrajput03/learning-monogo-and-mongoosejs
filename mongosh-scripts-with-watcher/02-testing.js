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

print('\n🚀Print each document in datingLikes collection:');
db.datingLikes.find().forEach(printjson);

let filters = [1, 2, 3].map(item => ({ from: item, to: 9 }));

let datingLikesCursor = db.datingLikes.find({
	$or: filters
});
print('\n🚀Printing found matches:');
datingLikesCursor.forEach(printjson);
