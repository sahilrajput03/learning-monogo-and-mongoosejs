const {gadgetModel, log} = require("./utils/mongoclient.js");

const iphone = new gadgetModel({
  deviceName: "Parmananda Goyal",
  deviceId: 3466,
});

const asyncFunc = async () => {
  let reply = await iphone.save();
  log("#save.js", {reply});
};

asyncFunc();
