#!/usr/bin/env bash

# Learn: As of MongoDB 5.0+, `mongo` shell is deprecated. You probably
# 		have mongosh instead.

# Usage: `watch.sh sh-1`

if [ $# -eq 0 ]; then
	echo "Please give the file as argument."
else
	nodemon -w "$@" -x "mongosh --quiet localhost:27017/mydb < $@"
	# nodemon -w "$@" -x "mongo localhost:27017/mydb < $@"
fi
