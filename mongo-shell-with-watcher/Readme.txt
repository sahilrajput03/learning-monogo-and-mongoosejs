# Usage

# Watching a mongo shell script with mongo shell
./watch.sh 1

# Watching javascript file with mongo shell
./js-watch.sh ./01.js

db.posts.drop() // true (Deleting a existing collection)
db.posts.drop() // false (Deleting a non-existing collection)
