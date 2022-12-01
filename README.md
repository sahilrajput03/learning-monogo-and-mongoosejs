# Readme

LinkedIn Quiz Solutions: [Click here](https://github.com/Ebazhanov/linkedin-skill-assessments-quizzes/blob/main/mongodb/mongodb-quiz.md)

**`flash` is my own testing library, the code is @ [`flash`](https://github.com/sahilrajput03/flash).**

- **learn-cli-mongo:** [Web notes](https://sahilrajput03.ml/learn-mongo-cli.html), [mirror @ github file](https://github.com/sahilrajput03/sahilrajput03/blob/master/learn-mongo-cli.md)

- From `jest` official docs for testing mongodb database (using official `mongodb` library): https://jestjs.io/docs/mongodb


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
