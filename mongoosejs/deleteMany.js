const mongoose = require("mongoose");
const {personModel} = require("./utils/mongoclient.js");
const log = require("./utils/log.js");

const useAsyncFunc = 0; // 0 = false, 1 = true

const message = "Deleted all the documents in the collection 'Person'";

const asyncFunc = async () => {
	let reply = await personModel.deleteMany({});
	log("#get.js", {reply});
	log(message);
};

const syncFunc = () => {
	personModel.deleteMany({}, (err, reply) => {
		if (err) {
			console.log("#me error", err);
		} else {
			log(reply);
			log(message);
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
