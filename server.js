const express = require('express')
const bodyParser = require('body-parser')
const crypto = require('crypto')
const path = require('path')
const multer = require('multer')
const fs = require('fs')
const routes = require('./routes/routes')
const auth = require('./public/scripts/auth')
const uploadToDatabase = require('./public/scripts/uploadToDatabase')
const app = express()
const PORT = 2000

app.use(express.static('public'))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(bodyParser.json())
app.use(express.urlencoded({extended : true}))
app.use(bodyParser.urlencoded({extended: true}))

//login(index) page
app.use('',routes)

//home(form) page
app.use('/home',routes)

//uploadFile page
app.use('/uploadFile',routes)

//after uploading
app.use('/uploaded',routes)

//login action
app.post('/login',(req,res)=>{
    const {username, password} = req.body
    const hashPassword = crypto.createHmac('sha256','pKey').update(password).digest('hex')
    auth.doLogin(username,hashPassword)
    .then((result)=>{
        if(result){
            res.redirect('/home')
        }
        else{
            res.redirect('/?error=InvalidCredentials');
        }
    })
    .catch((err)=>{
        console.log(err)
        res.redirect(err)
    })
})

let location =''

app.post('/sendLocationString', (req, res) => {
    try {
        res.setHeader('Content-Type', 'application/json')
        location = req.body.location
        console.log('Received location:', location)
        res.json({ message: 'Location received successfully' }) // Ensure this response is JSON
    } catch (error) {
        console.error('Error handling request:', error)
        res.status(500).json({ error: 'Internal Server Error' })
    }
});


//uploadToDatabase action
app.post('/uploadToDatabase' , (req,res)=>{
    const formData = req.body
    let filePath = path.join('uploads','user',`${location}.pdf`)
    uploadToDatabase.finalUpdate(filePath,formData)
    .then((result)=>{
        if(result){
            res.redirect('/uploaded?popUp=0')
        }
        else{
            res.redirect('/?error=notUpdated');
        }
    })
    .catch((err)=>{
        console.log(err)
        res.redirect(err)
    })
})

//qr pdf handling

const mobileUploadStorage = multer.diskStorage({
    destination : function(req,file,cb){
        const uploadPath = path.join('uploads','user')
        fs.mkdirSync(uploadPath, {recursive : true})
        cb(null, uploadPath)
    },
    filename : function(req,file,cb){
        const pdfName = location
        const fileExtension = path.extname(file.originalname)
        cb(null, `${pdfName}${fileExtension}`)
    }
})

const mobileUpload = multer({ storage : mobileUploadStorage})


app.post('/uploadFromMobile',mobileUpload.single('document-to-upload'), (req,res)=>{
    res.redirect('/uploaded?popUp=1')
})

app.listen(PORT)