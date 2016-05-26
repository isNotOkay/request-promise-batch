var RequestPromiseBatch = require('./index');
console.log(RequestPromiseBatch);
var rpb = new RequestPromiseBatch();


var getA = rpb.createGetRequest('http://www.wikipedia.de');
var getB = rpb.createGetRequest('http://www.google.de');
var getC = rpb.createGetRequest('http://www.google.de');
var batchRequest1 = rpb.createBatchRequest([getA]);
var batchRequest2 = rpb.createBatchRequest([batchRequest1, getB, getC]);

//getA().then(function(){console.log('finished...');});


batchRequest2().then(function (res) {
    console.log('=== finished batchRequest2 ===');
    console.log(res);
});


function postCallback(res) {
    var objektId = res.objektId;
    return objektId;
}

function getCallback(res) {
    return res.statusCode;
}

