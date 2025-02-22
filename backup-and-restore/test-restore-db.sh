# DB_NAME=qr-solution
DB_NAME=db1
# DB_NAME=db2

# & Help of `mongodump` CLI - file:///./help-mongorestore.txt
# & For dry run you can use below option:
# --dryRun

# * ✅  Restore all dbs from `dump`
# mongorestore

# * ✅  Restore all dbs from specified `dump` directory
# mongorestore dump2

# * ✅  Restore particular DB from specified `dump` directory
# mongorestore --db ${DB_NAME} dump/${DB_NAME}
# OUTPUT:
# OUTPUT:: TIME_HERE     The --db and --collection flags are deprecated for this use-case; please use --nsInclude instead, i.e. with --nsInclude=${DATABASE}.${COLLECTION}
# OUTPUT:: TIME_HERE     building a list of collections to restore from dump/db1 dir
# OUTPUT:: TIME_HERE     reading metadata for db1.posts from dump/db1/posts.metadata.json
# OUTPUT:: TIME_HERE     reading metadata for db1.users from dump/db1/users.metadata.json
# OUTPUT:: TIME_HERE     restoring db1.users from dump/db1/users.bson
# OUTPUT:: TIME_HERE     finished restoring db1.users (1 document, 0 failures)
# OUTPUT:: TIME_HERE     restoring db1.posts from dump/db1/posts.bson
# OUTPUT:: TIME_HERE     finished restoring db1.posts (1 document, 0 failures)
# OUTPUT:: TIME_HERE     no indexes to restore for collection db1.posts
# OUTPUT:: TIME_HERE     no indexes to restore for collection db1.users
# OUTPUT:: TIME_HERE     2 document(s) restored successfully. 0 document(s) failed to restore.

# * Note: If we try the above command again we get following logs:
# OUTPUT:: TIME_HERE     The --db and --collection flags are deprecated for this use-case; please use --nsInclude instead, i.e. with --nsInclude=${DATABASE}.${COLLECTION}
# OUTPUT:: TIME_HERE     building a list of collections to restore from dump/db1 dir
# OUTPUT:: TIME_HERE     reading metadata for db1.posts from dump/db1/posts.metadata.json
# OUTPUT:: TIME_HERE     reading metadata for db1.users from dump/db1/users.metadata.json
# OUTPUT:: TIME_HERE     restoring to existing collection db1.posts without dropping
# OUTPUT:: TIME_HERE     restoring to existing collection db1.users without dropping
# OUTPUT:: TIME_HERE     restoring db1.posts from dump/db1/posts.bson
# OUTPUT:: TIME_HERE     restoring db1.users from dump/db1/users.bson
# OUTPUT:: TIME_HERE     continuing through error: E11000 duplicate key error collection: db1.users index: _id_ dup key: { _id: ObjectId('67b9e4c4bf8a035ed99036dc') }
# OUTPUT:: TIME_HERE     continuing through error: E11000 duplicate key error collection: db1.posts index: _id_ dup key: { _id: ObjectId('67b9e4c4bf8a035ed99036db') }
# OUTPUT:: TIME_HERE     finished restoring db1.users (0 documents, 1 failure)
# OUTPUT:: TIME_HERE     finished restoring db1.posts (0 documents, 1 failure)
# OUTPUT:: TIME_HERE     no indexes to restore for collection db1.posts
# OUTPUT:: TIME_HERE     no indexes to restore for collection db1.users
# OUTPUT:: TIME_HERE     0 document(s) restored successfully. 2 document(s) failed to restore.


# * ✅ Import particular collection to your collection of same name [TESTED] from default `dump` directory
# (Note 1: If a collection with same name already exists along with some docs then the old docs having same `_id` will not be modified and other documens having different `_id` will not deleted 🙂.
# (Note 2: If a collection with same name already exists along with some docs then the old docs will not be deleted).
# mongorestore --nsInclude $DB_NAME.posts

# * ✅ Importing a particular collection from specified `dump` directory [TESTED]
# mongorestore --nsInclude $DB_NAME.posts dump2

# * ✅ Importing to a different collection from a specified collection bson file (from a `dump` directory) [TESTED]
# mongorestore --nsInclude $DB_NAME.posts2 dump/$DB_NAME/posts.bson

