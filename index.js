var defaults = require('./defaults/index');
var rp = require('request-promise');

/**
 *
 * @param config
 * @constructor
 */
function RequestPromiseBatch(config) {
    if (config) {
        config.defaultOptions ? this.defaultOptions = config.defaultOptions : defaults.defaultOptions;
        config.getOptions ? this.getOptions = config.getOptions : defaults.getOptions;
    }
    this.defaultOptions = {
        uri: 'http://www.google.com',
        resolveWithFullResponse: true
    };
    this.getOptions = {
        //uri: 'http://www.google.com'
    };
    this.postOptions = {
        uri: 'http://posttestserver.com/post.php'
    };
    this.rp = rp.defaults(this.defaultOptions);
    this.getCallback = function () {
        console.log('hello!');
    };
}

/**
 *
 * @param payload
 * @param uri
 * @returns {Function}
 */
RequestPromiseBatch.prototype.createPostRequest = function (payload, uri) {
    var self = this;
    if (!payload) throw new Error('no payload specified');
    if (!uri) throw new Error('no uri specified');
    self.postOptions.uri = uri;
    self.postOptions.json = payload;

    var PostRequest = function () {
        return self.rp.post(self.postOptions)
    };
    PostRequest.callback = this.postCallback;
    PostRequest.uri = uri;
    return PostRequest;
};

/**
 *
 * @param uri
 * @returns {Function}
 */
RequestPromiseBatch.prototype.createGetRequest = function (uri) {
    var self = this;
    if (!uri) throw new Error('no uri specified');
    this.getOptions.uri = uri;

    var GetFunc = function () {
        return self.rp.get(self.getOptions);
    };
    GetFunc.callback = this.getCallback;
    GetFunc.uri = uri;
    return GetFunc;
};

/**
 *
 * @param requests
 */
RequestPromiseBatch.prototype.createBatchRequest = function (requests) {
    var _requests = [];

    requests.forEach(function (request) {
        // BatchRequest
        if (request.requests)
            _requests = _requests.concat(request.requests);
        else
            _requests.push(request);
    });

    var BatchFunc = function () {
        return executeBatchRequest(_requests);
    };
    BatchFunc.requests = _requests;
    return BatchFunc;
};

function executeBatchRequest(requests) {
    var results = [];
    var promise = null;
    requests.forEach(function (request) {
        // first promise
        if (!promise) promise = request();
        else promise = promise.then(function (res) {
            request.callback(res);
            results.push({uri: request.uri, statusCode: res.statusCode});
            return request();
        });
    });
    // lastPromise
    return promise.then(function (res) {
        requests[requests.length - 1].callback(res);
        results.push({uri: requests[requests.length - 1].uri, statusCode: res.statusCode});
        return Promise.resolve(results);
    });
}

exports = module.exports = RequestPromiseBatch;