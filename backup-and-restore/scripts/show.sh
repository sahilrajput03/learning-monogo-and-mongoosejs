# Using --quiet helps to not show unnecessary information
mongosh --quiet <<EOF
use db1
db.posts.find()
db.users.find()

use db2
db.cars.find()

// commment (printed as empty line)
EOF
