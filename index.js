var defaults = require('./defaults/index');
var rp = require('request-promise');

function RequestPromiseBatch(config) {
    this.defaultOptions = defaults.defaultOptions;
    this.postOptions = defaults.postOptions;
    this.getOptions = defaults.getOptions;
    this.putOptions = defaults.putOptions;
    this.deleteOptions = defaults.deleteOptions;
    this.postCallback = defaults.postCallback;
    this.getCallback = defaults.getCallback;
    this.putCallback = defaults.putCallback;
    this.deleteCallback = defaults.deleteCallback;
    if (config) {
        if (config.defaultOptions) this.defaultOptions = config.defaultOptions;
        if (config.postOptions) this.postOptions = config.postOptions;
        if (config.getOptions)  this.getOptions = config.getOptions;
        if (config.putOptions)  this.putOptions = config.putOptions;
        if (config.deleteOptions) this.deleteOptions = config.deleteOptions;
        if (config.postCallback)  this.postCallback = config.postCallback;
        if (config.getCallback)  this.getCallback = config.getCallback;
        if (config.putCallback)  this.updateCallback = config.putCallback;
        if (config.deleteCallback)  this.deleteCallback = config.deleteCallback;
    }
    this.rp = rp.defaults(this.defaultOptions);
}

RequestPromiseBatch.prototype = (function () {
    function createPostRequest(uri, payload) {
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
    }

    function createGetRequest(uri) {
        var self = this;
        if (!uri) throw new Error('no uri specified');
        this.getOptions.uri = uri;

        var GetFunc = function () {
            return self.rp.get(self.getOptions);
        };
        GetFunc.callback = this.getCallback;
        GetFunc.uri = uri;
        return GetFunc;
    }

    function createPutRequest(uri, payload) {
        var self = this;
        if (!payload) throw new Error('no payload specified');
        if (!uri) throw new Error('no uri specified');
        self.putOptions.uri = uri;
        self.putOptions.json = payload;

        var PutRequest = function () {
            return self.rp.put(self.putOptions)
        };
        PutRequest.callback = this.putCallback;
        PutRequest.uri = uri;
        return PutRequest;
    }

    function createDeleteRequest(uri) {
        var self = this;
        if (!uri) throw new Error('no uri specified');
        this.deleteOptions.uri = uri;

        var DeleteFunc = function () {
            return self.rp.get(self.getOptions);
        };
        DeleteFunc.callback = this.deleteCallback;
        DeleteFunc.uri = uri;
        return DeleteFunc;
    }

    function createBatchRequest(requests) {
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
    }

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

    // public methods
    return {
        createPostRequest: createPostRequest,
        createGetRequest: createGetRequest,
        createPutRequest: createPutRequest,
        createDeleteRequest: createDeleteRequest,
        createBatchRequest: createBatchRequest
    }
})();

exports = module.exports = RequestPromiseBatch;