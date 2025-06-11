// @ts-nocheck
db = db.getSiblingDB('mydb');
db.datingLikes.drop();

//  Create index coz we're filtering on basis of these two fields while querying
db.persons.createIndexes([{ from: 1 }, { to: 1 }]);

// Insert large amount of likes documents
db.datingLikes.insertMany(Array(10 * 100 * 1000).fill(0).map(u => ({ from: ObjectId(), to: ObjectId() })));
// Insert 5 more likes documents
db.datingLikes.insertMany([6, 7, 8, 9, 10].map(id => ({ from: id, to: ObjectId() })));

let currentUserId = 100;
let usersIds = [1, 2, 3, 4, 5]; // list of users (userIds) who liked `currentUser`

// Insert 5 likes (users liked the current user)
db.datingLikes.insertMany(usersIds.map(id => ({ from: id, to: currentUserId, isMonsterLike: false })));

// Insert likes made by current user (to = 3,4,5 only)
db.datingLikes.insertMany([3, 4, 5, 6, 7, 8, 9, 10].map(id => ({ from: currentUserId, to: id, isMonsterLike: true })));