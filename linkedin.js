// This sample code will make a request to LinkedIn's API to retrieve and print out some
// basic profile information for the user whose access token you provide.

const https = require('https');

// Replace with access token for the r_liteprofile permission
const accessToken = 'bq8RlWeHz3tEJbEd';
const options = {
    host: 'api.linkedin.com',
    path: '/v2/bq8RlWeHz3tEJbEd',
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${accessToken}`,
        'cache-control': 'no-cache',
        'X-Restli-Protocol-Version': '2.0.0'
    }
};

const profileRequest = https.request(options, function (res) {
    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        const profileData = JSON.parse(data);
        console.log(JSON.stringify(profileData, 0, 2));
    });
});
profileRequest.end();