# & Help of `mongodump` CLI - file:///./help-mongodump.txt
# Using --quiet helps to not show unnecessary information

script='
// DROP ALL DBS
use db1
db.dropDatabase()
use db2
db.dropDatabase()
use db3
db.dropDatabase()

// CREATE db1 AND INSERT TWO DOCS
use db1
db.posts.insert({ title: "Post 1" })
db.posts.insert({ title: "Post 2" })
'
# Run above script
# echo "$script" | mongosh --quiet > /dev/null 2>&1

# Verbose 1
# echo "$script" | mongosh --quiet

# Verbose 2
# echo "$script" | mongosh


# & Print documents of a bson file
echo -e "\n\nDocuments of ./dump/db1/posts.bson file"
echo "======================================="
bsondump dump/db1/posts.bson
# bsondump dump/db1/posts.bson | jq
echo -e "\n"
# OUTPUT
# {"_id":{"$oid":"67ba460b79a31a2076e33e16"},"title":"Post 1"}
# 2025-02-23T16:45:31.004+0530	1 objects found





















































############################ old code ##############################
# * The issues with EOF usage to pass query is that I am not able to supress STDOUT/STDERR when I try to redirect STDOUT and STDERR to /dev/null to hide the mongosh command's logs.
# mongosh --quiet <<EOF
# // DROP ALL DBS
# use db1
# db.dropDatabase()
# use db2
# db.dropDatabase()
# use db3
# db.dropDatabase()

# // CREATE db1 AND INSERT TWO DOCS
# use db1
# db.posts.insert({ title: 'Post 1' })
# db.posts.insert({ title: 'Post 2' })
# EOF > /dev/null
# Note: I'm redirecting output of `mongosh` command /dev/null via `> /dev/null 2>&1`