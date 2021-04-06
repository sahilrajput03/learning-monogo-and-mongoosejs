const mongoose = require("mongoose");
const {personModel} = require("./utils/mongoclient.js");
const log = require("./utils/log.js");

const useAsyncFunc = 1; // 0 = false, 1 = true

const asyncFunc = async () => {
	let reply = await personModel.find({});
	log("#get.js", {reply});
};

const syncFunc = () => {
	personModel.find({}, function (err, reply) {
		if (err) return console.error(err);
		log("#get.js", {reply});
	});
};

if (useAsyncFunc) {
	log("#Using async/await for fetching:");
	asyncFunc();
} else {
	log("#Using callback for fetching:");
	syncFunc();
}
