# DB_NAME=qr-solution
DB_NAME=db1
# DB_NAME=db2

# * ✅  Restore all dbs from `dump`
# mongorestore

# * ✅  Restore all dbs from specified `dump` directory
# mongorestore dump2

# * ✅  Restore particular DB from specified `dump` directory
mongorestore --db ${DB_NAME} dump/${DB_NAME}
# OUTPUT:
# OUTPUT: The --db and --collection flags are deprecated for this use-case; please use --nsInclude instead, i.e. with --nsInclude=${DATABASE}.${COLLECTION}
# OUTPUT: building a list of collections to restore from dump/db1 dir
# OUTPUT: reading metadata for db1.posts from dump/db1/posts.metadata.json
# OUTPUT: reading metadata for db1.users from dump/db1/users.metadata.json
# OUTPUT: restoring db1.users from dump/db1/users.bson
# OUTPUT: finished restoring db1.users (1 document, 0 failures)
# OUTPUT: restoring db1.posts from dump/db1/posts.bson
# OUTPUT: finished restoring db1.posts (1 document, 0 failures)
# OUTPUT: no indexes to restore for collection db1.posts
# OUTPUT: no indexes to restore for collection db1.users
# OUTPUT: 2 document(s) restored successfully. 0 document(s) failed to restore.

# * Note: If we try the above command again we get following logs:
# OUTPUT: The --db and --collection flags are deprecated for this use-case; please use --nsInclude instead, i.e. with --nsInclude=${DATABASE}.${COLLECTION}
# OUTPUT: building a list of collections to restore from dump/db1 dir
# OUTPUT: reading metadata for db1.posts from dump/db1/posts.metadata.json
# OUTPUT: reading metadata for db1.users from dump/db1/users.metadata.json
# OUTPUT: restoring to existing collection db1.posts without dropping
# OUTPUT: restoring to existing collection db1.users without dropping
# OUTPUT: restoring db1.posts from dump/db1/posts.bson
# OUTPUT: restoring db1.users from dump/db1/users.bson
# OUTPUT: continuing through error: E11000 duplicate key error collection: db1.users index: _id_ dup key: { _id: ObjectId('67b9e4c4bf8a035ed99036dc') }
# OUTPUT: continuing through error: E11000 duplicate key error collection: db1.posts index: _id_ dup key: { _id: ObjectId('67b9e4c4bf8a035ed99036db') }
# OUTPUT: finished restoring db1.users (0 documents, 1 failure)
# OUTPUT: finished restoring db1.posts (0 documents, 1 failure)
# OUTPUT: no indexes to restore for collection db1.posts
# OUTPUT: no indexes to restore for collection db1.users
# OUTPUT: 0 document(s) restored successfully. 2 document(s) failed to restore.


FILENAME=dump.archive
# Restore all dbs from a archive file # ! Be caureful: This command overwrites previous `dump.archive`
# mongorestore --archive=${FILENAME}

# * ✅ Import particular collection to your collection of same name [TESTED] from default `dump` directory
# (Note 1: If a collection with same name already exists along with some docs then the old docs having same `_id` will not be modified and other documens having different `_id` will not deleted 🙂.
# (Note 2: If a collection with same name already exists along with some docs then the old docs will not be deleted).
# mongorestore --nsInclude $DB_NAME.posts

# * ✅ Importing a particular collection from specified `dump` directory [TESTED]
# mongorestore --nsInclude $DB_NAME.posts dump

# * ✅ Import particular collection items to your collection of same name [TESTED] from default `dump` directory - (USING `--db` and `--collection`)
# mongorestore --db $DB_NAME --collection posts2 dump2/$DB_NAME/posts.bson
# OUTPUT: `The --db and --collection flags are deprecated for this use-case; please use --nsInclude instead, i.e. with --nsInclude=${DATABASE}.${COLLECTION}``

# !NOTE: DO NOT USE BELOW COMAND because it has no effect, nothing is imported!
# mongorestore --db ${DB_NAME}
# OUTPUT: The --db and --collection flags are deprecated for this use-case; please use --nsInclude instead, i.e. with --nsInclude=${DATABASE}.${COLLECTION}
# OUTPUT: don't know what to do with subdirectory "dump/admin", skipping...
# OUTPUT: don't know what to do with subdirectory "dump/db1", skipping...
# OUTPUT: don't know what to do with subdirectory "dump/db2", skipping...

# !NOTE: DO NOT USE BELOW COMAND because it fails totally
# mongorestore --db $DB_NAME --collection posts2
# OUTPUT: Failed: error scanning filesystem: file dump is a directory, not a bson file

# !NOTE: DO NOT USE BELOW COMAND because it fails totally
# mongorestore --db $DB_NAME --collection posts2 --nsInclude $DB_NAME.posts dump
# OUTPUT: Failed: error scanning filesystem: file dump2 is a directory, not a bson file

# !NOTE: DO NOT USE BELOW COMMAND because it imports all dbs instead of specified db via `--nsFrom` and `--nsTo`
# mongorestore --archive=${FILENAME} --nsFrom="$DB_NAME.*" --nsTo="$DB_NAME.*"
# !NOTE: DO NOT USE BELOW COMMAND because it imports all dbs (+collections) instead of specified db via `--nsFrom` and `--nsTo`
# mongorestore --archive=${FILENAME} --nsFrom="db2" --nsTo="db2"
# !NOTE: DO NOT USE BELOW COMMAND because it imports all dbs (+collections) instead of specified collection via `--nsFrom` and `--nsTo`
# mongorestore --nsTo=$DB_NAME.posts2 --nsFrom=$DB_NAME.posts
# !NOTE: DO NOT USE BELOW COMMAND because it imports all collection instead of specified collection (`users`)
# mongorestore --archive=${FILENAME} --nsFrom="$DB_NAME.users" --nsTo="$DB_NAME.users"
# !NOTE: DO NOT USE BELOW COMMAND because didn't import anything at all.
# mongorestore --archive=${FILENAME} --nsInclude $DB_NAME.users

# TODO: Learn how to convert archive to dump directory



# TODO:
# mongorestore --host localhost --port 27017 --db my_database /backup/my_database_backup/my_database