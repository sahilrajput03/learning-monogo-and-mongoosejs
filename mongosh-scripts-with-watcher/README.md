# Mongosh

**Quick Links:**
- Files: [Click here](#Code-from-script-files-via-autodocs)

## Watching scripts:

```bash
# Watching a mongo shell script with mongo shell
./watch.sh sh-1

# Watching javascript file with mongo shell
./js-watch.sh ./00.js
```

**Some used mongodb operators**

- [\$in operator, used in part 8 , ch-d](https://docs.mongodb.com/manual/reference/operator/query/in/)
- [\$exists operator, used in part 8 , ch-d](https://docs.mongodb.com/manual/reference/operator/query/exists/).

**Other Sources**

- Traversy Media: [@gist](https://gist.github.com/bradtraversy/f407d642bdc3b31681bc7e56d95485b6), Video [@youtube](https://www.youtube.com/watch?v=-56x56UppqQ&t=867s).
- Tutorials Point: [Tutorials point - Mongodb](https://www.tutorialspoint.com/mongodb/index.htm).
- Online mongodb-cli Playground: [Click here - mongoplayground.net](https://mongoplayground.net/), [Click here 2](https://www.humongous.io/app/playground/mongodb)
- Detect a file type restred db file: [Click here](https://stackoverflow.com/a/68232243/10012446)

# Exploring data with official mongodb extension with mogno playground **in vscode**

Docs: [Click here](https://www.mongodb.com/docs/mongodb-vscode/playgrounds/)

_FYI: Using my own way of creatinig files and running them on save with nodemon is much much better though._

![image](https://github.com/sahilrajput03/sahilrajput03/assets/31458531/18ea6c10-d8c1-4b4d-b60d-cde5c8019398)

# Search using regex in db

**FYI: Its good to do indexing if you have large number of records for efficient searching.**

FYI: In below query you could have used `/` to write concise queries (but online playground doesn't allow that syntax yet):

Learn all about [regext here in docs](https://www.mongodb.com/docs/manual/reference/operator/query/regex/).

**LEARN: `i` option helps to do a case-insensitive search**

```bash
db.collection.find({
  name: {
    "$regex": /hil/i
  }
})
```

![image](https://user-images.githubusercontent.com/31458531/166309109-50d9fc0a-83bb-409e-a015-3c4718017cdc.png)

# Roll

**Note** (_for Windows User_) : `git-bash` isn't performing good with mongo shell environment, so prefer cmd for now.

```bash
# To open a mongosh shell environment.
mongosh
# TIP: To clear logs in `mongo` shell, use ctrl+L hotkey or use command -> cls


#close mongosh shell
Ctrl+c # or use`exit` command


#show all dbs
show dbs


#to select db (or create **new db** if doesn't exist)
use test1


#shows currently selected db name
db


#Show the collections of currently selected db.
show collections


#creates new collection 'posts' in currently selected db.
db.createCollection('posts')


#Drop a collection named `mycollection`
use myDb # Select a database

# Drop collection
#  - Deleting a existing collection
db.mycollection.drop() # true

#  - Deleting a non-existing collection
db.mycollection.drop() # false


# Dropping a db:
use myDb # Select a database
db.dropDatabase() # Drop selected database.


# Insert a post
db.posts.insert({
	title: 'Post One',
	body: 'Body of post one',
	category: 'News',
	likes: 4,
	tags: ['news', 'events'],
	user: {
	name: 'John Doe',
	status: 'author'
	},
	data: Date()
})


# Insert many posts
db.posts.insertMany([
{
	title: 'Post Two',
	body: 'Body of post two',
	category: 'Technology',
	data: Date()
},
{
	title: 'Post Three',
	body: 'Body of post three',
	category: 'News',
	data: Date()
},
{
	title: 'Post Four',
	body: 'Body of post three',
	category: 'Entertainment',
	data: Date()
}
])


# Find posts
db.posts.find()
db.posts.find().pretty()


# Find posts with some filter
db.posts.find({category: 'News'})
db.posts.find({category: 'News'}).pretty()


# Find posts and sort
db.posts.find().sort({title:1}).pretty()
#title: 1 means sort by title in ascending order.


# Find posts and sort in descending order
db.posts.find().sort({title:-1}).pretty()
#title: -1 means sort by title in descending order.


#show first two posts only.
db.posts.find().limit(2)


#show only first two posts in descending ordered list by title property.
db.posts.find().sort({title: -1}).limit(2)


#amazing!!, Print documents in a particular required format
db.posts.find().forEach(function(doc) { print('Blog Post: ' + doc.title)})


#shows only the first found document.
db.posts.findOne({category: 'News'})
```

## Case 1 - `update()` method

```bash
db.posts.find({title: 'Post Random'})

db.posts.update(
	{ title: 'Post Random' },
	{
		title: 'Post Two',
		body: 'New Post 2 body',
		date: Date()
	}
)

db.posts.find({title: 'Post Two'})
```

## Case 2 - `update()` method with `upsert: true`

> _tldr:_
>
> 1. `update()` method in **Case 1** doesn't create a new document if the searched document doesn't exists.
> 2. `upsert: true` in `update()` method creates a completely new document if the matching document is not found.

```bash
# Reset our posts collection
db.posts.deleteMany({})

db.posts.insertMany([
{
	title: 'Post Two',
	body: 'Body of post two',
	category: 'Technology',
	data: Date()
},
{
	title: 'Post Two',
	body: 'Body of post two - DUPLICATE',
	category: 'Technology - DUPLICATE',
	data: Date()
},
{
	title: 'Post Two - a',
	body: 'Body of post three',
	category: 'News',
	data: Date()
}
])


db.posts.find({title: 'Post Two'})
# Obeservation 1: Shows only the exact two posts that matches i.e., first two posts in the above three posts we added.

db.posts.update(
	{ title: 'Post Two' },
	{
		title: 'Post Two',
		body: 'New Post 2 body',
		date: Date()
	},
	{ upsert: true}
)
# Output: WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
# Observation 2: Only the first post(since nModified is 1 that means a single document) that matched the filter is only updated out of two matched!


db.posts.find({title: 'Post Two'})
# Observaion 2: VERIFIED

###IMPORTANT:
# Previous document's data will be OVERWRITTEN.
# The second object is **OPTIONAL**. The second options object in current example tells that if the record doesn't exist then, create it. (upsert name comes from like UPdate OR insERT )
##Watch for next example for CLARIFICATION.


# ___ Debugging commands

# Get all posts
db.posts.find()
```

## Case 3 - `update()` method

_tldr_: Add content to document.

```bash
db.posts.find({title: 'Post Two'}).pretty()

# So this will update a document keeping all the earlier content as it is.
db.posts.update(
	{ title: 'Post Two' },
	{
		$set: {
				body: 'Body of post 2',
				category: 'Techonology',
			  }
	}
)

db.posts.find({title: 'Post Two'}).pretty()
```

## Case 4 - `$inc` operator with `update()` method

_tldr:_ The first matching document's likes property will be incremented by 2(if the property doesn't exists then the property will be set to 2).

```bash
# Reset our posts collection
db.posts.deleteMany({})

db.posts.insertMany([
{
	title: 'Post One',
	body: 'Body of post One',
	category: 'Technology',
	data: Date()
},
{
	title: 'Post One',
	body: 'Body of post One - DUPLICATE',
	category: 'Technology - DUPLICATE',
	data: Date()
},
{
	title: 'Post One - a',
	body: 'Body of post One - DUPLICATE - DUPLICATE',
	category: 'News',
	data: Date()
}
])

db.posts.find({title: 'Post One'}).pretty()

db.posts.update(
{title: 'Post One'},
{
	$inc: { likes: 2}
})
# Output: WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
# Observation1 : 1 document updated.

db.posts.find({title: 'Post One'}).pretty()
#Observation2 : The very first post is updated with property `likes: 2`.
#Observattion3 : Re-running the last update command will make the property to `likes: 4`
```

## Case 5 - `update()` method

```bash
# Reset our posts collection
db.posts.deleteMany({})

db.posts.insertMany([
{
	title: 'Post One',
	likes: 10
},
{
	title: 'Post One',
	likes: 10
},
{
	title: 'Post One - a',
	likes: 10
}
])

db.posts.find({title: 'Post One'}).pretty()
#Observation1: Finds first two document which we added using above command.

db.posts.update(
	{title: 'Post One'},
	{
		$rename: { likes: 'views'}
	}
)
# Output: WriteResult({ "nMatched" : 1, "nUpserted" : 0, "nModified" : 1 })
# Observation2: 1 Document updated.

db.posts.find({title: 'Post One'}).pretty()
# PROVES (Observation2): Only the first matched document's property name i.e., `likes` updated to `views`.
```

## `remove()` method

```bash
# Reset our posts collection
db.posts.deleteMany({})

db.posts.insertMany([
{
	title: 'Post One',
	likes: 10
},
{
	title: 'Post One',
	likes: 10
},
{
	title: 'Post One - a',
	likes: 10
}
])

db.posts.find({title: 'Post One'}).pretty()
#Observation1: Finds first two document which we added using above command.

db.posts.remove({title: 'Post One'})
# Output: WriteResult({ "nRemoved" : 2 })
# Observation: Two documents updated.
```

## `$set` operator ( subdocuments )

```bash
# Reset our posts collection
db.posts.deleteMany({})

db.posts.insertMany([
{
	title: 'Post One',
	likes: 10
},
{
	title: 'Post One',
	likes: 10
},
{
	title: 'Post One - a',
	likes: 10
}
])

db.posts.find({title: 'Post One'}).pretty()
#Observation0: Finds first two document which we added using above command.

db.posts.update(
	{ 	title: 'Post One' },
	{ 	$set:	{
					comments:	[
									{
										user: 'Mary Williams',
										body: 'Comment One',
										date: Date()
									},
									{
										user: 'Harry White',
										body: 'Comment Two',
										date: Date()
									}
								]
				}
	}
)
# Observation1: The first matching document is now has new comment property as added.

db.posts.find({title: 'Post One'}).pretty()
# Below ouput PROVES Observation1
# Output:
# {
#         "_id" : ObjectId("624de10adfa76c8c1b1fdf35"),
#         "title" : "Post One",
#         "likes" : 10,
#         "comments" : [
#                 {
#                         "user" : "Mary Williams",
#                         "body" : "Comment One",
#                         "date" : "Thu Apr 07 2022 00:20:53 GMT+0530 (IST)"
#                 },
#                 {
#                         "user" : "Harry White",
#                         "body" : "Comment Two",
#                         "date" : "Thu Apr 07 2022 00:20:53 GMT+0530 (IST)"
#                 }
#         ]
# }
# {
#         "_id" : ObjectId("624de10adfa76c8c1b1fdf36"),
#         "title" : "Post One",
#         "likes" : 10
# }
#
```

## `$elemMatch` operator

_tldr:_ `$elemMatch` finds a document by searching for the filter against each array element as specified in the search query.

```bash
# Reset our posts collection
db.posts.deleteMany({})

db.posts.insertMany([
	{
			"title" : "Post One",
			"likes" : 10,
			"comments" : [
					{
							"user" : "Mary Williams",
							"body" : "Comment One",
							"date" : "Thu Apr 07 2022 00:20:53 GMT+0530 (IST)"
					},
					{
							"user" : "Harry White",
							"body" : "Comment Two",
							"date" : "Thu Apr 07 2022 00:20:53 GMT+0530 (IST)"
					}
			]
	}
])


db.posts.find({ comments: 	{ $elemMatch: {user: 'Mary Williams'}}	}).pretty()
# Output:
# {
#         "_id" : ObjectId("624de303dfa76c8c1b1fdf38"),
#         "title" : "Post One",
#         "likes" : 10,
#         "comments" : [
#                 {
#                         "user" : "Mary Williams",
#                         "body" : "Comment One",
#                         "date" : "Thu Apr 07 2022 00:20:53 GMT+0530 (IST)"
#                 },
#                 {
#                         "user" : "Harry White",
#                         "body" : "Comment Two",
#                         "date" : "Thu Apr 07 2022 00:20:53 GMT+0530 (IST)"
#                 }
#         ]
# }
```

**_->>>> TODO: clean below notes_**

## `createIndex()` method

```bash
db.posts.createIndex({ title: 'text' })

db.posts.find(
{
	$text: {
		$search: "\"Post O\""
	}
}).pretty()

#Above serach will match two posts i.e, Post Two and Post Three.

db.posts.find(
{
	$text: {
		$search: "\"Post O\""
	}
}).pretty()

#Above search will match one posts i.e, Post One.
```

## `$set` operator

```bash
db.posts.find({title: 'Post Two'}).pretty()

db.posts.update({title: 'Post Two'}, {$set: { views: 10}})

db.posts.find({title: 'Post Two'}).pretty()
```

##

```bash
db.posts.find(
{
	views: {
		$gt: 8
	}
}).pretty()

#above will search for documents having their `views` property having value more than 8. This would return multiple documents if there are such matching documents.
```

## `$gte` operator

```bash
db.posts.find(
{
	views: {
		$gte: 8
	}
}).pretty()

#above will search for documents having their `views` property having value more than or EQUAL TO 9. This would return multiple documents if there are such matching documents.
```

Source of this video content: https://www.youtube.com/watch?v=-56x56UppqQ&t=867s

Amazing "Traversy Media - MongoDB Crash Course".

## inspiration 1 - [fullstackopen.com/en](fullstackopen.com/en)

```
db.posts.insert({
	title: 'Post Five',
	fruits: ["mango","apple","banana"]
})

db.posts.find({title: 'Post Five'}).pretty()

db.posts.find(
{
  fruits: {
    $in: ["mango"]
  }
}).pretty()

#So, thats how $in operator works.
```

## inspiration 2 - [fullstackopen.com/en](fullstackopen.com/en)

```
db.posts.insert({
	title: 'Post Five',
	fruits: ["mango","apple","banana"]
})

db.posts.insert({
	title: 'Post Six',
	fruits: ""
})


db.posts.find({title: 'Post Five'}).pretty()
db.posts.find({title: 'Post Six'}).pretty()







db.posts.find(
{
  fruits: {
    $exists: false
  }
}).pretty()

#above will return all documents that has does not has fruits property for it.







db.posts.find(
{
  fruits: {
    $exists: true
  }
}).pretty()

#above will return all documents that has fruits property for it
##Note this will also return document with title "Post Six" @line7 too, as it has fruits property too.
```

**Below code is generated automatically via autodocs.**

# Code from script files via autodocs

## File - `00.js`

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./00.js) -->
<!-- The below code snippet is automatically added from ./00.js -->
```js
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
```
<!-- MARKDOWN-AUTO-DOCS:END -->

## File - `01.js`

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./01.js) -->
<!-- The below code snippet is automatically added from ./01.js -->
```js
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
```
<!-- MARKDOWN-AUTO-DOCS:END -->

## File - `02-1.js`

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./02-1.js) -->
<!-- The below code snippet is automatically added from ./02-1.js -->
```js
// * We use `insertMany` to insert docs in this script.

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
```
<!-- MARKDOWN-AUTO-DOCS:END -->

## File - `02-2.js`

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./02-2.js) -->
<!-- The below code snippet is automatically added from ./02-2.js -->
```js
// * We use `find` and `explain` to get execution time (time took) in this script.

// @ts-nocheck
db = db.getSiblingDB('mydb');

let currentUserId = 100;

// Get matches
let query = db.datingLikes.find({ to: currentUserId });
let list = query.toArray().map(item => item.from);
let findQuery = db.datingLikes.find({ to: { "$in": list } });

// Users who likes currentUser and currentUser also likes them:
print('Matches:');
findQuery.forEach(printjson);

// Execution time:
// 	TODO: Official talk on .explain by mongodb itself: https://www.youtube.com/watch?v=UMzt4PbHtm8
// 	- Docs: https://www.mongodb.com/docs/manual/reference/explain-results/
// 	- https://www.youtube.com/watch?v=0WkJKa_Nv_o
// 	- https://www.youtube.com/watch?v=IZ1k1BB_BWo
// 	.explain() // gives us queryPlanner
// 	.explain("executionStats") // gives us queryPlanner as well as executionStats

// Get Time taken for the query
printjson('Time took: query (ms): ' + query.explain('executionStats').executionStats.executionTimeMillis);
printjson('Docs Examined: query: ' + query.explain('executionStats').executionStats.totalDocsExamined);
print();
printjson('Time took: findQuery (ms): ' + findQuery.explain('executionStats').executionStats.executionTimeMillis);
printjson('Docs Examined: findQuery: ' + findQuery.explain('executionStats').executionStats.totalDocsExamined);

// PRINT ALL LIKES DOCS
// db.datingLikes.find().forEach(printjson)
```
<!-- MARKDOWN-AUTO-DOCS:END -->

## File - `sh-1`

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./sh-1) -->
<!-- The below code snippet is automatically added from ./sh-1 -->
```
// @ts-nocheck
use mydb

// Drop a collection
db.posts.drop() // true

db.createCollection('posts')

// show collections
show collections

// Insert a single document
db.posts.insert({
	title: 'Post One',
	body: 'Body of post one',
	category: 'News',
	date: Date()
})

// Insert many posts
db.posts.insertMany([
{
	title: 'Post Two',
	body: 'Body of post two',
	category: 'Technology',
	date: Date()
},
{
	title: 'Post Three',
	body: 'Body of post three',
	category: 'News',
	date: Date()
}])

// Find all documents
db.posts.find().pretty()

// Drop a collection
// db.posts.drop() // true

// Drop a database
// db.dropDatabase() // { "ok" : 1 }
```
<!-- MARKDOWN-AUTO-DOCS:END -->

## File - `sh-2`

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./sh-2) -->
<!-- The below code snippet is automatically added from ./sh-2 -->
```
// @ts-nocheck
use mydb
db.persons.drop() // true
db.createCollection('persons')
// cls

// Learn: GeoJSON object: `{type: "Point", coordinates: [number, number]}`

let fromCoordinates
let turingLocation
let teslaLocation

const useMyLocation = true
if(useMyLocation) {
	fromCoordinates = [30.663794441117606, 76.84462298048282]
	turingLocation = [30.668482493441893, 76.84996594056327]
	teslaLocation = [30.679993722431135, 76.86150115968628]
} else {
	fromCoordinates = [-10.8, -10.8]
	turingLocation = [-10.5, -10.5];
	teslaLocation = [-10.6, -10.6]
}

db.persons.insertMany([
	{
		name: "Alan Turing",
		location: {
			type: "Point",
			coordinates: turingLocation
		}
	},
	{
		name: "Nikola Tesla",
		location: {
			type: "Point",
			coordinates: teslaLocation
		}
	}
])

// $geoNear requires to have a 2d or 2sdphere index (from mongo shell compiler)
db.persons.createIndex({location: '2dsphere'})

// Find all documents
// db.persons.find().pretty()

// cls
db.persons.aggregate([
	{
		$geoNear: {
			near: {
				type: "Point",
				coordinates: fromCoordinates // Distance wil be calculated from this point
			},
			maxDistance: 100000, // units is metres
			distanceField: 'distance' // output field which will show the distance measured
		}
	}
]).pretty()
```
<!-- MARKDOWN-AUTO-DOCS:END -->
