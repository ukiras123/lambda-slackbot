'use strict';
const {get200Response} = require('./src/util');
const {basicBody, basicPrivateBody} = require('./src/slackModel');
const {isValidRequest, processRequest} = require('./src/controller');
const queryString = require('query-string')

exports.handler = async (event, context, callback) => {
    const parsedBody = queryString.parse(event.body);
    parsedBody.path = event.path;
    const options = {
        method: event.httpMethod,
        url: event.path,
        payload: parsedBody,
        headers: event.headers,
    };

    let slackBody = "";
    if (!isValidRequest(options, parsedBody.path)) {
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

    slackBody = basicPrivateBody(`*Processing your request for \`${parsedBody.command} ${parsedBody.text}\`* :gottarun:`);
    return lambda.invoke(params).promise()
    .then(() => callback(null, get200Response(slackBody)));
};


exports.secondHandler = async (event, context, callback) => {
    const parsedBody = event.body;
    console.log(JSON.stringify(event));
    console.log(JSON.stringify(parsedBody));
    await processRequest(parsedBody);
    callback(null, get200Response("Success"));
};
