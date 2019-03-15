const rp = require('request-promise');

const {getAllTCDetail, getPostOptions} = require('./util');
const {basicPrivateBody} = require('./slackModel');

async function processRequest(parsedBody) {
    const {command, text, response_url} = parsedBody;
    let slackBody = "";
    if (command === '/oq-status' && text !== "") {
        const tcDetail = await getAllTCDetail(text);
        if (tcDetail.error) {
            console.log("error ", tcDetail.error);
            slackBody = basicPrivateBody(tcDetail.error);
        } else {
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

function isValidRequest(options) {
    const {command, response_url, text} = options.payload;
    return !(!command || !response_url || !text || text === "");
}


module.exports = {
    processRequest,
    isValidRequest,
};
