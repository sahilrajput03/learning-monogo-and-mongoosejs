

# ✅ Run commadns in mongoosh.
# Note: A `_id` is automatically generated and added to the below document.
mongosh <<EOF
use mydb;
db.cars.insertOne({name: 'Bob', age: 25});
show collections;
EOF

# ! Does NOT work  (only the first command is executing)
# mongosh --eval "use db2;
# db.cars.insertOne({name: 'Alice', age: 25});
# show collections;"

# ! Does NOT work  (only the first command is executing)
# mongosh --eval "use db2; db.cars.insertOne({name: 'Alice', age: 25});"

# use myDb # Select a database
# db.dropDatabase() # Drop selected database.
