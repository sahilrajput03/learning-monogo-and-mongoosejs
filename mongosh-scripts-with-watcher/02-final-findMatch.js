// @ts-nocheck
db = db.getSiblingDB('mydb');

let currentUserId = 100;

// Get matches
let query = db.datingLikes.find({ to: currentUserId });
let list = query.toArray().map(item => item.from);
let findQuery = db.datingLikes.find({ to: { "$in": list } });

// Users who likes currentUser and currentUser also likes them:
print('Matches:');
findQuery.forEach(printjson);

// Execution time:
// 	TODO: Official talk on .explain by mongodb itself: https://www.youtube.com/watch?v=UMzt4PbHtm8
// 	- Docs: https://www.mongodb.com/docs/manual/reference/explain-results/
// 	- https://www.youtube.com/watch?v=0WkJKa_Nv_o
// 	- https://www.youtube.com/watch?v=IZ1k1BB_BWo
// 	.explain() // gives us queryPlanner
// 	.explain("executionStats") // gives us queryPlanner as well as executionStats

// Get Time taken for the query
printjson('Time took: query (ms): ' + query.explain('executionStats').executionStats.executionTimeMillis);
printjson('Docs Examined: query: ' + query.explain('executionStats').executionStats.totalDocsExamined);
print();
printjson('Time took: findQuery (ms): ' + findQuery.explain('executionStats').executionStats.executionTimeMillis);
printjson('Docs Examined: findQuery: ' + findQuery.explain('executionStats').executionStats.totalDocsExamined);

// PRINT ALL LIKES DOCS
// db.datingLikes.find().forEach(printjson)
