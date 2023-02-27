# Readme

**Quicks:**
- **learn-cli-mongo:** [Github file](https://github.com/sahilrajput03/sahilrajput03/blob/master/learn-mongo-cli.md), [Web Page](https://sahilrajput03.ml/learn-mongo-cli.html).
- LinkedIn Quiz Solutions: [Click here](https://github.com/Ebazhanov/linkedin-skill-assessments-quizzes/blob/main/mongodb/mongodb-quiz.md)
- **`flash` is my own testing library, the code is @ [`flash`](https://github.com/sahilrajput03/flash).**
- From `jest` official docs for testing mongodb database (using official `mongodb` library): https://jestjs.io/docs/mongodb
- Seems like a good read on efficient mongodb queries with mongoosejs: [Click here](https://climbtheladder.com/10-mongoose-populate-best-practices/)

## Usage of `$exists`

- Source: [Mongoplayground](https://mongoplayground.net/)
- Docs: [$exists](https://www.mongodb.com/docs/manual/reference/operator/query/exists/)

Without `$exists`:

```bash
# Collection
[{"key": 1,car: 10},{"key": 2}]

# Query
car: {$ne: 20}

# Output:
[
  {"_id": ObjectId("5a934e000102030405000000"),"car": 10,"key": 1},
  {"_id": ObjectId("5a934e000102030405000001"),"key": 2}
]
```


With `$exists`:

```bash
# Collection
[{"key": 1,car: 10},{"key": 2}]

# Query
car: {$exists: true, $ne: 20}

# Output (notice that field which has no `car` key is not returned):
[
  {"_id": ObjectId("5a934e000102030405000000"),"car": 10,"key": 1},
]
```

## We can use `$count` to count documents easily in aggregate

with mongoose you can do like: `const ratingUsersCount = await this.movieUserStatusModel.count({ movieId, rating: { $exists: true, $ne: 0 } });`

Source: [Mongoplayground](https://mongoplayground.net/)

**Using `$count` in aggregate: [Docs](https://www.mongodb.com/docs/manual/reference/operator/aggregation/count/)**

Similarly:

- db.collection.count(): [Docs](https://www.mongodb.com/docs/manual/reference/method/db.collection.count/)
- db.collection.estimatedDocumentCount(): [Docs](https://www.mongodb.com/docs/manual/reference/method/db.collection.estimatedDocumentCount/)

```bash
# Documents
[
  {"_id": 400, movieId: 200},
  {"_id": 500,movieId: 200},
  {"_id": 600,movieId: 300}
]

# Query
db.collection.aggregate([
  {"$match": {movieId: 200}},
  {"$count": "totaItems"}
])

# Output
[{"totaItems": 2}]
```

## we can execute multiple queries with using `$facet`

Using `$facet`: [Click here](https://stackoverflow.com/questions/52913008/mongodb-execute-multiple-queries-in-one-round-trip)

But this is a issue that I faced myself and seems there's no such fix for this werid behaviour: [Click here](https://stackoverflow.com/questions/54128630/mongodb-aggregation-slow-count-using-facet)

## useful `updateOne` method

*Drawback:*
- We don't get created/updated document, so we need fo to make a `findOne` query explcitly
- Do not rely on returned value i.e, `value.upsertedId` as this is only preset if document is created (not returned when its updated)

```ts
// its useful as it creates the record with necessary values if it already doesn't exist
await this.movieUserStatusModel.updateOne(
  { movieId, userId },
  { $set: { rating } },
  { upsert: true },
);
```

## Amazing feature of mongoplayground

1. You can create a shareable link via that button as well:

![image](https://user-images.githubusercontent.com/31458531/220799081-b41c699e-c917-4678-83af-58d2550d7c03.png)

2. To show output for individual stages

![image](https://user-images.githubusercontent.com/31458531/220798949-de616037-afd3-47e1-868d-d15737fba531.png)

3. We can use only these methods. You can view the entire docs by clicking on the **Docs** button on the mongo playground.

![image](https://user-images.githubusercontent.com/31458531/220799555-e075c916-fce5-4de1-9d6c-8d8bc3ee5c18.png)

## Using `$avg` for calculating average in a single collection

![image](https://user-images.githubusercontent.com/31458531/220793602-580a6d41-8167-4ca4-9627-5e675b75c895.png)

Source: [Mongoplayground](https://mongoplayground.net/)

Query code:

```txt
# collection documents
[
    {"_id": 400,movieId: 200,rating: 1},
    {"_id": 500,movieId: 200,rating: 6},
    {"_id": 600,movieId: 300,rating: 5}
]

# query
db.collection.aggregate([
  // We pass movie._id explicitly for which we want to compute $avg (otherwise it would be joining/lookup/populate for all movie documents which is too costly.
  {$match: {movieId: 200}},
  {$group: {_id: "movieId",average: {$avg: "$rating"}}}
])
```

## Using `$avg` for calculating average from documents of a different collection

Source:
- [Mongoplayground](https://mongoplayground.net/) (**Template** > **Multiple Collections**)
- [$Avg](https://www.mongodb.com/docs/manual/reference/operator/aggregation/avg/)
- [$group](https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/)
- [$unwind - StackOverflow Awesome example (multiple nested array example)](https://stackoverflow.com/a/29880058/10012446)

![image](https://user-images.githubusercontent.com/31458531/220788855-ebeda8f3-11c8-4475-aca5-6c3600cd5695.png)

```bash
# Template: Multiple Collections
db={
  "movies": [
    {"_id": 100},
    {"_id": 200},
    {"_id": 300}
  ],
  "movieuserstatus": [
    {"_id": 400,movieId: 200,rating: 1},
    {"_id": 500,movieId: 200,rating: 6},
    {"_id": 600,movieId: 300,rating: 5}
  ]
}

# query
db.movies.aggregate([
  // We pass movie._id explicitly for which we want to compute $avg (otherwise it would be joining/lookup/populate for all movie documents which is too costly.
  {"$match": {_id: 200}},
  {$lookup: {from: "movieuserstatus",localField: "_id",foreignField: "movieId",as: "movieuserstatus"}},
  {"$unwind": "$movieuserstatus"},
  {$group: {_id: "$movieuserstatus.movieId",average: {$avg: "$movieuserstatus.rating"}}}
])
```

## `dbHasActiveOperations` amazing utility funciton used in previous compnay (ssshrr)

Cool!

## Run raw mongodb commands with mongoosejs

Source: [Click here](https://stackoverflow.com/a/41736477/10012446)

![image](https://user-images.githubusercontent.com/31458531/219715844-c78227d8-6e2d-4cbb-92f7-533ca0fdafbf.png)


## Deleting all `collections` or dropping `database` at once?

```js
// Drop entire database (which will drop all collections in one operation)
await connection.dropDatabase();
```

```js
// Delete all documents from the database
await Promise.all((await connection.db.collections()).map((collection) => collection.deleteMany({})));
```

## `currentOp` ?

Docs Mongodb: [Click here](https://www.mongodb.com/docs/manual/reference/method/db.currentOp/)

![image](https://user-images.githubusercontent.com/31458531/219519327-1d92727b-6f34-4723-a712-2f08d8b10a04.png)


## `$or`: collection scan vs. index scan

Source: Official Docs Mongodb: [Click here](https://www.mongodb.com/docs/manual/reference/operator/query/or/)

![image](https://user-images.githubusercontent.com/31458531/218228634-6a059107-b188-4b41-90e1-0a42ddb203e5.png)


## you can give a simple queryFiler to the populated field's data as well like that

Source: [Click here](https://stackoverflow.com/a/27075782/10012446)

![image](https://user-images.githubusercontent.com/31458531/218228459-5813c991-c638-4aba-84af-c8967c847fb3.png)


## pagination over an array field of a document

```ts
// TODO: Remove this comment: [offset=5, limit=5<numberOfItems>] i.e., {$slice: [5, 5]} will bring array i.e., [5,9]
const [feedPost] = await this.feedPostModel.find(
  { _id: new mongoose.Types.ObjectId(id) },
  { likes: { $slice: [offset ?? 0, offset + limit] } },
);
```

## Pagination on array stored in a document field

Source: [Click here](https://stackoverflow.com/a/31792645/10012446), another similar [here](https://stackoverflow.com/a/32904084/10012446).

![image](https://user-images.githubusercontent.com/31458531/218165665-1c2d2da8-2530-43ca-ac87-9b4b15b8884c.png)

![image](https://user-images.githubusercontent.com/31458531/218165780-2caf9d66-15a1-4a1c-a393-4472efe75879.png)

## TODO: URGENT: Performance Best Practices: Indexing

Recommened Read by Eric (especially @ ESR rule).

[Click here](https://www.mongodb.com/blog/post/performance-best-practices-indexing)

## `update()` is deprecates and warnings recommends to use `updateOne()` and `updateMany()` now!

Read about it here: [https://mongoosejs.com/docs/deprecations.html](https://mongoosejs.com/docs/deprecations.html)

## Only add to a field of mongodb document if doesn't exist already

Source: [Click here](https://stackoverflow.com/questions/38970835/mongodb-add-element-to-array-if-not-exists/38970956#38970956) (~ Credits: Eric)

![image](https://user-images.githubusercontent.com/31458531/216082340-0a8428b9-b559-4bc4-9eed-fb2d0e53f0b9.png)

## (*not*tested*) You can Enable indexing for fields in backend server directly as well (otherwise we simply enable in the mongodb server<in compass>)

![image](https://user-images.githubusercontent.com/31458531/215793227-45f230f6-b870-4a62-b41c-89e42f37dd32.png)


## Directly searching a document of a given _id can be done like that:

![image](https://user-images.githubusercontent.com/31458531/211829410-e66dadc1-2a1d-403f-9617-293043ce0857.png)

## Thats how we do transactions with mongoose

*Transactions are new in MongoDB 4.0 and Mongoose 5.2.0. Transactions let you execute multiple operations in isolation and potentially undo all the operations if one of them fails. This guide will get you started using transactions with Mongoose.*

**Transactions in Mongoose DOCS:** [Click here](https://mongoosejs.com/docs/transactions.html)

![image](https://user-images.githubusercontent.com/31458531/213842447-2afc8f6f-73f0-4dee-9ced-707e20b736bc.png)

## Order of array while searching matters

That means if you use wrong order then the query will not match the document:

![image](https://user-images.githubusercontent.com/31458531/211662275-dd65edd2-7ea9-4819-bb2e-b9f641655bca.png)


## You don't nee the $in operator to search inside of an array in `mongo` and `mongoose`

![image](https://user-images.githubusercontent.com/31458531/211585232-688742ab-7f58-4f06-97ed-d9ff29f8d260.png)

![image](https://user-images.githubusercontent.com/31458531/211585155-6c4a8a3c-f3e5-46c8-acb0-94a921f421ee.png)


## find duplicate items in mongodb

Docs - `$group (aggregation)` : [Click here](https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/)

![image](https://user-images.githubusercontent.com/31458531/211372185-d91fc2ec-f717-4066-abef-92192a5ccb2c.png)

**Playground Link: [mongoplayground.net](https://mongoplayground.net/)**

```bash
# Documents:
[
  { "first_name": "Sahil" },
  { "first_name": "Mohit" },
  { "first_name": "Mohit" },
  { "first_name": "Mandy" },
  { "first_name": "Mandy" },
  { "first_name": "Mandy" },
]

# Query
db.collection.aggregate([
  { "$group": { "_id": "$first_name", "duplicates": { "$sum": 1 } } },
  { "$match": { "_id": { "$ne": null }, "duplicates": { "$gt": 1 } } },
  { "$sort": { "duplicates": -1 } },
  { "$project": { "first_name": "$_id", "_id": 0, duplicates: 1 } }
])
```

![image](https://user-images.githubusercontent.com/31458531/211373136-ab404c81-77b1-4a09-a78a-f9dab7a88469.png)


## Iterate over documents individualy using stream

- Amazing - Mongodb Docs: [Click here](https://www.mongodb.com/docs/manual/tutorial/iterate-a-cursor/)
- MongooseJs: [Click here](https://mongoosejs.com/docs/api/querycursor.html)
- Stackoverflow Question: [Click here](https://stackoverflow.com/questions/56741578/mongoose-cursors-with-many-documents-and-load)

Q. Why cursor and not batches (i.e, `limit()` way)? **Ans.** Using the skip feature when iterating through results in batches can get slower over time for large data sets, when skip is given a high numeric value, so streaming with a cursor helps to get around that. ~Credits: Eric
 
![image](https://user-images.githubusercontent.com/31458531/211360156-03499979-a645-4242-9950-417bab32672d.png)


## How to use `updateMany` in mongodb/mongoosejs

![image](https://user-images.githubusercontent.com/31458531/211191847-c1859b2a-2c7a-40fd-9fbc-899ca3c15ed9.png)


## Import and export single collection in mongo using cmd ?

Solution: [Click here](https://stackoverflow.com/questions/62696963/import-and-export-single-collection-in-mongo-using-cmd)

```bash
# notifications collection
mongoexport --collection=notifications --db=slasher_test --out=notifications.json  -u=root -p=rootpassword --uri=mongodb://localhost:27017 --authenticationDatabase=admin
# users collection
mongoexport --collection=users --db=slasher_test --out=users-mocked.json  -u=root -p=rootpassword --uri=mongodb://localhost:27017 --authenticationDatabase=admin
```

## `Sort exceeded memory limit` ?

Solution of this problem: [Click here](https://www.mongodb.com/community/forums/t/sort-exceeded-memory-limit/16093)

![image](https://user-images.githubusercontent.com/31458531/210137115-8fcbc0bc-2aa8-4ae4-a861-ede135959036.png)


## stackoverflow queston: `Is there a max limit to the $nin operator in MongoDB?`

![image](https://user-images.githubusercontent.com/31458531/210134154-7c41a90e-3804-4d8d-aff8-356ba08c2f23.png)

## whats is `$$ROOT`

Stack overflow Anser: [Click here](https://stackoverflow.com/a/61833219/10012446)

## You can create mongodb object ids from plain text as well

![image](https://user-images.githubusercontent.com/31458531/210085356-4b943271-10ae-4594-8749-e61af86edc49.png)


## post hooks with `mongoose`

**Docs: [Click here](https://mongoosejs.com/docs/middleware.html#post)**

![image](https://user-images.githubusercontent.com/31458531/206688709-25396fc2-39f1-4a50-bc55-f67e1325a549.png)


## Clearing collections (can be used for better test without sideeffects)

```js
import { Connection } from 'mongoose';

export const dropCollections = async (connection: Connection) => {
  await Promise.all(
    (await connection.db.collections()).map((collection) => collection.deleteMany({})),
  );
};
```

## more

Source: [Click here](https://stackoverflow.com/a/32811548/10012446)

![image](https://user-images.githubusercontent.com/31458531/201935213-7bb54d74-96f5-46de-9520-8d58b55d14ca.png)

# Thats how you can hide some of the fields

![image](https://user-images.githubusercontent.com/31458531/202694888-70939dfd-3f47-4245-98e2-eb0e1185b008.png)

## Executing js files with mongodb

```js
// switch to database
use imdb;

// firstly we have to clean up potential remainders
db.dropDatabase();

// create admin user
db.createUser({
user: 'imdb',
pwd: 'simple',
roles: [{ role: 'dbOwner', db:'imdb'}]
});
```

## `$within`?

This is for checking a point lies in given shape with given values of its edges and coordinates. (Not at all useful to check if a coordinate exists in 10kms range of another coordinate point on earth).

Sourc: [Click here](https://mongodb-documentation.readthedocs.io/en/latest/reference/operator/within.html#gsc.tab=0)

Also, `$geoWithin` works in similar way. Source: [Click here](https://www.mongodb.com/docs/manual/reference/operator/query/geoWithin/)

## To share with Eric

Even with this `$near` operator mongodb doesn't support calculating distance b/w two coordinates. We would need to use some custom logic or some third party lib to get approx distance.

![image](https://user-images.githubusercontent.com/31458531/205102604-652a7b00-6446-4a3c-81ef-e17d7635d749.png)

![image](https://user-images.githubusercontent.com/31458531/205103176-fddfe47c-1f4d-4822-820d-b8995e3411b1.png)

![image](https://user-images.githubusercontent.com/31458531/205103694-8196ed85-e719-44ff-a669-3a19367f71d9.png)


links for eric:
- Issue on Community (NOT RESOLVED): [Click here](https://www.mongodb.com/community/forums/t/how-to-calculate-distance-between-two-geolocation-points/173045)
- Proposal on feeback forum (NOT RESOLVED): [Click here](https://feedback.mongodb.com/forums/924280-database/suggestions/45394135-add-operator-that-would-calculate-distance-between)
- Issue on Jira (NOT RESOLVED): [Click here](https://jira.mongodb.org/browse/SERVER-2990)


## Finding distance between two gps locations (point to point and not the actual travelling distance by roads)

**Source: [Click here](https://www.youtube.com/watch?v=qbge8Psdyrw)**

*Also: In case you wanna calculate distance using Haversine formula: [Stackoverflow Question](https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula/27943#27943)*

Docs: $geoNear: [version4.0](https://www.mongodb.com/docs/v4.0/reference/operator/aggregation/geoNear/#pipe._S_geoNear), [ver6-latest](https://www.mongodb.com/docs/manual/reference/operator/aggregation/geoNear/)

Docs: [Geospatial Queries](https://www.mongodb.com/docs/v4.0/geospatial-queries/)

I managed to calculate distance b/w two gps locations and returning the docs in nearest first order with just mongo's geospatial utils. ALSO: I tested with my nearby locations as well, it seemed to work for me.

Find this code in `mongo-shell-with-watcher` folder, yikes! **TESTED with my custom gps locations as well. Yikes!!**

![image](https://user-images.githubusercontent.com/31458531/205132307-2ae1c56e-3ebe-446c-8b40-16132edf8b3e.png)


## Amazing and sweet explanation of document linking by mongodb

[Click here](https://www.mongodb.com/docs/atlas/schema-suggestions/avoid-unbounded-arrays/)

## Maximum number of records in single document in mongodb?

Source: [Click here](https://stackoverflow.com/questions/39622354/how-many-bson-objectids-can-a-mongodb-array-field-save)

Docs: [MongoDB Limits and Thresholds](https://www.mongodb.com/docs/manual/reference/limits/)

![image](https://user-images.githubusercontent.com/31458531/205167045-06deaa7d-9377-48a6-869d-7bcc4ec2eeb7.png)

