// @ts-nocheck
// LEARN: Javascript instructions are different from cli instructions.
// Refer docs page to know the Javacript Equivalents of cli instructions: https://www.mongodb.com/docs/v5.0/tutorial/write-scripts-for-the-mongo-shell/

// * We use `inser` to insert a doc in this script.

db = db.getSiblingDB('testdb2');

db.posts.drop();

print('\n🚀Inserting one document in posts collection:');
// * Below throws - DeprecationWarning: Collection.insert() is deprecated. Use insertOne, insertMany, or bulkWrite.
// Learn: print() methods prints the info from the operation ~Sahil
// Learn: If we use insert() below we get - DeprecationWarning: Collection.insert() is deprecated. Use insertOne, insertMany, or bulkWrite.
print(
    db.posts.insertOne({
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


print('\n🚀Print each document in posts collection (one liner):');
db.posts.find().forEach(printjson);

print('\n🚀Print each document in posts collection:');
let postsCursor = db.posts.find();
postsCursor.forEach(printjson); // Works like a charm. Src: https://www.mongodb.com/docs/manual/reference/method/db.collection.find/
