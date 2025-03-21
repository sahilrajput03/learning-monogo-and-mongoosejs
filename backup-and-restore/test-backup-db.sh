
MONGO_HOST=localhost
MONGO_PORT=27017
# DB_NAME=qr-solution
DB_NAME=db1
# DB_NAME=db2
AUTH_PARAM="--username my_user --password" # (only needed if authentication is enabled)
DB_BACKUP_PATH=my_database_backup
FILENAME=dump.archive

SCRIPT_DIR="$(dirname -- "${BASH_SOURCE[0]}")"
source "$SCRIPT_DIR/.env"


# & Help of `mongodump` CLI - file:///./help-mongodump.txt
# & Note: There is no dry run feature in mongodump cli.

# ! ⛔️⛔️⛔️ BE very very careful to use below command as you can accidentally delete some backup too while testing so be extra careful!
# ! ⛔️⛔️⛔️ BE very very careful to use below command as you can accidentally delete some backup too while testing so be extra careful!
# ! ⛔️⛔️⛔️ BE very very careful to use below command as you can accidentally delete some backup too while testing so be extra careful!
rm -rf dump
# ! Note when you backup to `dump` directory via `mongodump` file -- it is not delete old files though it overwrites existing files so use `rm -rf dump` to start fresh each time.

# See this help in `mongodump-help.txt` file
# mongodump --help

# ✅ Backup all dbs in local mongodb server to a new `dump` directory
# mongodump
# Prining files of `dump` directory using `tree`
# tree dump
# dump
# ├── admin
# │   ├── system.version.bson
# │   └── system.version.metadata.json
# ├── db1
# │   ├── posts.bson
# │   ├── posts.metadata.json
# │   ├── users.bson
# │   └── users.metadata.json
# └── db2
#     ├── cars.bson
#     └── cars.metadata.json
#
# 4 directories, 8 files

# ✅ Backup specified db in local mongodb server to `dump` directory
# mongodump --db $DB_NAME
# ✅ Backup specified db in local mongodb server
# mongodump --db $DB_NAME --archive=$FILENAME

# Backup all dbs in local mongodb server to directory specified by `--out` option
# mongodump --out my-db-dump

# Backup specified db in local mongodb server to directory specified by `--out` option
# mongodump --db $DB_NAME --out my-db-dump

# mongodump --db $DB_NAME --gzip
# Prining files of `dump` directory using `tree`
# tree dump
# dump
# └── qr-solution
#     ├── googleusers.bson.gz
#     ├── googleusers.metadata.json.gz
#     ├── users.bson.gz
#     └── users.metadata.json.gz
#
# 2 directories, 4 files

# * ✅ Backup all dbs from local mongodb server to archive file
# mongodump --archive=$FILENAME

# & ---------- mongodb atlas --------------
# src: https://stackoverflow.com/a/79313414/10012446

# ✅ BACKUP all dbs to dump directory
# mongodump --uri="$p0c0URI"

# ✅ BACKUP specified db to dump directory
# mongodump --uri="$p0c0URI" --db $DB_NAME

# ✅ RESTORE all dbs from dump directory
# mongorestore --uri="$p0c0URI"

# ✅ RESTORE specified db from dump directory
# mongorestore --uri="$p0c0URI" --db $DB_NAME dump/$DB_NAME

# TODO: TRY BACKING (+RESTORE) UP specified COLLECTION from atlas

# & ---------- mongodb atlas --- ends here --------------


# TODO: Try to backup mongodb atlas dbs and collections:
# mongodump --host ${MONGO_HOST} --port ${MONGO_PORT} --db ${DB_NAME} --out ${DB_BACKUP_PATH}
# mongodump --host ${MONGO_HOST} --port ${MONGO_PORT} --db ${DB_NAME} ${AUTH_PARAM} --out ${DB_BACKUP_PATH}

# TODO: Check the mongodump command from blulabs folder too.

# TODO: cronjob setup - https://lizenshakya.medium.com/backup-your-database-using-cron-26e0fe40e41b
# TODO: cronjob setup (stackoverflow) - https://stackoverflow.com/questions/37245540/how-can-i-backup-mongodb-database-regularly-the-specific-time-of-a-day
# TODO: Add db to db transfer list transfer for collection/db/dbs/all_dbs for e.g. atlas to local db server or vice versa.
# TODO: check if your can export to a zip file?