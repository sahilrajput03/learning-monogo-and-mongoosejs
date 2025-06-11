// @ts-nocheck
// OBSOLETE OBSOLETE FILE
// OBSOLETE OBSOLETE FILE
// OBSOLETE OBSOLETE FILE
// OBSOLETE OBSOLETE FILE
db = db.getSiblingDB('mydb')
db.datingLikes.drop()
// db.createCollection('datingLikes') // Learn ~Sahil: With .js file creating new collection is not necessary
db.datingLikes.insertMany([
	{ from: 1, to: 9 },
	{ from: 2, to: 9 },
	{ from: 3, to: 9 },
	// others
	{ from: 4, to: 5 },{ from: 5, to: 4 },
])

// let myCursor = db.datingLikes.find();
// myCursor.forEach(printjson);

// one-liner
// db.datingLikes.find().forEach(printjson)

let filters = [1,2,3].map(v => ({from: v, to: 9}))

let matches = db.datingLikes.find({
   $or: filters
})
matches.forEach(printjson);

// Othe exps:
// list1.forEach((a) => printjson(a._id));
// print('users who likes currentUser:')
// list1.forEach(printjson);
// list1.forEach(a => print(a));
// 
// print('loloo')
// myObjectId = ObjectId("507c7f79bcf86cd7994f6c0e")
// print(typeof myObjectId)
// myObjectIdString = myObjectId.toString()
// print(myObjectIdString)
// print(typeof myObjectIdString)

// Execution time?
// Docs: https://www.mongodb.com/docs/manual/reference/explain-results/
// https://www.youtube.com/watch?v=0WkJKa_Nv_o
// https://www.youtube.com/watch?v=IZ1k1BB_BWo
// TODO: Official talk on .explain by mongodb itself: https://www.youtube.com/watch?v=UMzt4PbHtm8
// .explain() // gives us queryPlanner
// .explain("executionStats") // gives us queryPlanner as well as executionStats