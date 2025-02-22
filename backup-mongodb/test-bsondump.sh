mongosh <<EOF
// DROP ALL DBS
use db1
db.dropDatabase()
use db2
db.dropDatabase()
use db3
db.dropDatabase()

// CREATE db1 AND INSERT TWO DOCS
use db1
db.posts.insert({ title: 'Post 1' })
db.posts.insert({ title: 'Post 2' })
EOF

# & Print documents of a bson file
echo -e "\n\nDocuments of ./dump/db1/posts.bson file"
bsondump dump/db1/posts.bson 
# OUTPUT
# {"_id":{"$oid":"67ba338fd767d6638481e36d"},"title":"Post 1"}
# {"_id":{"$oid":"67ba338fd767d6638481e36e"},"title":"Post 2"}
# 2025-02-23T01:59:30.087+0530    2 objects found

