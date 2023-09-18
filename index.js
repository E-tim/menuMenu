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
const sharp = require('sharp')
const path = require('path')
// const bodyParser = require('body-parser')

// db connection to database
let db;

// creating folder for file uploaded
fse.ensureDirSync(path.join('public', 'uploaded-photo'))

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

app.get('/listing', async(req, res)=> {

    const allData = await db.collection('beerCollection').find().toArray();
    res.render('lisst', {allData : allData})
})

app.post('/beer', upload.single('photo'), cleanUp, async(req, res) => {
    if (req.file) {
        const photoFileName = `${Date.now()}.jpeg`;
        await sharp(req.file.buffer).jpeg({quality: 60}).toFile(path.join('public', 'uploaded-photo', photoFileName))
        req.cleanData.photo = photoFileName;
    }

    console.log(req.body)

    const info = await db.collection('beerCollection').insertOne(req.cleanData);
    const newAddedInfo = await db.collection('beerCollection').findOne({_id: new ObjectId(info.insertedId)})
    res.send(newAddedInfo);

} )










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
    incoming.map(item => text.push(`${item.many} ${item.name} ` ) )
    console.log(text)
    await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id : process.env.chatId,
        parse_mode: 'HTML',
        text: `
                <b>RN:</b>  ${clean} 📧 
<b>Order: </b>  ${text.toString()}

              `
              
    })
    res.send('Order has been sent')
   
})


function cleanUp (req, res, next) {
    if(typeof req.body.name != "string") req.body.name = "";
    if(typeof req.body.price != "string") req.body.price = "";
    if(typeof req.body._id != "string") req.body._id = "";

    req.cleanData = {
        name: sanitiseHtml(req.body.name.trim(), { allowedTags: [], allowedAttributes: {}}),
        price: sanitiseHtml(req.body.price.trim(), { allowedTags: [], allowedAttributes: {} })
    }
    next();
}

const start = async()=> {

    try {
        
        const client = new MongoClient ('mongodb+srv://eesuola:timothy@cluster0.7b6p0.mongodb.net/tim?retryWrites=true&w=majority', { useNewUrlParser: true })
        await client.connect()
        db = client.db()

        app.listen(process.env.PORT || 80, ()=> {
            console.log(`app is running on port, ${process.env.PORT || 80}`)
            // init()
        })

    } catch (error) {
        console.log('unable to connect')
    }
}
start();

