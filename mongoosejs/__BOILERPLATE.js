const mongoose = require("mongoose");
const {personModel} = require("./utils/mongoclient.js");
const log = require("./log.js");

const useAsyncFunc = 0; // 0 = false, 1 = true

const message = "your_message";

const asyncFunc = async () => {
	let reply = await personModel.what();
	log("#get.js", {reply});
	log(message);
};

const syncFunc = () => {
	personModel.what({}, (err, reply) => {
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

setTimeout(() => {
	mongoose.connection.close();
}, 2000);
