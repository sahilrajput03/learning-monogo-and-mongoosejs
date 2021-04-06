const mongoose = require("mongoose");
const {personModel} = require("./utils/mongoclient.js");
const log = require("./utils/log.js");

const useAsyncFunc = 0; // 0 = false, 1 = true

const message = "Deleted document of specific `_id` in the collection 'Person'";

const _id = "6009458543b91b1060e7adca";

const asyncFunc = async () => {
	try {
		let reply = await personModel.deleteOne({_id});
		log("#get.js", {reply});
		log(message);
	} catch (err) {
		log("Can't delete::", err);
	}
};

const syncFunc = () => {
	// not tested yet!!
	personModel.deleteOne({_id}, (err, reply) => {
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
