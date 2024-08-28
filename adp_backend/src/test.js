const axios = require('axios');

const clientId='b047ef97-3465-4a75-90a7-7889c29ebfb7'
const clientSecret= 'X3d.QztU~Z.xjm6~W~L.4KDp-93S5-39DD'
const scope = 'da031e96-b238-4e2b-bbfd-d5d21786c728/.default'
const grant='client_credentials'

const accessTokenUrl="https://login.microsoftonline.com/92e84ceb-fbfd-47ab-be52-080c6b87953f/oauth2/v2.0/token"

const testData = [{
    _id: '_adp_portal_test_id',
    description: 'test',
}]

async function getToken(params) {
    try{
        const res = await axios.post(accessTokenUrl, params);
        return res.data.access_token
    } catch (error) {
        console.log(error.response)
        console.log(error.response.status)
    }
}

async function upload(authToken, data) {
    const url='https://apigwy-qa.ericsson.net/gst-index/v1/adp_marketplace/documents?token=adp8bYu3YacccEErr&server=fbdf861d-61e3-41e4-a1e6-13fc1032736d'
    
    const config = {
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    }

    try{
        const res = await axios.post(url, data, config);
        return res;
    } catch (err) {
        console.log(err.response)
    }
}   



async function run() {
    const params = new URLSearchParams()
    params.append('client_id', clientId)
    params.append('client_secret', clientSecret)
    params.append('grant_type', grant)
    params.append('scope', scope)
    
    const token = await getToken(params);

    const answer = await upload(token, testData);
    console.log(answer);
}

run()