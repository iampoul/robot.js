// const axios     = require('axios')
const dotenv    = require('dotenv')
const { App }   = require('@slack/bolt')

dotenv.config()

const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
});

// Listens to incoming messages that contain "hello"
app.message('hello', async ({ message, say }) => {
    // say() sends a message to the channel where the event was triggered
    await say(`Hey there <@${message.user}>!`);
});

(async () => {
    // Start your app
    const server = await app.start(process.env.PORT || 3000);

    console.log('⚡️ Bolt app is running!', server.address());
})();