var RequestPromiseBatch = require('./index');

var config = {
    postOptions: {
        uri: 'http://posttestserver.com/post.php'
    }
};

var request = new RequestPromiseBatch(config);

// create reusable POST/GET/PUT/DELETE-requests ...
var getGoogle = request.createGetRequest('http://www.google.de');
var getWikipedia = request.createGetRequest('http://www.wikipedia.de');
var getReddit = request.createGetRequest('http://www.reddit.org');

// ... and execute them in isolation ...
getGoogle().then(function (res) {
    console.log('=== got google ===');
    console.log('status code: ' + res.statusCode);
});

// ... or as a batch-Request in serial.
var getSome = request.createBatchRequest([getGoogle, getWikipedia, getReddit]);
getSome().then(function (res) {
    console.log('=== got google, wikipedia and reddit ===');
    console.log(res);
});

// bonus: batch-Requests can also be combined with regular requests
var getYahoo = request.createGetRequest('http://www.yahoo.com');
var getThemAll = request.createBatchRequest([getSome, getYahoo]);
getThemAll().then(function (res) {
    console.log('=== got them all ===');
    console.log(res);
});


