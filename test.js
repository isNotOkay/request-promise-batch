var RequestPromiseBatch = require('./index');

var config = {
    postOptions: {
        uri: 'http://posttestserver.com/post.php'
    }
};

var requestBatch = new RequestPromiseBatch(config);


var getGoogle = requestBatch.createBatchRequest('http://www.google.de');
var getWikipedia = requestBatch.createBatchRequest('http://www.wikipedia.de');
var getReddit = requestBatch.createBatchRequest('http://www.reddit.org');
var getThemAll = requestBatch.createBatchRequest([getGoogle, getWikipedia, getReddit]);
getThemAll().then(function (res) {
    console.log('=== got them all ===');
});


