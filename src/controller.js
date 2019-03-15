const rp = require('request-promise');

const {getAllTCDetail, getPostOptions} = require('./util');
const {basicPrivateBody, generateOQStatusBody} = require('./slackModel');

async function processRequest(parsedBody) {
    const {command, text, response_url} = parsedBody;
    let slackBody = "";
    if (command == '/oq-status' && text != "") {
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
            rp(options);
        } catch (error) {
            console.log("Error during slack post ", error);
        }
    }
}

function isValidRequest(options) {
    const {command, response_url, text} = options.payload;
    if (!command || !response_url || !text || text == "") {
        return false;
    }
    return true;
}


module.exports = {
    processRequest,
    isValidRequest,
};
