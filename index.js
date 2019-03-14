'use strict';

exports.handler = async (event, context, callback) => {
  const {resource, path, httpMethod, queryStringParameters, pathParameters, body} = event;
  console.log("Incoming----\n",resource, path, httpMethod, queryStringParameters, pathParameters, body);
  const defaultMessage = {
    "statusCode": 200,
    "body": "[\"aaa\",\"ccc\",\"ggg\",\"bbb\",\"ddd\"]"
  }
  callback(null, defaultMessage);
};


