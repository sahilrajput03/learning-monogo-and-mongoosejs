#### Some used mongodb operators

[\$in operator, used in part 8 , ch-d](https://docs.mongodb.com/manual/reference/operator/query/in/)

[\$exists operator, used in part 8 , ch-d](https://docs.mongodb.com/manual/reference/operator/query/exists/).

Source: https://gist.github.com/bradtraversy/f407d642bdc3b31681bc7e56d95485b6

Traversy Media video [@youtube](https://www.youtube.com/watch?v=-56x56UppqQ&t=867s).

```bash
# Connect to mongo-cli
$ mongo

# Show currectly selected db:
$ db # Show currect db name.

# Show all dbs:
$ show dbs # Show all dbs.

# Dropping a collection:
$ use myDb # Select a database
$ db.mycollection.drop() # Drop collection.

# Dropping a db:
$ use myDb # Select a database
$ db.dropDatabase() # Drop selected database.

```

Source: [Tutorials point - Mongodb](https://www.tutorialspoint.com/mongodb/index.htm).
