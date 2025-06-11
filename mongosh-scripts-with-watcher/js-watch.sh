#!/usr/bin/env bash

# Learn: As of MongoDB 5.0+, `mongo` shell is deprecated. You probably
# 		have mongosh instead.

if [ $# -eq 0 ]; then
	echo "Please give the file as argument."
else
	nodemon -e js -x "mongosh --quiet localhost:27017/mydb $@"
	# nodemon -e js -x "mongo localhost:27017/mydb $@"
fi
