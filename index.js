require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const axios = require('axios')
const cors = require('cors')
const sanitiseHtml = require('sanitize-html')



const {TOKEN, SERVER_URL, chatId} = process.env
const TELEGRAM_API = `https://api.telegram.org/bot${process.env.token}`
const URI = `/webhook/${TOKEN}`
const WEBHOOK_URL = SERVER_URL + URI

const app = express();
var corsOptions = {
    origin: ['http://localhost:3000', 'https://luxury-maamoul-41b2e8.netlify.app'],
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

    // cleaning an input from html
    const clean = sanitiseHtml(rNumber, {
        allowedTags: [],
        allowedAttributes: {}
    })

    let text = [];
    incoming.map(item => text.push(`${item.many} ${item.name} ` ) )
    console.log(text)
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id : process.env.chatId,
        parse_mode: 'HTML',
        text: `RN ${clean} 📧 ` + text.toString()
    })
    res.send('Order has been sent')
   
})


app.listen(process.env.PORT || 80, ()=> {
    console.log(`app is running on port, ${process.env.PORT || 80}`)
    // init()
})