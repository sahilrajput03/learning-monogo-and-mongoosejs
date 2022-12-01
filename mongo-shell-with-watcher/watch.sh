#!/usr/bin/env bash
if [ $# -eq 0 ]
then echo "Please give the file as argument."
else
	nodemon -w "$@" -x "mongo --quiet localhost:27017/mydb < $@"
	# nodemon -w "$@" -x "mongo localhost:27017/mydb < $@"
fi
