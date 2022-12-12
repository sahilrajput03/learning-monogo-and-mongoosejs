// @ts-nocheck
db = db.getSiblingDB('mydb')

let currentUserId = 100

// Get matches
let query1 = db.datingLikes.find({ to: currentUserId })
let list = query1.toArray().map(item => item.from)
let matches_query2 = db.datingLikes.find({ to: { "$in": list}})

print('Matches:') // Users who likes currentUser and currentUser also likes them:
matches_query2.forEach(printjson);

// let matches = db.datingLikes.aggregate([{$match: { to: currentUserId }}, {match: {from : {"$in": }}}]) // TODO Optimize: try2
// let matches = db.datingLikes.aggregate([{$match: { $or: filterLikedCurrentUser }}, ??query?? ]) // TODO optimizing for later

// Get Time taken for the query
printjson('Time took: query1 (ms): ' + query1.explain('executionStats').executionStats.executionTimeMillis)
printjson('Time took: query2 (ms): ' + matches_query2.explain('executionStats').executionStats.executionTimeMillis)
printjson('Docs Examined: query1: ' + query1.explain('executionStats').executionStats.totalDocsExamined)
printjson('Docs Examined: query2: ' + matches_query2.explain('executionStats').executionStats.totalDocsExamined)

// PRINT ALL LIKES DOCS
// db.datingLikes.find().forEach(printjson)