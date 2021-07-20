const dotenv    = require('dotenv')
const { App }   = require('@slack/bolt')
const https     = require('https');
const ws        = require('ws')

// https://github.com/slackapi/node-slack-sdk

dotenv.config()

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    //signingSecret: process.env.SLACK_SIGNING_SECRET,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN
});

// http data
const options = {
    host: 'slack.com',
    path: '/api/apps.connections.open',
    //This is the only line that is new. `headers` is an object with the headers to request
    headers: {"Authorization": "Bearer " + process.env.SLACK_APP_TOKEN},
    method: "POST",
};

//http get websocket entry
req = https.request(options, function (res) {
    let data = '';
    res.on('data', function (chunk) {
        data += chunk;
    });
    res.on('end', function () {
        data = JSON.parse(data);

        if (data.ok) {
            let wssUrl = data.url;
            let socket = new ws(wssUrl);
            socket.onopen = function(e) {
                // connection established
                //console.log(e)
            }

            socket.onmessage = function(event) {
                // application received message
                console.log(event)
            }
        }
    });
    
}).on('error', function () {
    console.log('Failed to make an OAuth request')
})

req.end();

// Listens to incoming messages that contain "hello"
app.message('hello', async (
    { message, say }
) => {
    // say() sends a message to the channel where the event was triggered
    await say(`Hey there <@${message.user}>!`);
});

(async () => {
    // Start your app
    await app.start();

    console.log('⚡️ Bolt app is running!');
})()