// @ts-nocheck
db = db.getSiblingDB('mydb');

let currentUserId = 100;

// Get matches
let query = db.datingLikes.find({ to: currentUserId });
let list = query.toArray().map(item => item.from);
let findQuery = db.datingLikes.find({ to: { "$in": list } });

print('Matches:'); // Users who likes currentUser and currentUser also likes them:
findQuery.forEach(printjson);

// Get Time taken for the query
printjson('Time took: query (ms): ' + query.explain('executionStats').executionStats.executionTimeMillis);
printjson('Docs Examined: query: ' + query.explain('executionStats').executionStats.totalDocsExamined);
print();
printjson('Time took: findQuery (ms): ' + findQuery.explain('executionStats').executionStats.executionTimeMillis);
printjson('Docs Examined: findQuery: ' + findQuery.explain('executionStats').executionStats.totalDocsExamined);

// PRINT ALL LIKES DOCS
// db.datingLikes.find().forEach(printjson)
