require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors');
const sanitiseHtml = require('sanitize-html');
const { MongoClient, ObjectId } = require('mongodb');
const multer = require('multer');
const upload = multer();
const fse = require('fs-extra');
const path = require('path');
const TelegramBot = require('node-telegram-bot-api');

const TOKEN = process.env.TOKEN; // Ensure TOKEN is correctly accessed
const chatId = process.env.chatId; // Ensure chatId is correctly accessed
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`;
const URI = `/webhook/${TOKEN}`;
const SERVER_URL = 'https://menumenu.onrender.com'; // Your Render.com URL
const WEBHOOK_URL = SERVER_URL + URI;

const bot = new TelegramBot(TOKEN, { polling: true });

const app = express();
var corsOptions = {
    origin: ['http://localhost:3000', 'https://singular-twilight-6a7253.netlify.app'],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.send('workinggg');
});

app.post('/sendMessage', async (req, res) => {
    console.log(req.body);
    let incoming = req.body.itemList;
    let rNumber = req.body.roomOrTable_number;

    const clean = sanitiseHtml(rNumber, {
        allowedTags: [],
        allowedAttributes: {}
    });

    let text = [];
    incoming.map(item => text.push({ qty: item.many, name: item.name }));
    const extractValues = text.map(obj => `${obj.name} - ${obj.qty} \n`);
    console.log(text);
    bot.sendMessage(chatId, `<b>RN:</b> ${clean} 📧 \n<b>ORDER</b>\n${extractValues.join('')}`, { parse_mode: 'HTML' });
    res.send('Order has been sent');
});

const init = async () => {
    try {
        const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`);
        console.log(res.data);
    } catch (error) {
        console.error('Error setting webhook:', error);
    }
};

// Uncomment and use this line to set the webhook
// const webhookURLs = `https://menumenu.onrender.com/sendMessage/${TOKEN}`;
// bot.setWebHook(webhookURLs);

app.listen(process.env.PORT || 4000, () => {
    console.log(`app is running on port ${process.env.PORT || 4000}`);
    init(); // Initialize webhook setting
});
