const {
	connection: db,
	GADGET_COLLECTION_NAME,
	log,
	PERSON_COLLECTION_NAME,
} = require('./0.mongoclient')

const collection_name = PERSON_COLLECTION_NAME

db.once('open', function () {
	console.log(':INFO: db connected...')

	db.dropCollection(collection_name, function (err, reply) {
		if (err) {
			log('::Error: occured when trying to delete collection collection... ')
			if (err.codeName === 'NamespaceNotFound') {
				log(":INFO:Collection with such name doesn't exist...")
			} else {
				log(err)
			}
		}
		if (reply) {
			log('::Success: Collection deleted successfully...', {reply})
		}
	})
})

// Using mongo cli:
// use myDb
// db.myCollection.drop()
