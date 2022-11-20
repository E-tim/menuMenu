require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors')
const TelegramBot = require('node-telegram-bot-api')



const {TOKEN, SERVER_URL, chatId} = process.env
const TELEGRAM_API = `https://api.telegram.org/bot${TOKEN}`
const URI = `/webhook/${TOKEN}`
const WEBHOOK_URL = SERVER_URL + URI

const app = express();
app.use(cors({origin: ['https://luxury-maamoul-41b2e8.netlify.app/','https://luxury-maamoul-41b2e8.netlify.app/cart', 'http://localhost:3000','http://localhost:3000/cart', 'http://127.0.0.1:8888']}))
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json())
app.set('view engine', 'ejs')

const init = async ()=> {
    const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`)
    console.log(res.data)
}

app.get('/', (req, res)=> {
    res.render('index.ejs')
})

app.post('/sendMessage', async(req,res)=> {
    
    // console.log(req.body.itemList)
    // const text = req.body.name
    let incoming = req.body.itemList
    let text = [];
    incoming.map(item => text.push(`${item.many} ${item.name} ` ) )
    console.log(text)
    // console.log(incoming.name)
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id : chatId,
        parse_mode: 'HTML',
        text: text.toString()
    })
    res.send('order recieved')
   
})


app.listen(process.env.PORT || 80, ()=> {
    console.log(`app is running on port, ${process.env.PORT || 80}`)
    // init()
})