# * ✅🔔 Import particular db from specified db directory (from a dump directory)
# mongorestore --db $DB_NAME dump/$DB_NAME
# OUTPUT: `The --db and --collection flags are deprecated for this use-case; please use --nsInclude instead, i.e. with --nsInclude=${DATABASE}.${COLLECTION}``

# * ✅🔔  Import particular collection to your collection of same name from specified `dump` directory [TESTED] - [USING `--db` and `--collection`]
# mongorestore --db $DB_NAME --collection posts2 dump2/$DB_NAME/posts.bson
# OUTPUT: `The --db and --collection flags are deprecated for this use-case; please use --nsInclude instead, i.e. with --nsInclude=${DATABASE}.${COLLECTION}``


FILENAME=dump.archive
# * ✅ Restore all dbs from a archive file # ! Be caureful: This command overwrites previous `dump.archive`
# mongorestore --archive=${FILENAME}

# * ✅ Import specified collection (`db1.posts`) from archive file to `db2.cars`
SOURCE_COLLECTION=$DB_NAME.posts
# mongorestore --archive=${FILENAME} --nsInclude=$SOURCE_COLLECTION --nsFrom=$SOURCE_COLLECTION --nsTo=db2.cars

# * ✅ Import a collection from archive file (when db name and collection are same in archive file and mongodb server)
# mongorestore --archive=${FILENAME} --nsInclude $DB_NAME.posts


# !NOTE: DO NOT USE BELOW COMMAND because it imports all dbs instead of specified db via `--nsFrom` and `--nsTo`
# mongorestore --archive=${FILENAME} --nsFrom="$DB_NAME.*" --nsTo="$DB_NAME.*"
# !NOTE: DO NOT USE BELOW COMMAND because it imports all dbs instead of specified db via `--nsFrom` and `--nsTo`
# mongorestore --archive=${FILENAME} --nsFrom=$DB_NAME --nsTo=$DB_NAME
# !NOTE: DO NOT USE BELOW COMMAND because it imports all dbs instead of specified collection (`$DB_NAME.posts`)
# mongorestore --archive=${FILENAME} --nsFrom=$DB_NAME.posts --nsTo=$DB_NAME.posts

# & 😍 View all dbs and their collections of dump archive file
# mongorestore --archive=dump.archive --dryRun --verbose
# * From below output we can see this archive file has two dbs --- db1 (posts, users) and db2 (cars).
# OUTPUT: TIME_HERE     using write concern: &{majority false 0}
# OUTPUT: TIME_HERE     archive prelude db1.posts
# OUTPUT: TIME_HERE     archive prelude db1.users
# OUTPUT: TIME_HERE     archive prelude db2.cars
# OUTPUT: TIME_HERE     archive prelude admin.system.version
# OUTPUT: TIME_HERE     preparing collections to restore from
# OUTPUT: TIME_HERE     found collection db1.posts bson to restore to db1.posts
# OUTPUT: TIME_HERE     found collection metadata from db1.posts to restore to db1.posts
# OUTPUT: TIME_HERE     found collection db1.users bson to restore to db1.users
# OUTPUT: TIME_HERE     found collection metadata from db1.users to restore to db1.users
# OUTPUT: TIME_HERE     found collection db2.cars bson to restore to db2.cars
# OUTPUT: TIME_HERE     found collection metadata from db2.cars to restore to db2.cars
# OUTPUT: TIME_HERE     found collection admin.system.version bson to restore to admin.system.version
# OUTPUT: TIME_HERE     found collection metadata from admin.system.version to restore to admin.system.version
# OUTPUT: TIME_HERE     dry run completed
# OUTPUT: TIME_HERE     0 document(s) restored successfully. 0 document(s) failed to restore.


# TODO -  Try below commands ---------------------------------------------------------------------------

# TODO: Restore db from archieve file to a remote mongodb server at atlas
# mongorestore --host myremotehost --port 27017 --archive=dump.archive
# TODO: Restore db from dump folder to a remote mongodb server at atlas
# mongorestore --host myremotehost --port 27017 --db db1 dump/db1
# TODO: Restore all dbs from a compressed archive - If your archive was compressed (e.g., with gzip), decompress it while restoring:
# gunzip -c mybackup.gz | mongorestore --archive
