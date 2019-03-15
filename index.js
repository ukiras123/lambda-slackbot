'use strict';
const {get200Response} = require('./src/util');
const {basicPrivateBody} = require('./src/slackModel');
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

    let AWS = require('aws-sdk');
    let lambda = new AWS.Lambda();
    let params = {
        FunctionName: 'BotTriggerFunction',
        InvocationType: 'Event', // Ensures asynchronous execution
        Payload: JSON.stringify({body: parsedBody})
    };
    return lambda.invoke(params).promise()
    .then(() => callback(null, get200Response(slackBody)));
};


exports.secondHandler = async (event, context, callback) => {
    const parsedBody = event.body;
    await processRequest(parsedBody);
    callback(null, get200Response("Success"));
};
