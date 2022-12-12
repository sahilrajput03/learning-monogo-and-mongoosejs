// @ts-nocheck
// LEARN: Javascript instructions are different from cli instructions.
// Refer docs page to know the Javacript Equivalents of cli instructions: https://www.mongodb.com/docs/v5.0/tutorial/write-scripts-for-the-mongo-shell/

db = db.getSiblingDB('mydb')
// print(db) // mydb
// print(db.getUsers) // get user objects
// print(db.getCollectionNames()) // postman,posts

// print() methods prints the info from the operation ~Sahil
// print(
// 	db.posts.insert({
// 		title: 'Post One',
// 		body: 'Body of post one',
// 		category: 'News',
// 		likes: 4,
// 		tags: ['news', 'events'],
// 		user: {
// 			name: 'John Doe',
// 			status: 'author',
// 		},
// 		data: Date(),
// 	})
// )

let myCursor = db.posts.find();
// myCursor.forEach(printjson); // Works like a charm. Src: https://www.mongodb.com/docs/manual/reference/method/db.collection.find/


// db.createCollection('postman')

// print(
// 	db.posts.insert({
// 		postmanName: 'Postman1',
// 		postmanBody: 'PostmanBody1',
// 	})
// )

// print('hello world')
// print([1,2,3].map(k => k+1)) // works like a charm