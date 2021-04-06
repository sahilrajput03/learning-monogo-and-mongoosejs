const {personModel, log} = require("./utils/mongoclient.js");

const useAsyncFunc = 1; // 0 = false, 1 = true

const _id = "60094ced00521c27e468c66f";

const documentFilter = {info: "old Bigyan"};
// When documentFilter is applied in db to match any document, keys-value pairs are case-sensitive.
const asyncFunc = async () => {
  try {
    let reply = await personModel.findOne(documentFilter);
    log("#findOne.js", {reply});
  } catch (err) {
    log("Can't delete::", err);
  }
};

const syncFunc = () => {
  // not tested yet!!
  personModel.findOne(documentFilter, (err, reply) => {
    if (err) {
      console.log("#me error", err);
    } else {
      log(reply);
    }
  });
};

if (useAsyncFunc) {
  log("#Using async/await for fetching:");
  asyncFunc();
} else {
  log("#Using callback for fetching:");
  syncFunc();
}
