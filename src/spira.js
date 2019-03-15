'use strict';

const axios = require('axios');
const AWS = require('aws-sdk');
const ssm = new AWS.SSM({
    region: 'us-west-2'
});

const SPIRA_URL = "https://science37.spiraservice.net/services/v5_0/RestService.svc"
const SPIRA_USER = "Kiran"
const SPIRA_KEY = "/spira/kiran"

class Spira {
    constructor() {
        this.apiKey = null;
    }
    
    async createConnection(){
        const headers = await this.getHeader();
        const connection = axios.create({
            baseURL: SPIRA_URL,
            timeout: 3000,
            headers: headers
        });
        return connection;
    }
    
    async getHeader() {
        return {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            username: SPIRA_USER,
            'api-key': await this.getSpiraKey(),
        };
    }

    async getSpiraKey(){
        if(!this.apiKey){
            const request = await ssm.getParameter({Name: SPIRA_KEY}).promise();
            this.apiKey = request.Parameter.Value.toString();
        }
        return this.apiKey;
    }

    async getReleases() {
        try {            
            const connection = await this.createConnection();
            const response = await connection.get('/projects/9/releases');
            return response.data;
        } catch (e) {
            console.error(`Spiral connection error: ${e.message}`);
        }
    }

    async getTestCases(releaseId) {
        try {
            const connection = await this.createConnection();
            const response = await connection.get(`/projects/9/releases/${releaseId}/test-cases`);
            return response.data;
        } catch (e) {
            console.error(`Spiral connection error: ${e.message}`);
        }
    }

    async getTestCaseDetails(testCaseId) {
        try {
            const connection = await this.createConnection();
            const response = await connection.get(`/projects/9/test-cases/${testCaseId}`);
            return response.data;
        } catch (e) {
            console.error(`Spiral connection error: ${e.message}`);
        }
    }
}

module.exports = new Spira();