const rp = require('request-promise');

const {getAllTCDetail, getPostOptions} = require('./util');
const {basicPrivateBody, generateOQStatusBody} = require('./slackModel');

async function processRequest(parsedBody) {
    const {text, response_url, path} = parsedBody;
    let slackBody = "";
    if (path === '/status' && text && text !== "") {
        const tcDetail = await getAllTCDetail(text);
        if (tcDetail.error) {
            console.log("error ", tcDetail.error);
            slackBody = basicPrivateBody(tcDetail.error);
        } else {
            slackBody = generateOQStatusBody(tcDetail);
             console.log(`Final Body Generated: ${JSON.stringify(slackBody)}`)
        }
        const options = getPostOptions(response_url, slackBody);
        try {
            await rp(options);
        } catch (error) {
            const errorOption = getPostOptions(response_url, basicPrivateBody("Something went wrong. Please try again."));
            await rp(errorOption);
            console.log("Error during slack post ", error);
        }
    }
}

function isValidRequest(options, path) {
    const {command, response_url, text} = options.payload;
    return !( (!command || !response_url || !text || text === "") && (path !== '/status'));
}


module.exports = {
    processRequest,
    isValidRequest,
};
