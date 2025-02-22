mongosh <<EOF
use db1
db.dropDatabase()

use db2
db.dropDatabase()

use db3
db.dropDatabase()
EOF