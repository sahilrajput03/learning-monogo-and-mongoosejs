# Readme

**Some used mongodb operators**

- [\$in operator, used in part 8 , ch-d](https://docs.mongodb.com/manual/reference/operator/query/in/)
- [\$exists operator, used in part 8 , ch-d](https://docs.mongodb.com/manual/reference/operator/query/exists/).

**Other Sources**

- Traversy Media: [@gist](https://gist.github.com/bradtraversy/f407d642bdc3b31681bc7e56d95485b6), Video [@youtube](https://www.youtube.com/watch?v=-56x56UppqQ&t=867s).
- Tutorials Point: [Tutorials point - Mongodb](https://www.tutorialspoint.com/mongodb/index.htm).

**Note** (*for Windows User*) : `git-bash` isn't performing good with mongo shell environment, so prefer cmd for now.

```bash
# To open a mongo shell environment.
mongo
# TIP: To clear logs in `mongo` shell, use ctrl+L hotkey or use command -> cls


#close mongo shell
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
db.mycollection.drop() # Drop collection.


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

# IMPORTANT:
# previous document's data will be OVERWRITTEN.
# The second object is **OPTIONAL**. The second options object in current example tells that if the record doesn't exist then, create it. (upsert name comes from like UPdate OR insERT )
##Watch for next example for CLARIFICATION.

# ___ Debugging commands

# Get all posts
db.posts.find()
```

## Case 2 - `update()` method

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

#Note this will not create a new document if title with text 'Post Two' doesn't exists.
```


## Case 3 - `update()` method

```bash
db.posts.find({title: 'Post Two'}).pretty()

db.posts.update(
{ title: 'Post Two' },
{
	$set:{
	body: 'Body of post 2',
	category: 'Techonology',
	}
}
)

db.posts.find({title: 'Post Two'}).pretty()


#(Literally adding content to document)Update a document keeping earlier content like they were.
```

## Case 4 - `update()` method

```bash
db.posts.find({title: 'Post One'}).pretty()

db.posts.update(
{title: 'Post One'},
{
	$inc: { likes: 2}
})

db.posts.find({title: 'Post One'}).pretty()
```

## Case 5 - `update()` method

```bash
db.posts.find({title: 'Post One'}).pretty()

db.posts.update(
{title: 'Post One'},
{
	$rename: { likes: 'views'}
})

db.posts.find({title: 'Post One'}).pretty()
```

## `remove()` method

```bash
db.posts.remove({title: 'Post Four'})
# todo: move this into top basic command for easy inclusiveness to mind
```

## `$set` operator ( subdocuments )

```bash
db.posts.find({title: 'Post One'}).pretty()

db.posts.update(
{
	title: 'Post One'
},
{
	$set: {
	comments: [
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
})

db.posts.find({title: 'Post One'}).pretty()
```

## `$elemMatch` operator

```bash
db.posts.find(
{
	comments: {
	$elemMatch:{
		user: 'Mary Williams'
		}
	}
})
```

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