var RequestPromiseBatch = require('./index');
console.log(RequestPromiseBatch);
var rpb = new RequestPromiseBatch();


var getA = rpb.createGetRequest('http://www.wikipedia.de');
var getB = rpb.createGetRequest('http://www.google.de');
var getC = rpb.createGetRequest('http://www.google.de');
var batchRequest = rpb.createBachRequest([getA, getB, getC]);
batchRequest().then(function (res) {
    console.log('finished batch request');
});
