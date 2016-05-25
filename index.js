var defaults = require('./defaults/index');
var rp = require('request-promise');

/*
 Constructur function
 */
function RequestPromiseBatch(config) {
    if (config) {
        config.defaultOptions ? this.defaultOptions = config.defaultOptions : defaults.defaultOptions;
        config.getOptions ? this.getOptions = config.getOptions : defaults.getOptions;
    }
    this.defaultOptions = {
        uri: 'http://www.google.com'
    };
    this.getOptions = {
        //uri: 'http://www.google.com'
    };
    this.postOptions = {
        uri: 'http://posttestserver.com/post.php'
    };
    this.rp = rp.defaults(this.defaultOptions);
}

/*
 Public methods
 */
RequestPromiseBatch.prototype.createPostRequest = function (payload, uri) {
    var self = this;
    if (!payload) throw new Error('a payload must be provided');
    if (uri) self.postOptions.uri = uri;
    self.postOptions.json = payload;

    return function () {
        return self.rp.post(self.postOptions)
    };
};

RequestPromiseBatch.prototype.createGetRequest = function (uri) {
    var self = this;
    if (uri) self.getOptions.uri = uri;
    return function () {
        return self.rp.get(self.getOptions);
    };
};

RequestPromiseBatch.prototype.createBachRequest = function (requests) {
    var _requests = [];
    requests.forEach(function (request) {
        // BatchRequest
        if (request.requests)
            _requests += request.requests;
        else
            _requests.push(request);
    });

    var BatchRequest = function () {
        return serial(_requests);
    };
    BatchRequest.requests = _requests;
    return BatchRequest;
};

/*
 Private Methods
 */
function serial(tasks) {
    var promise = null;
    tasks.forEach(function (task) {
        // first promise
        if (!promise) promise = task();
        else promise = promise.then(function (res) {
            console.log('=== finished task ===');
            return task;
        });
    });
    // lastPromise
    return promise;
}

exports = module.exports = RequestPromiseBatch;