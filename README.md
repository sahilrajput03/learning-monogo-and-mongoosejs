# Readme

LinkedIn Quiz Solutions: [Click here](https://github.com/Ebazhanov/linkedin-skill-assessments-quizzes/blob/main/mongodb/mongodb-quiz.md)

**`flash` is my own testing library, the code is @ [`flash`](https://github.com/sahilrajput03/flash).**

- **learn-cli-mongo:** [Web notes](https://sahilrajput03.ml/learn-mongo-cli.html), [mirror @ github file](https://github.com/sahilrajput03/sahilrajput03/blob/master/learn-mongo-cli.md)

- From `jest` official docs for testing mongodb database (using official `mongodb` library): https://jestjs.io/docs/mongodb


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
