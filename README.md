# slack-bot-lambda
S37 Slack Bot: after deployment it creates a API Gateway and Lambda Function in AWS. 
Slack APP has to be configured with the API Gateway URL. 
There are two lambdas where the first lambda make sure its the valid request and then triggers the second lambda 
if its valid. It has the following features:

- Send OQ Status

### Required
Parameter Store with following fields for Spira Access:
- /spira/name : Spira API Name
- /spira/key : Spira API Key

### How to deploy

`npm install`

`npm run build1`

`npm run deploy1`

`npm run build2`

`npm run deploy2`

