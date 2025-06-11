// @ts-nocheck
// LEARN: Javascript instructions are different from cli instructions.
// Refer docs page to know the Javacript Equivalents of cli instructions: https://www.mongodb.com/docs/v5.0/tutorial/write-scripts-for-the-mongo-shell/

db = db.getSiblingDB('mydb');
print('🚀Database name?', db); // mydb
// print(db.getUsers); // get user objects

db.posts.drop();

print('\n🚀Inserting one document in posts collection:');
// * Below throws - DeprecationWarning: Collection.insert() is deprecated. Use insertOne, insertMany, or bulkWrite.
// Learn: print() methods prints the info from the operation ~Sahil
print(
    db.posts.insert({
        title: 'Post One',
        body: 'Body of post one',
        category: 'News',
        likes: 4,
        tags: ['news', 'events'],
        user: {
            name: 'John Doe',
            status: 'author',
        },
        data: Date(),
    })
);

let myCursor = db.posts.find();
print('\n🚀Printing each document in posts collection:');
myCursor.forEach(printjson); // Works like a charm. Src: https://www.mongodb.com/docs/manual/reference/method/db.collection.find/


db.createCollection('postman');

print('\n🚀Inserting one document in postman collection:');
print(
    db.posts.insert({
        postmanName: 'Postman1',
        postmanBody: 'PostmanBody1',
    })
);


print('\n🚀Using map fuction:');
print([1, 2, 3].map(k => k + 1)); // works like a charm


print('\n🚀Print all collection names in "mydb" database:');
print(db.getCollectionNames()); // [ 'persons', 'posts' ]
