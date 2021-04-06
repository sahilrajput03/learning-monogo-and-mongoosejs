const {personModel, GADGET_COLLECTION_NAME, log} = require("./utils/mongoclient.js");

const useAsyncFunc = 1; // 0 = false, 1 = true
const only_block_testing = 1; //Default is false.

const _id = "600970fecd6b8126eca4f42d";

// ----------
// only_block_testing
if (only_block_testing) {
  const _useAsyncFunc = 1; // 0 = false, 1 = true

  const asyncFuncPopulate = async () => {
    try {
      let reply = await personModel.findById(_id).populate("gadgetlist");
      log("#findById.js<Using async/await>", {reply});
      log("# populatedpart", reply.gadgetlist);
    } catch (err) {
      log("Can't findbyid::", err);
    }
  };

  const syncFuncPopulate = () => {
    // not tested yet!!
    personModel
      .findById(_id)
      .populate("gadgetlist")
      .exec(function (err, reply) {
        if (err) log("#shit error");
        console.log("syncFuncPopulate", {reply});
        console.log("syncFuncPopulate,populatedpart", reply && reply.gadgetlist);
        // prints "The author is Ian Fleming"
      });
  };

  if (_useAsyncFunc) {
    asyncFuncPopulate();
  } else {
    syncFuncPopulate();
  }
}
// ----------

const asyncFunc = async () => {
  try {
    let reply = await personModel.findById(_id);
    log("#findById.js", {reply});
  } catch (err) {
    log("Can't findbyid::", err);
  }
};

const syncFunc = () => {
  personModel.findById(_id, (err, reply) => {
    if (err) {
      console.log("#me error", err);
    } else {
      log({reply});
    }
  });
};

if (!only_block_testing) {
  if (useAsyncFunc) {
    log("#Using async/await for fetching:");
    asyncFunc();
  } else {
    log("#Using callback for fetching:");
    syncFunc();
  }
}
