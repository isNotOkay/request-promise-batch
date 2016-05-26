/*
 Options
 */
exports.defaultOptions = {
    resolveWithFullResponse: true
};

exports.postOptions = {};

exports.getOptions = {};

exports.putOptions = {};

exports.deleteOptions = {};

/*
 Callbacks
 */

exports.postCallback = function (res) {
    console.log('status code of previous POST-Request: ' + res.statusCode);
};
exports.getCallback = function (res) {
    console.log('status code of previous GET-Request: ' + res.statusCode);
};
exports.putCallback = function (res) {
    console.log('status code of previous UPDATE-Request: ' + res.statusCode);
};
exports.deleteCallback = function (res) {
    console.log('status code of previous DELETE-Request: ' + res.statusCode);
};