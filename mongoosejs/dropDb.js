const {connection: db, log} = require("./utils/mongoclient.js");

db.once("open", function () {
  console.log(":INFO: Connected to db ...");
  db.dropDatabase((err, reply) => {
    if (err) {
      log("#Got error when trying to delete db", {err});
    }
    if (reply) {
      log("#Successfully deleted db:", {reply});
    }
  });
});

// Using mongo cli:
// use myDb
// db.dropDatabase()
