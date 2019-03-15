const moment = require('moment');


const DRAFT = "Draft";
const READY_FOR_REVIEW = "Ready for Review";
const REJECTED = "Rejected";
const APPROVED = "Approved";
const READY_FOR_TEST = "Ready for Test";
const TESTED = "TESTED";
const VERIFIED = "Verified";
const OBSOLETE = "Obsolete";

const FAILED = "Failed";
const PASSED = "Passed";
const NOT_RUN = "Not Run";

const oqStatus = {
    DRAFT,
    READY_FOR_REVIEW,
    REJECTED,
    APPROVED,
    READY_FOR_TEST,
    TESTED,
    VERIFIED,
    OBSOLETE
};

const executionStatus = {
    FAILED,
    PASSED,
    NOT_RUN
}

function basicBody(text) {
    return {
        response_type: 'in_channel',
        text,
    };
}

function basicPrivateBody(text) {
    return {
        text,
    };
}


function _formatHeader(releaseId, releaseName, totalOQ) {
    return {
        "type": "section",
        "text": {
            "type": "mrkdwn",
            "text": `*OQ Report for <${_releaseURL(releaseId)}|${releaseName}>. Total OQ: \`${totalOQ}\`*`
        }
    };
}

function _formatBody(status, execution) {
    const fields = [];
    fields.push(status);
    fields.push(execution);
    return {
        "type": "section",
        "fields": fields
    };
}

function _getAction(actionName) {
    if (actionName == "ReadyForReview") {
        return " --> TPM :lshark:"
    } else if (actionName == "Approved") {
        return " --> QA :lshark:"
    }
    return ""
}

function _formatExReport(exReport) {
    console.log("Execution report: ", JSON.stringify(exReport));
    let fields = "";
    Object.keys(exReport).forEach(function (key) {
        let count = exReport[key];
        fields += `${key}: \`${count}\`\n`
    });
    const k = {
        "type": "mrkdwn",
        "text": `*OQ Execution Report:*\n${fields}`
    };
    return k;
}

function _formatStatusReport(sReport) {
    let fields = "";
    Object.keys(sReport).forEach(function (key) {
        let count = sReport[key];
        if (count || key === "ReadyForTest" || key === "Approved" || key === "ReadyForReview" ) {
            fields += `${key}: \`${count}\`${_getAction(key)}\n`
        }
    });
    const k = {
        "type": "mrkdwn",
        "text": `*OQ Status Report:*\n${fields}`
    };

    return k;
}

function _releaseURL(releaseId) {
    return `https://science37.spiraservice.net/9/Release/${releaseId}.aspx`;
}

function _createBlockMessage(blocks) {
    console.log("Blocks: ", blocks);
    return {response_type: 'in_channel', "blocks": blocks};
}

function _formatFinish() {
    return {
        "type": "image",
        "image_url": "https://media1.tenor.com/images/6af971ce51053d876e3fa382d62fb6a3/tenor.gif",
        "alt_text": "Completed"
    };
}

function generateOQStatusBody(tcDetails) {
    const {testCases, releaseName, releaseId, failedOQs, notRunOQs, passedOQs} = tcDetails;
    const totalOQs = testCases.length;
    const statusReport = {};
    statusReport.Draft = testCases.filter(tc => tc.status === DRAFT).length;
    statusReport.ReadyForReview = testCases.filter(tc => tc.status === READY_FOR_REVIEW).length;
    statusReport.Rejected = testCases.filter(tc => tc.status === REJECTED).length;
    statusReport.Approved = testCases.filter(tc => tc.status === APPROVED).length;
    statusReport.ReadyForTest = testCases.filter(tc => tc.status === READY_FOR_TEST).length;
    statusReport.Tested = testCases.filter(tc => tc.status === TESTED).length;
    statusReport.Verified = testCases.filter(tc => tc.status === VERIFIED).length;
    statusReport.Obsolete = testCases.filter(tc => tc.status === OBSOLETE).length;

    const executionReport = {};
    executionReport.Passed = passedOQs;
    executionReport.Failed = failedOQs;
    executionReport.NotRun = notRunOQs;

    const blocks = [];
    const header = _formatHeader(releaseId, releaseName, totalOQs);
    const body = _formatBody(_formatStatusReport(statusReport), _formatExReport(executionReport));
    blocks.push(header);
    blocks.push(body);
    if (notRunOQs === 0) {
        const finish = _formatFinish();
        blocks.push(finish);
    }
    const oqStatusBody = _createBlockMessage(blocks);
    return oqStatusBody;
}

module.exports = {
    basicBody,
    basicPrivateBody,
    generateOQStatusBody
};
