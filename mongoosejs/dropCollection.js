// const {connection: db} = require("mongoose");
const {connection: db, log} = require("./utils/mongoclient.js");

const COLLECTION_NAME = "gadgets";

db.once("open", function () {
  console.log(":INFO: db connected...");

  db.dropCollection(COLLECTION_NAME, function (err, reply) {
    if (err) {
      log("#Error: occured when trying to delete collection collection... ");
      if (err.codeName === "NamespaceNotFound") {
        log(":INFO:Collection with such name doesn't exist...");
      } else {
        log(err);
      }
    }
    if (reply) {
      log("#Success: Collection deleted successfully...", {reply});
    }
  });
});

// Using mongo cli:
// use myDb
// db.myCollection.drop()
