# Usage

```bash
# Watching a mongo shell script with mongo shell
./watch.sh 1

# Watching javascript file with mongo shell
./js-watch.sh ./01.js
```

_Helpful command in mongo shell script:_

```bash
# Deleting a existing collection
db.posts.drop() # true

# Deleting a non-existing collection
db.posts.drop() # false
```
