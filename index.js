'use strict';

exports.handler = async (event, context, callback) => {
  const {resource, path, httpMethod, queryStringParameters, pathParameters, body} = event;
  console.log("Incoming----\n",resource, path, httpMethod, queryStringParameters, pathParameters, body);
  const defaultMessage = {
      'hello': 'there'
  };
  callback(null, defaultMessage);
};


