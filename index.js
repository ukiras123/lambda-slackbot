'use strict';
const {get200Response} = require('./src/util');
const {basicBody, basicPrivateBody} = require('./src/slackModel');
const {isValidRequest, processRequest} = require('./src/controller');
const queryString = require('query-string')

exports.handler = async (event, context, callback) => {
    const parsedBody = queryString.parse(event.body);
    const options = {
        method: event.httpMethod,
        url: event.path,
        payload: parsedBody,
        headers: event.headers,
    };

    let slackBody = "*Processing your request.* :spinner:";

    if (!isValidRequest(options)) {
        slackBody = basicPrivateBody("Your input is not correct. Please try again.");
        callback(null, get200Response(slackBody));
        return;
    }
    callback(null, get200Response(slackBody));
    processRequest(parsedBody);
};


