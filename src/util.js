const spira = require('./spira');

function _isOQRelease(release, releaseVersion) {
    const {
        FullName,
        ReleaseStatusName
    } = release;
    const name = FullName.toLowerCase();
    const status = ReleaseStatusName.toLowerCase();
    if (name.includes("val") && name.includes("oq") && name.includes(releaseVersion)) {
        return true;
    }
    return false;
}

async function getAllTCDetail(releaseVersion) {
    const releases = await spira.getReleases();
    const oqRelease = releases.filter(release => _isOQRelease(release, releaseVersion));
    if (!(oqRelease.length > 0)) {
        return {"error": `Please input valid release version. Invalid \`${releaseVersion}\``};
    }
    const releaseId = oqRelease[0]['ReleaseId'];
    const releaseName = oqRelease[0]['Name'];
    const releaseStartDate = oqRelease[0]['StartDate'].substring(6, 16);
    const releaseEndDate = oqRelease[0]['EndDate'].substring(6, 16);
    const failedOQs = oqRelease[0]['CountFailed'];
    const notRunOQs = oqRelease[0]['CountNotRun'];
    const passedOQs = oqRelease[0]['CountPassed'];

    const allTestCases = await spira.getTestCases(releaseId);
    if (!(allTestCases.length > 0)) {
        return {"error": `No OQs found for the release version ${releaseVersion}`};
    }
    const testCaseDetail = {};
    testCaseDetail.releaseName = releaseName;
    testCaseDetail.releaseId = releaseId;
    testCaseDetail.releaseStartDate = releaseStartDate;
    testCaseDetail.releaseEndDate = releaseEndDate;
    testCaseDetail.failedOQs = failedOQs;
    testCaseDetail.notRunOQs = notRunOQs;
    testCaseDetail.passedOQs = passedOQs;


    let testCases = [];
    for (let i = 0; i < allTestCases.length; i++) {
        const testCaseId = allTestCases[i]['TestCaseId'];
        const testCaseDetail = await spira.getTestCaseDetails(testCaseId);
        const {
            TestCaseStatusName,
            AuthorName,
            Name,
            ExecutionStatusName,
            ExecutionDate,
        } = testCaseDetail;
        const tcDetail = {
            status: TestCaseStatusName,
            author: AuthorName,
            name: Name,
            executionStatus: ExecutionStatusName,
            testCaseId,
            executionDate: ExecutionDate
        };
        testCases.push(tcDetail);
    }
    testCaseDetail.testCases = testCases;
    return testCaseDetail;
}

function get200Response(payload) {
    const response = {
        statusCode: 200,
        headers: {
            "Content-Type": "application/json"
        }
    };
    response.body = JSON.stringify(payload);
    return response;
}

function getPostOptions(url, body) {
    return {
        method: 'POST',
        uri: url,
        body: body,
        json: true
    };
}

module.exports = {
    getAllTCDetail,
    get200Response,
    getPostOptions
}
