'use strict';
const CORS_KEY = 'access-control-allow-origin';

exports.handler = async (event, context, callback) => {
  const options = {
    method: event.httpMethod,
    url: event.path,
    payload: event.body,
    headers: event.headers,
  };
  const response = {
    statusCode: 200,
    headers: {
      "Content-Type" : "application/json"
    },
    body: JSON.stringify({
      message: 'Go Serverless v1.0! Your function executed successfully!',
      input: event,
    }),
  };
  callback(null, response);
};


