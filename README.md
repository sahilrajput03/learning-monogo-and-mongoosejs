# Readme

**Quicks Links:**

- **❤️Learn Mongodb Doc: [Click here](https://docs.google.com/document/d/1OT6IMR600VjWteJ-kqM0jVQuqQQw308hkh3enZnu9tQ/edit?tab=t.0)** [Tags: `#mongodump`, `#mongorestore`, `#mongosh`, `#bsondump`]
- **❤️Learn mongoosejs:** [Click here](./mongoosejs-with-flash-runner-cli/test1.test.js) (`mongoosejs-with-flash-runner-cli`)
- **❤️Learn mongosh:** [Click here](./mongosh-scripts-with-watcher/Readme.md) (`mongosh-scripts-with-watcher`)
- **❤️Learn backup and restore mongodb:** [Click here](./backup-and-restore) (`backup-and-restore`)
- LinkedIn Quiz Solutions: [Click here](https://github.com/Ebazhanov/linkedin-skill-assessments-quizzes/blob/main/mongodb/mongodb-quiz.md)e
- **`flash` is my own testing library, the code is @ [`flash`](https://github.com/sahilrajput03/flash).**
- From `jest` official docs for testing mongodb database (using official `mongodb` library): https://jestjs.io/docs/mongodb
- Seems like a good read on efficient mongodb queries with mongoosejs: [Click here](https://climbtheladder.com/10-mongoose-populate-best-practices/)
- ❤️TODO Docs:
  - Indexes: [Click here](https://www.mongodb.com/docs/manual/indexes/)
  - What is Indexing in a Database?: [Click here](https://www.mongodb.com/resources/basics/databases/database-index)
  - Article - Digital Ocean - How To Use Indexes in MongoDB: [Click here](https://www.digitalocean.com/community/tutorials/how-to-use-indexes-in-mongodb)
  - What is the difference between ‘index’ and ‘search index’?: [Click here](https://www.mongodb.com/community/forums/t/what-is-the-difference-between-index-and-search-index/200703)
  - Article - An 80/20 Guide to Mongoose Plugins - The Code Barbarian: [Click here](https://thecodebarbarian.com/2015/03/06/guide-to-mongoose-plugins)

## ❤️ `serverSelectionTimeoutMS` in mongoose

Docs: [Click here](https://mongoosejs.com/docs/connections.html#serverselectiontimeoutms)

Recently used in repo - [andorid-loop](https://github.com/sahilrajput03/android-loop)

_Below text is from above mongoose docs link._

The serverSelectionTimeoutMS option is extremely important: it controls how long the MongoDB Node.js driver will attempt to retry any operation before erroring out. This includes initial connection, like await mongoose.connect(), as well as any operations that make requests to MongoDB, like save() or find().

By default, serverSelectionTimeoutMS is 30000 (30 seconds). This means that, for example, if you call mongoose.connect() when your standalone MongoDB server is down, your mongoose.connect() call will only throw an error after 30 seconds.

```js
// Throws an error "getaddrinfo ENOTFOUND doesnt.exist" after 30 seconds
await mongoose.connect('mongodb://doesnt.exist:27017/test')
```

Similarly, if your standalone MongoDB server goes down after initial connection, any find() or save() calls will error out after 30 seconds, unless your MongoDB server is restarted.

While 30 seconds seems like a long time, serverSelectionTimeoutMS means you're unlikely to see any interruptions during a replica set failover. If you lose your replica set primary, the MongoDB Node driver will ensure that any operations you send during the replica set election will eventually execute, assuming that the replica set election takes less than serverSelectionTimeoutMS.

To get faster feedback on failed connections, you can reduce serverSelectionTimeoutMS to 5000 as follows. We don't recommend reducing serverSelectionTimeoutMS unless you are running a standalone MongoDB server rather than a replica set, or unless you are using a serverless runtime like AWS Lambda.

```js
mongoose.connect(uri, {
	serverSelectionTimeoutMS: 5000,
})
```

There is no way to tune serverSelectionTimeoutMS independently for mongoose.connect() vs for queries. If you want to reduce serverSelectionTimeoutMS for queries and other operations, but still retry mongoose.connect() for longer, you are responsible for retrying the connect() calls yourself using a for loop or a tool like p-retry.

```
const serverSelectionTimeoutMS = 5000;

// Prints "Failed 0", "Failed 1", "Failed 2" and then throws an
// error. Exits after approximately 15 seconds.
for (let i = 0; i < 3; ++i) {
  try {
    await mongoose.connect('mongodb://doesnt.exist:27017/test', {
      serverSelectionTimeoutMS
    });
    break;
  } catch (err) {
    console.log('Failed', i);
    if (i >= 2) {
      throw err;
    }
  }
}
```

## Viewing active connections of a database

Run from Mongodb Compass Shell (Tested on both local and atlas cluster):

**From ChatGPT:**

- current: Number of active connections.
- available: Connections that can still be opened.
- totalCreated: Total connections created since the server started.

Command: `db.serverStatus().connections`

![image](https://github.com/user-attachments/assets/394c5456-3d8e-4238-94c9-25efd89c801e)

## Skip/Bypass validation while saving to mongodb

```ts
const doc = new MyUserModel({
	userId: null,
	url: null,
})
await doc.save({validateBeforeSave: false})
```

## ❤️ View documents in reverse chronology order (recent documents order):

![image](https://github.com/user-attachments/assets/86ca0abe-1ccf-4bc9-8fc3-e6cfbea50f97)

## Naming conventions in mongodb

- Stackoverflow: [https://stackoverflow.com/a/45335909/10012446](https://stackoverflow.com/a/45335909/10012446)
  - ❤️tldr:
    - Use db names like `flipkartDB` (camelCase + append DB in the end)
    - For collection names use `cameCase`

## Typegoose to help write mongoose schemas with classes

- [github 2.2k\*](https://github.com/typegoose/typegoose)
- [npm](https://www.npmjs.com/package/@typegoose/typegoose)
- [npmtrends](https://npmtrends.com/@typegoose/typegoose-vs-mongoose) (downloads stats)

**(18 Feb, 2025) Note from Sahi ✅:**

- ❌ I feel its unnecessary to bring much code of foreign library (which which has its own [downsides](https://typegoose.github.io/typegoose/docs/guides/known-issues/) and [issues](https://github.com/typegoose/typegoose/issues) for sure) when we get all the type errors via typescript itself already 🚀.
- ❌ Schema creation is one time job and changing schema is done very rarely and thus not make much deal about it.
- ❌ I am heavily invested in ideology to not add complexity of any library unnecessary thus not use typegoose here. The tradeoffs are not much good for using this library.

## Cloudflare worker connection with mongodb atlas is not possible as of date (but WIP) - 10 Feb 2025

- Cloudflare workers doesn't work well with connecting with mongodb for now.
- **Sources Tried:**
- https://www.reddit.com/r/CloudFlare/comments/1fb5ji1/connect_mongodb_with_cloudflare_worker/
  - https://github.com/jchoi2x/cf-mongodb-polyfills
    - https://github.com/jchoi2x/cf-mongodb-polyfills/issues/4
      - https://github.com/cloudflare/workerd/discussions/2721#discussioncomment-11999598
- **Alternated dbs for cloudflare:**
  - d1 db by cloudflare for https://developers.cloudflare.com/d1/
  - https://bejamas.com/compare/cloudflare-d1-vs-mongodb-atlas

## 🛑 Mongodb realm is deprecating soon.

- Src - https://www.reddit.com/r/mongodb/comments/1fcsemu/mongodb_realm_deprecation/
- Docs - https://www.mongodb.com/products/updates/product-support-deprecation

## It takes 30ms to open connection to mongodb running locally

**_Thus if you have 33 test files and you open db for each test file then total time consumed for opening database connection is just 1 SECOND (33\*30ms = 1000ms)._**

- **"Premature optimization is the root of all evil" ~ Donald Knuth**
  - Though, if you're still care about optimization then please refer my solution of `flash-runner`, which is a cli tool and you can open db connection and it is shared across all tests then and you can close the db once in the end. This is used in some repo in `learn-expressjs`, `learning-monogo-and-mongoosejs` and `learning_sql`. Thanks.\*

```ts
// Source - Check qr-solution backend.
console.time('db-start')
    try {
        mongoose.set('strictQuery', true)
        const conn = await mongoose.connect(MONGO_URI)
        if (process.env.NODE_ENV !== 'test') {
            logger.success(`MONGO DB CONNECTED: ${conn.connection.host}`)
        }
        console.timeEnd('db-start') // db-start: 28.915ms
```

## ❤️ ❤️ Avoid duplicate references when creating relationships

~ Written by Sahil Rajput.

When you want to reference between two collections you can store the id of the 1st document in second document only (no need to store id of second document in first Documents). Now when you need second document you can avoid using populate of the first document and rather make a separate query on second collection e.g. `secondCollection.find({ userId: "..."})`. Also for the reverse query i e., to get linked first document from the second document — you have userId field in the second document itself.

This way we avoid making redundant reference in documents of the first collection and also achieve the goal to visually see what the second document is linked to by directly looking at documents of the second collection.

Also, .populate() internally makes two queries just like we would manually query to the second collection to get the item using the id stored on that field.

## ❤️ Database schema for Google User details? (Claude and ChatGPT)

_What is better?_

_- having google user data to a nested field in mongodb or_
_- having separate collection for google-users and link them to users collection._

_Be concise._

**From ChatGPT:**

- **Having a separate collection for Google users and linking it to the users collection is better. It ensures better scalability, normalization, and easier management of relationships while avoiding duplication of data.**

**❤️From Claude:**

- **For most applications, having a separate collection for Google users is better because:**
  - **1. It maintains cleaner data separation and schema flexibility**
  - **2. Enables easier querying of Google-specific data**
  - **3. Follows MongoDB's principle of embedding vs referencing - reference when data can change independently or needs to be queried independently**

**Use embedded nested fields only if the Google data is simple, rarely changes, and is always queried together with the user data.**

## What does `.populate()` do in mongoose? Is it natively from mongodb driver? What does it do behind the scenes? (ChatGPT)

In Mongoose, `.populate()` is a powerful method used to automatically replace a referenced document ID with the actual document data from another collection. This feature simplifies working with related data in Mongo

What does `.populate()` do in Mongoose?

`.populate()` in Mongoose is a method used to perform data lookup. It replaces references (e.g., `ObjectIDs`) in a document with the actual documents from another collection. This is particularly useful when working with relational data structures in MongoDB. For example:

Suppose you have two collections: `users` and `posts`. A post may reference a user through a `userId`. Using `.populate()`, you can retrieve the complete user document when querying posts.

Example:

```js
const post = await Post.findById(postId).populate('author')
// Now, `post.author` contains the user document instead of just the ID.
```

Is `.populate()` natively from MongoDB driver?

No, `.populate()` is not part of the native MongoDB driver. It is a feature of Mongoose, an ODM (Object Document Mapper) for MongoDB. The native MongoDB driver does not provide this functionality. Instead, you would need to perform a manual join-like operation using multiple queries and combine the data programmatically.

What does `.populate()` do behind the scenes?
Under the hood, `.populate()` performs the following steps:

1. **Identify the referenced field:** Mongoose examines the schema to find the field to populate (e.g., author in the example above).

2. **Perform a separate query:** Mongoose makes an additional query to the referenced collection (e.g., users) to fetch the related documents. This query is performed based on the ObjectID or the reference specified in the original document.

For instance:

```js
const user = await User.findById(post.author)
```

3. **Merge the data:** The results of the separate query are merged into the original document, replacing the reference with the actual data.

After population, you get something like this:

```js
{
    "_id": "postId",
    "title": "My Post",
    "author": {
        "_id": "userId",
        "name": "John Doe",
        "email": "john@example.com"
    }
}
```

4. Handle options like filtering and projection (if specified):
   You can pass additional options to control how .populate() behaves:

```js
Post.findById(postId).populate({
	path: 'author',
	select: 'name email',
})
```

**_Key Notes:_**

1. Performance:
   Each .populate() call results in an additional query to the database. This can lead to performance issues for large or deeply nested relationships. Use judiciously.

2. Lean queries: If you use .lean() with .populate(), you still get the populated documents, but they are plain JavaScript objects instead of Mongoose documents.

3. Virtual populate: Mongoose also supports virtual population, where references are not explicitly stored in the database but resolved dynamically using query logic.

Example:

```js
userSchema.virtual('posts', {
	ref: 'Post',
	localField: '_id',
	foreignField: 'author',
})

// now we can make below query and it works magically
User.findById(userId).populate('posts')
```

`.populate()` simplifies working with related data in MongoDB by abstracting the process of manually fetching and combining related documents.

## What is virtual populate in mongoose? Give example. be concise. (ChatGPT)

In Mongoose, virtual populate is a feature that lets you set up virtual fields in your schema to populate related documents without storing references directly in the database. It works by dynamically pulling related data based on specified criteria.

```js
const mongoose = require('mongoose')

// Define schemas
const userSchema = new mongoose.Schema({
	name: String,
})

const postSchema = new mongoose.Schema({
	title: String,
	content: String,
	author: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User', // For regular populate
	},
})

// Add virtual field to User schema
userSchema.virtual('posts', {
	ref: 'Post', // Related model
	localField: '_id', // Field in User model
	foreignField: 'author', // Field in Post model
})

// Enable virtuals in JSON output
userSchema.set('toJSON', {virtuals: true})
userSchema.set('toObject', {virtuals: true})

// Models
const User = mongoose.model('User', userSchema)
const Post = mongoose.model('Post', postSchema)

// Usage
;(async () => {
	const user = await User.findOne().populate('posts')
	console.log(user.posts) // Virtual populate
})()
```

**Key Points:**

- Virtuals are not stored in the database.
- They are computed dynamically based on relationships.
- Useful for simplifying queries without duplicating references.

## Piyush's Project vs. Slasher's Project

- In piyush's project, we got `userSchema.pre('save', () => {...})` method and it updates `password` field to be hashed i.e., `User.create({ password: 'plain-text'})` automatically saved password to hash. This is cool, and the current note-zipper project has the implementation for the `userFactory`. The big difference b/w `userFactory` of piyush's project and slasher project is that slasher's project uses transient properties which is not needed at all when we have auto hashing of passwords set on the schema.
- In slasher's project, we have defiend custom schema methods i.e, `UserSchema.methods.setUnhashedPassword = () => {...}` which works like below:

```js
const user = new User(userRegisterDto)
// set the hashed password manually on the user document
user.setUnhashedPassword(userRegisterDto.password)
// needed to updated in db
await userDetails.save()
```

## mongodb - connection states

![image](https://user-images.githubusercontent.com/31458531/192446672-e1d27156-5e62-49ec-a8b5-6732fe673067.png)

## Does validation message plays any role when `required: false` (tldr: no)

```js
// schema:
  password: {
    type: String,
    required: [false, 'Please Enter Your Password'],
    minLength: [8, 'Password should be greater than 8 characters'],
    select: false,
  },
```

```js
// password field is only retrieved when explicitly asked for like below
const user = await User.findOne({email}).select('+password')
```

![image](https://github.com/sahilrajput03/learning-monogo-and-mongoosejs/assets/31458531/9c6bda7b-31ab-424a-9ee8-7dcf8597da82)

## Validatation using mongoose data

```bash
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  }
});

const User = mongoose.model('User', userSchema);

// This is useful for simple validation on APIs
async function validateUser() {
  const newUser = new User({
    username: 'john_doe',
    email: 'john.doe@email.com'
  });

  try {
    await newUser.validate();
    console.log('Data is valid!');
  } catch (error) {
    console.error(error.message);
  }
}

validateUser();
```

## Comparison for custom validation libraries for data on backend:

<img src="https://github.com/sahilrajput03/learning-monogo-and-mongoosejs/assets/31458531/4b0ecf44-db9b-47f5-998c-b7f87c8227f0" width="800" />

## How can a store documents such that I can fetch them in a particular sequence

Query: For e.g., we have a 10 classes in a school, then each class has students with defined roll numbers to them in ascending order. So, we need to fetch list of students in a particular order only, in other words we need to maintain their order/sequence.

Solution:

1. Use a Sequence Field: Add a `sequence` field to your documents that represents the order or sequence of the documents. When you retrieve documents, you can use this field to sort them in the desired sequence. When retrieving documents, you can use .sort({ "sequence": 1 }) to get them in ascending order.
   ```js
   {
     "_id": ObjectId("documentId"),
     "name": "Document Name",
     "sequence": 1
     // Other document fields
   }
   ```
2. Maintain an External List in your class document for e.g., `rollNumbers: [studentId1, studentId2, and so on...]` that represents the desired sequence. When you need to retrieve documents in a specific order, you can fetch the list of IDs and then retrieve the documents based on this list. This approach allows you to change the order without modifying the documents themselves. However, it requires additional management of the order list.

## `maxTimeMS` (sems like it doesn't work though)

[chatGPT](https://chat.openai.com/share/910c0308-a8dd-49bd-9089-e95f946119cb)

![image](https://github.com/sahilrajput03/learning-monogo-and-mongoosejs/assets/31458531/215802a2-315f-4dc6-88e9-8474eedd440c)

```js
    const doc of moviesModel
      .find({ deleted: MovieDeletionStatus.NotDeleted })
      .cursor({ maxTimeMS: 5000 })
  ) {
    // doc
  }

```

## Using `.exists()` method to check if one or more documents match with a given filter

Note: `Model.exists(filter)` returns `{ _id: id_of_first_matched_document } | null`.

```ts
async podcastUrlIsAvailable(podcastUrl: string): Promise<boolean> {
  const podcastExists = await this.podcastsModel.exists({ rssUrl: podcastUrl });
  return !podcastExists;
}
```

## How many parallel mongodb insert query can I run in parallel with mongoosejs in nodejs?

![image](https://github.com/sahilrajput03/learning-monogo-and-mongoosejs/assets/31458531/d8ce0d15-e7e2-46ab-a006-8377e3619224)

## Actively closing mongodb connection to close NestJS app immediately when we run custom `scripts`

Source: [Click here](https://stackoverflow.com/a/20167155)

Problem: When we run a below script with a simple `console.log`, the app.close works pretty good but when we have some bulky db operations with db the `app.close` seems to hang out for some time like 1-2 minutes thus we can fix that issue by actively closing the db connection as shown in below screenshot.

![image](https://github.com/sahilrajput03/learning-monogo-and-mongoosejs/assets/31458531/6ca1ced6-7259-420b-a832-75813f507f63)

## Sort in mongodb

Short notes:

1. Default is ascending order ie., `sort: 1`
2. Providing `sort: -1` to get in descending order.

![image](https://github.com/sahilrajput03/learning-monogo-and-mongoosejs/assets/31458531/1807c9c4-648e-4806-9697-a4e81d91a9c6)

## Amazing mongodb query

Link to saved playground by Author: [Click here](https://mongoplayground.net/p/uo8cMK-9N0t)

Stackoverfow Answer: [Click here](https://stackoverflow.com/a/69554895)

## How can we print more than 20 items in mongo shell?

Source: [Click here](https://stackoverflow.com/a/5094867/10012446)

![image](https://user-images.githubusercontent.com/31458531/232702960-48fd02e9-d2a6-43a4-a94b-4e83aa1eb341.png)

## What is mongodb cluster?

![image](https://user-images.githubusercontent.com/31458531/230266118-7f971c78-b7c5-4aee-97fa-858a75c9978d.png)

## Using `$in` and `$nin` operator for a single field at the same time

![image](https://user-images.githubusercontent.com/31458531/228137175-7d462d7e-8bc7-4219-a50a-0f992e72e374.png)

Also, `$and` is redundant and thus we can remove `$and` and it would work same again:

![image](https://user-images.githubusercontent.com/31458531/228137271-11283de4-32ba-4e60-9708-a95008081716.png)

## Latitude vs. longitude

Source: Stack Overflow Question: [Click here](https://stackoverflow.com/a/7780993/10012446)

`The latitude must be a number between -90 and 90 and the longitude between -180 and 180.`

## Find documents within rectangular region specifed by `[topRightCoordinate, bottomLeftCoordinates]`

Specifies a rectangle for a geospatial $geoWithin query to return documents that are within the bounds of the rectangle, according to their point-based location data.

**$box:** [Click here](https://www.mongodb.com/docs/manual/reference/operator/query/box/)

```js
{
	/* using mongocompass's query, worked awesome! */
}
db.events.find({
	location: {
		$geoWithin: {
			$box: [
				[topRightCoordinateLat, topRightCoordinateLng],
				[bottomLeftLat, bottomLeftLng],
			],
		},
	},
})
```

## Find documents within a given radius around a given coordinate

```js
const results = await this.eventModel.aggregate([
	{
		$geoNear: {
			near: {
				type: 'Point',
				coordinates: [lattitude, longitude],
			},
			maxDistance: maxDistanceMetres,
			distanceField: 'distance',
			// get distances of each event in miles
			distanceMultiplier: METRES_TO_MILES_MULTIPLIER,
		},
	},
	// any other optional query (NOTE: `$geoNear` must be the first query in the pipeline array of queries
	{$match: query},
])
```

## `GeoJSON Objects` and `Geospatial Queries` in mongodb

<ins>Docs:</ins>

- GeoJSON Objects: [Click here](https://www.mongodb.com/docs/manual/reference/geojson/)
- Geospatial Queries: [Click here](https://www.mongodb.com/docs/manual/geospatial-queries/)

MongoDB geospatial queries on GeoJSON objects calculate on a sphere; MongoDB uses the WGS84 reference system for geospatial queries on GeoJSON objects.

Syntax:

`<field>: { type: <GeoJSON type> , coordinates: <coordinates> }`

```txt
// Point
{ type: "Point", coordinates: [ 40, 5 ] }

// LineString
{ type: "LineString", coordinates: [ [ 40, 5 ], [ 41, 6 ] ] }

// Polygon
{
  type: "Polygon",
  coordinates: [ [ [ 0 , 0 ] , [ 3 , 6 ] , [ 6 , 1 ] , [ 0 , 0  ] ] ]
}

// Polygons with Multiple Rings
{
  type : "Polygon",
  coordinates : [
     [ [ 0 , 0 ] , [ 3 , 6 ] , [ 6 , 1 ] , [ 0 , 0 ] ],
     [ [ 2 , 2 ] , [ 3 , 3 ] , [ 4 , 2 ] , [ 2 , 2 ] ]
  ]
}


// MultiPoint
{
  type: "MultiPoint",
  coordinates: [
     [ -73.9580, 40.8003 ],
     [ -73.9498, 40.7968 ],
     [ -73.9737, 40.7648 ],
     [ -73.9814, 40.7681 ]
  ]
}

// MultiLineString
{
  type: "MultiLineString",
  coordinates: [
     [ [ -73.96943, 40.78519 ], [ -73.96082, 40.78095 ] ],
     [ [ -73.96415, 40.79229 ], [ -73.95544, 40.78854 ] ],
     [ [ -73.97162, 40.78205 ], [ -73.96374, 40.77715 ] ],
     [ [ -73.97880, 40.77247 ], [ -73.97036, 40.76811 ] ]
  ]
}


// MultiPolygon
{
  type: "MultiPolygon",
  coordinates: [
     [ [ [ -73.958, 40.8003 ], [ -73.9498, 40.7968 ], [ -73.9737, 40.7648 ], [ -73.9814, 40.7681 ], [ -73.958, 40.8003 ] ] ],
     [ [ [ -73.958, 40.8003 ], [ -73.9498, 40.7968 ], [ -73.9737, 40.7648 ], [ -73.958, 40.8003 ] ] ]
  ]
}

// GeometryCollection
{
  type: "GeometryCollection",
  geometries: [
     {
       type: "MultiPoint",
       coordinates: [
          [ -73.9580, 40.8003 ],
          [ -73.9498, 40.7968 ],
          [ -73.9737, 40.7648 ],
          [ -73.9814, 40.7681 ]
       ]
     },
     {
       type: "MultiLineString",
       coordinates: [
          [ [ -73.96943, 40.78519 ], [ -73.96082, 40.78095 ] ],
          [ [ -73.96415, 40.79229 ], [ -73.95544, 40.78854 ] ],
          [ [ -73.97162, 40.78205 ], [ -73.96374, 40.77715 ] ],
          [ [ -73.97880, 40.77247 ], [ -73.97036, 40.76811 ] ]
       ]
     }
  ]
}
```

## Thats how different indexes look in the mongo compass for a collection

![image](https://user-images.githubusercontent.com/31458531/224561264-d40e7b9f-d60d-4087-bf58-ccfd29acc362.png)

## Typescript with mongoose

Source (official mongoose docs):

- 1. Schemas in TypeScript: [Click here](https://mongoosejs.com/docs/typescript/schemas.html)
- 2. Statics and Methods in TypeScript: [Click here](https://mongoosejs.com/docs/typescript/statics-and-methods.html) (below screenshot)

![image](https://user-images.githubusercontent.com/31458531/224515793-2e843b81-4b5a-4779-984c-b3f8bab6d854.png)

## Getting all collecion names

```ts
// getting names of all models
const mongooseModelsNames = connection.modelNames()

// getting all models as an array
const mongooseModels = connection
	.modelNames()
	.map((modelName) => connection.model(modelName))
```

## On demand creating an index for a collection

```ts
;(await connection.db.collections())
	.find((collection) => collection.collectionName === 'events')
	.createIndex({location: '2dsphere'})
```

## Using geospatial schema definition example

- Source: Mongoose: Using GeoJSON: [Click here](https://mongoosejs.com/docs/geojson.html)
- Yet another amazing article: Geospatial Queries: [Click here](http://thecodebarbarian.com/80-20-guide-to-mongodb-geospatial-queries)
- GeoJson: [Click here](https://mongoosejs.com/docs/geojson.html)

```js
const citySchema = new mongoose.Schema({
	name: String,
	location: {
		type: {
			type: String,
			enum: ['Point'],
			required: true,
		},
		coordinates: {
			type: [Number],
			required: true,
		},
	},
})

// to add data use this format:
// loc: { type: "Point", coordinates: [ longitude, latitude ] },
```

## ♥ ❣♥ ❣♥ ❣ `findOneAndUpdate` is best and how to use from the maintainer itself

- MongoDb Docs: [findOneAndUpdate](https://www.mongodb.com/docs/manual/reference/method/db.collection.findOneAndUpdate/)
- MongooseJs: [How to Use findOneAndUpdate() in Mongoose](https://mongoosejs.com/docs/tutorials/findoneandupdate.html)
- Source: [SO](https://stackoverflow.com/a/59491047/10012446)

```ts
// creating new document if already doesn't exist (note: we're passing {} as second coz we just want a new document with required fields (search fields in 1st argument)
await this.feedReplyLikeModel.findOneAndUpdate({ feedReplyId, userId }, {}, { upsert: true, new: true });


const doc = await Contact.findOneAndUpdate(
  { phone: request.phone},
  { status: request.status },
  { upsert: true, new: true }
);


# Comment from here: https://stackoverflow.com/a/7486950/10012446
# I don't think you need the {$set: ... } part here as its automatic form my reading
# ~Sahil: People use $set as well:
const doc = await Contact.findOneAndUpdate(
  { phone: request.phone},
  { $set: { status: request.status } },
  { upsert: true, new: true }
);
```

### LEARN: ♥ ❣♥ ❣♥ Difference between `upsert: true` and `new: true`. Source: https://stackoverflow.com/a/44794886

```txt
They are completely different flags
- If upsert is true then if the row trying to be updated does not exist then a new row is inserted instead , if false then it does not do anything .
- If new is true then the modified document is returned after the update rather than the original , if false then the original document is returned
```

## Usage of `$exists`

- Source: [Mongoplayground](https://mongoplayground.net/)
- Docs: [$exists](https://www.mongodb.com/docs/manual/reference/operator/query/exists/)

Without `$exists`:

```bash
# Collection
[{"key": 1,car: 10},{"key": 2}]

# Query
db.collection.aggregate([{$match: {car: {$ne: 20}}}])

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
db.collection.aggregate([{$match: {car: {$exists: true, $ne: 20}}}])

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

_Drawback:_

- We don't get created/updated document, so we need fo to make a `findOne` query explcitly
- Do not rely on returned value i.e, `value.upsertedId` as this is only preset if document is created (not returned when its updated)

```ts
// its useful as it creates the record with necessary values if it already doesn't exist
await this.movieUserStatusModel.updateOne(
	{movieId, userId},
	{$set: {rating}},
	{upsert: true}
)
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
import mongoose from 'mongoose'

// TESTED: 6 Dec, 2023 (16.13.1), mongoose: ^7.6.3, mongodb (docker): mongo:4.0.9
// Drop entire database (which will drop all collections in one operation)
await mongoose.connection.dropDatabase()
```

```js
// Delete all documents from the database
await Promise.all(
	(
		await connection.db.collections()
	).map((collection) => collection.deleteMany({}))
)
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
	{_id: new mongoose.Types.ObjectId(id)},
	{likes: {$slice: [offset ?? 0, offset + limit]}}
)
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

## `#not_tested` You can Enable indexing for fields in backend server directly as well (otherwise we simply enable in the mongodb server `In Compass`)

![image](https://user-images.githubusercontent.com/31458531/215793227-45f230f6-b870-4a62-b41c-89e42f37dd32.png)

## Directly searching a document of a given \_id can be done like that:

![image](https://user-images.githubusercontent.com/31458531/211829410-e66dadc1-2a1d-403f-9617-293043ce0857.png)

## Thats how we do transactions with mongoose

_Transactions are new in MongoDB 4.0 and Mongoose 5.2.0. Transactions let you execute multiple operations in isolation and potentially undo all the operations if one of them fails. This guide will get you started using transactions with Mongoose._

**Transactions in Mongoose DOCS:** [Click here](https://mongoosejs.com/docs/transactions.html)

![image](https://user-images.githubusercontent.com/31458531/213842447-2afc8f6f-73f0-4dee-9ced-707e20b736bc.png)

## Order of array while searching matters

That means if you use wrong order then the query will not match the document:

![image](https://user-images.githubusercontent.com/31458531/211662275-dd65edd2-7ea9-4819-bb2e-b9f641655bca.png)

## You don't nee the $in operator to search inside of an array in `mongo` and `mongoose`

![image](https://user-images.githubusercontent.com/31458531/211585232-688742ab-7f58-4f06-97ed-d9ff29f8d260.png)

![image](https://user-images.githubusercontent.com/31458531/211585155-6c4a8a3c-f3e5-46c8-acb0-94a921f421ee.png)

## find duplicate#1 items in mongodb (finding unique items)

- Docs - `$group (aggregation)` : [Click here](https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/)
- Playground Link: [mongoplayground.net](https://mongoplayground.net/)

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

# PRO Tip: You can filter some data using a $match stage in the front of the aggregate query as well, for e.g, `{$match: {car: 30}}`
```

![image](https://user-images.githubusercontent.com/31458531/211373136-ab404c81-77b1-4a09-a78a-f9dab7a88469.png)

## find duplicate#2 items in mongodb (finding unique items)

- Docs - `$group (aggregation)` : [Click here](https://www.mongodb.com/docs/manual/reference/operator/aggregation/group/)
- Playground Link: [mongoplayground.net](https://mongoplayground.net/)

![image](https://github.com/sahilrajput03/learning-monogo-and-mongoosejs/assets/31458531/f2a6c281-057d-45cb-8e50-f4f066df75b7)

```bash
Documents:
[
  // good case: both users are deleted
  { "email": "Sahil", "deleted": true }, { "email": "Sahil", "deleted": true },
  // good case: one user deleted, one active
  { "email": "Mohit", "deleted": true }, { "email": "Mohit", "deleted": false },
  // *bad case*: one deleted user, two active user i.e, deleted=false
  { "email": "Mandy", "deleted": true }, { "email": "Mandy", "deleted": false },  { "email": "Mandy", "deleted": false },
]

# Query:
db.collection.aggregate([
  // filter only deleted users
  { $match: { deleted: false, } },
  // now we group by email
  { "$group": {
      "_id": {
        "email": "$email",
        "deleted": "$deleted"// delete is *optional* here though

      },
      "duplicates": { "$sum": 1 }
    }
  },
  { "$match": { "_id": { "$ne": null }, "duplicates": { "$gt": 1 } } },
])
```

## Cursor in mongodb, Iterate over documents individualy using stream

- Amazing - Mongodb Docs: [Click here](https://www.mongodb.com/docs/manual/tutorial/iterate-a-cursor/)
- MongooseJs: [Click here](https://mongoosejs.com/docs/api/querycursor.html)
- Stackoverflow Question: [Click here](https://stackoverflow.com/questions/56741578/mongoose-cursors-with-many-documents-and-load)

Q. **(Please see ChatGPT's awesome explanations below as well)** Why cursor and not batches (i.e, `limit()` way)? **Ans.** Using the skip feature when iterating through results in batches can get slower over time for large data sets, when skip is given a high numeric value, so streaming with a cursor helps to get around that. ~Credits: Eric

![image](https://user-images.githubusercontent.com/31458531/211360156-03499979-a645-4242-9950-417bab32672d.png)

From ChatGPT:

![image](https://github.com/sahilrajput03/learning-monogo-and-mongoosejs/assets/31458531/1bfc33f7-1405-49b8-b2e0-e46dd31d9866)

![image](https://github.com/sahilrajput03/learning-monogo-and-mongoosejs/assets/31458531/a6bdd1d5-451d-437f-b6b4-ff6170e6cf2c)

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
import {Connection} from 'mongoose'

export const dropCollections = async (connection: Connection) => {
	await Promise.all(
		(
			await connection.db.collections()
		).map((collection) => collection.deleteMany({}))
	)
}
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

_Also: In case you wanna calculate distance using Haversine formula: [Stackoverflow Question](https://stackoverflow.com/questions/27928/calculate-distance-between-two-latitude-longitude-points-haversine-formula/27943#27943)_

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
