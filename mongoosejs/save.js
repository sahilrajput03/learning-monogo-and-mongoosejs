const {personModel, gadgetModel, log} = require("./utils/mongoclient.js");

const useAsyncFunc = true;
const disableUnitTest = 0; //Default is false.
// -------
if (disableUnitTest) {
  const iphone = new gadgetModel({
    deviceName: "Parmananda Goyal",
    deviceId: 3466,
  });
  const asyncFunc2 = async () => {
    let reply = await iphone.save();
    log("#get.js", {reply});
  };
  asyncFunc2();
}
// -------

const ManchandaGoyal = new personModel({
  name: "Manchanda Goyal",
  phoneNumber: 8360267243,
  address: "Boooo",
  gadgetlist: ["60096d427d8b711e40ecf6c6", "60096102b684d8259c8cd527", "60096d427d8b711e40ecf6c6"],
});
log("#debug manchandagoyal before saving:", Object.keys(ManchandaGoyal));
log("#debug manchandagoyal before saving <ManchandaGoyal._id>:", ManchandaGoyal._id); //Learning you get _id as soon as you execute `new personMode()`,yikes!!

const asyncFunc = async () => {
  let reply = await ManchandaGoyal.save();
  log("#save.js", {reply});
};

const syncFunc = () => {
  ManchandaGoyal.save(function (err, reply) {
    if (err) return console.error(err);
    log("#save.js", {reply});
  });
};

if (!disableUnitTest) {
  if (useAsyncFunc) {
    log("#Using async/await for fetching:");
    asyncFunc();
  } else {
    log("#Using callback for fetching:");
    syncFunc();
  }
}
