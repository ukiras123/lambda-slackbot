'use strict';
const CORS_KEY = 'access-control-allow-origin';
const AWS = require('aws-sdk');
const ssm = new AWS.SSM({ region: 'us-west-2' });

const SPIRA_URL = "SPIRA_URL_ROOT=https://science37.spiraservice.net/services/v5_0/RestService.svc"
const SPIRA_USER = "Kiran"
const SPIRA_KEY = "/spira/kiran"

exports.handler = async (event, context, callback) => {
  const options = {
    method: event.httpMethod,
    url: event.path,
    payload: event.body,
    headers: event.headers,
  };

  const request = await ssm.getParameter({ Name: SPIRA_KEY }).promise();
  const SPIRA_PASSWORD = request.Parameter.Value.toString();

  const response = {
    statusCode: 200,
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      password: SPIRA_PASSWORD,
      input: event,
    }),
  };
  callback(null, response);
};


