mongosh <<EOF
use db1
db.posts.insert({ title: 'Post 1' })
db.users.insert({ name: 'User 1' })

use db2
db.cars.insert({ model: 'Car 1' })
EOF