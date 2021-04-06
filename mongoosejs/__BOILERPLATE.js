const {personModel, log} = require("./utils/mongoclient.js");

const useAsyncFunc = 0; // 0 = false, 1 = true

const asyncFunc = async () => {
  log("#Using async/await for fetching:");

  try {
    let reply = await personModel.what();
    log("#__boilerplate.js", {reply});
  } catch (err) {
    log("Can't delete::", err);
  }
};

const syncFunc = () => {
  log("#Using callback for fetching:");

  personModel.what({}, (err, reply) => {
    if (err) {
      console.log("#__boilerplate.js:: error:", err);
    } else {
      log(reply);
    }
  });
};

useAsyncFunc ? asyncFunc() : syncFunc();
