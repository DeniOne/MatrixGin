/**
 * Webhook Setup Script
 * 
 * Sets Telegram webhook URL.
 */

const axios = require('axios');

const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';
const WEBHOOK_URL = process.argv[2];

if (!WEBHOOK_URL) {
    console.error('❌ Usage: node setup-webhook.js <webhook_url>');
    console.error('   Example: node setup-webhook.js https://abc123.ngrok.io/webhook/telegram');
    process.exit(1);
}

async function setWebhook() {
    try {
        console.log(`[Webhook Setup] Setting webhook to: ${WEBHOOK_URL}`);

        const response = await axios.post(
            `https://api.telegram.org/bot${BOT_TOKEN}/setWebhook`,
            { url: WEBHOOK_URL }
        );

        if (response.data.ok) {
            console.log('✅ Webhook set successfully!');
            console.log('   URL:', WEBHOOK_URL);
        } else {
            console.error('❌ Failed to set webhook:', response.data);
        }
    } catch (error) {
        console.error('❌ Error setting webhook:', error.message);
    }
}

async function getWebhookInfo() {
    try {
        const response = await axios.get(
            `https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`
        );

        console.log('\n📊 Current Webhook Info:');
        console.log(JSON.stringify(response.data.result, null, 2));
    } catch (error) {
        console.error('❌ Error getting webhook info:', error.message);
    }
}

(async () => {
    await setWebhook();
    await getWebhookInfo();
})();
