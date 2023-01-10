# Readme

**Quicks:**
- **learn-cli-mongo:** [Github file](https://github.com/sahilrajput03/sahilrajput03/blob/master/learn-mongo-cli.md), [Web Page](https://sahilrajput03.ml/learn-mongo-cli.html).
- LinkedIn Quiz Solutions: [Click here](https://github.com/Ebazhanov/linkedin-skill-assessments-quizzes/blob/main/mongodb/mongodb-quiz.md)
- **`flash` is my own testing library, the code is @ [`flash`](https://github.com/sahilrajput03/flash).**
- From `jest` official docs for testing mongodb database (using official `mongodb` library): https://jestjs.io/docs/mongodb

## Order of array while searching matters

That means if you use wrong order then the query will not match the document:

![image](https://user-images.githubusercontent.com/31458531/211662275-dd65edd2-7ea9-4819-bb2e-b9f641655bca.png)


## You don't nee the $in operator to search inside of an array in `mongo` and `mongoose`

![image](https://user-images.githubusercontent.com/31458531/211585232-688742ab-7f58-4f06-97ed-d9ff29f8d260.png)

![image](https://user-images.githubusercontent.com/31458531/211585155-6c4a8a3c-f3e5-46c8-acb0-94a921f421ee.png)


## find duplicate items in mongodb

Docs - `$group (aggregation)` : [Click here](https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/)

![image](https://user-images.githubusercontent.com/31458531/211372185-d91fc2ec-f717-4066-abef-92192a5ccb2c.png)

```bash
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

