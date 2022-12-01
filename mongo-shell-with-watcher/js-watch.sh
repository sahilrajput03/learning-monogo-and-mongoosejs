#!/usr/bin/env bash
if [ $# -eq 0 ]
then echo "Please give the file as argument."
else
	nodemon -e js -x "mongo --quiet localhost:27017/mydb $@"
	# nodemon -e js -x "mongo localhost:27017/mydb $@"
fi
