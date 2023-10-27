const express = require('express')
const path = require('path')

const router = express.Router()

router.get('',(req,res)=>{
    res.sendFile(path.join(__dirname,'index.html'))
})

router.get('/home',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public','form.html'))
})


router.get('/uploadFile',(req,res)=>{
    res.sendFile(path.join(__dirname,'../public','upload.html'))
})

router.get('/uploaded',(req,res)=>{
    const popUp = req.query.popUp
    if(popUp === '1'){
        res.sendFile(path.join(__dirname,'../public','doneForMobile.html'))
    }
    else{
        res.sendFile(path.join(__dirname,'../public','doneForUploader.html'))
    }
})

module.exports = router