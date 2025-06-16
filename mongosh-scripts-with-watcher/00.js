
db = db.getSiblingDB('testdb1');
print('🚀Database name:', db); // mydb

print(db.getUsers()); // get user objects
// Output: { users: [], ok: 1 }

db.createCollection('planes');
db.createCollection('cars');
db.createCollection('postman');

print(db.getCollectionNames());
// Output: [ 'postman', 'cars', 'planes' ]

db.postman.drop();

print(db.getCollectionNames());
// Output: [ 'cars', 'planes' ]


print('\n🚀Using map fuction:');
print([1, 2, 3].map(k => k + 1)); // works like a charm


myObjectId = ObjectId("507c7f79bcf86cd7994f6c0e");
print(typeof myObjectId == 'object'); // true
print(myObjectId.toString() === '507c7f79bcf86cd7994f6c0e'); // true
print(typeof myObjectId.toString() === 'string'); // true
