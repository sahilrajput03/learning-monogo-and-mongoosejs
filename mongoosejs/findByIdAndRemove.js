const {personModel} = require("./utils/mongoclient.js");
const log = require("./utils/log.js");

// NOTE: When a document is deleted from a collection, it gets logged as reply too. Yikes!

const useAsyncFunc = 1; // 0 = false, 1 = true

const message =
	"#Successfully deleted document of specific `_id` in the collection 'Person'...";

const _id = "600995b30b89cc33081d86cf";

const asyncFunc = async () => {
	try {
		let reply = await personModel.findByIdAndRemove(_id);
		if (reply) {
			log("#findByIdAndRemove.js", {reply});
			log(message);
		} else {
			log("#mylog:: Can't find any matching document to delete...");
		}
	} catch (err) {
		log("Error occured when trying to delete::", err);
	}
};

const syncFunc = () => {
	personModel.findByIdAndRemove(_id, (err, reply) => {
		if (err) {
			return console.log("#me error", err);
		}
		if (reply) {
			log("#findByIdAndRemove.js", {reply});
			log(message);
		} else {
			log("#mylog:: Can't find any matching document to delete...");
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
