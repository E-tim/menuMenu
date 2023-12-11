require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors')
const sanitiseHtml = require('sanitize-html')
const {MongoClient, ObjectId} = require('mongodb')
const multer = require('multer')
const upload = multer();
const fse = require('fs-extra')
// const sharp = require('sharp')
const path = require('path')
const TelegramBot = require('node-telegram-bot-api');
// const bodyParser = require('body-parser')


const {TOKEN, chatId} = process.env
const TELEGRAM_API = `https://api.telegram.org/bot${process.env.token}`
const URI = `/webhook/${TOKEN}`
// const WEBHOOK_URL = SERVER_URL + URI

const bot = new TelegramBot(TOKEN, { polling: true });

const app = express();
var corsOptions = {
    origin: ['http://localhost:3000', 'https://singular-twilight-6a7253.netlify.app'],
    credentials: true,
};
app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json())
app.set('view engine', 'ejs')

// const init = async ()=> {
//     const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`)
//     console.log(res.data)
// }

app.get('/', (req, res)=> {
    res.send('workinggg')
})










app.post('/sendMessage', async(req,res)=> {
    
    console.log(req.body)
    // const text = req.body.name
    let incoming = req.body.itemList
    let rNumber = req.body.roomOrTable_number

    // cleaning an input from front-end 
    const clean = sanitiseHtml(rNumber, {
        allowedTags: [],
        allowedAttributes: {}
    })

    let text = [];
    // incoming.map(item => text.push(`${item.many} ${item.name} ` ) )
    incoming.map(item => text.push({qty: item.many, name: item.name}) )
    const extractValues = text.map(obj => `${obj.name} - ${obj.qty} \n`)
    console.log(text)
    bot.sendMessage(chatId, ` <b>RN:</b>  ${clean} 📧 \n <b>ORDER</b> \n ${extractValues}`, {parse_mode: 'HTML'})
    res.send('Order has been sent')
   
})


const webhookURLs = `https://menu-menu.vercel.app/sendMessage${TOKEN}/${TOKEN}`;
bot.setWebHook(webhookURLs);

app.listen(process.env.PORT || 4000, ()=> {
    console.log(`app is running on port, ${process.env.PORT || 4000}`)
    // init()
})

