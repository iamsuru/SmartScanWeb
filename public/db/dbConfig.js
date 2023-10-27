const mongoose = require('mongoose')

// //-> Connecting to server
// mongoose.connect('mongodb://127.0.0.1:27017/SmartScan')
mongoose.connect('mongodb+srv://iamsuru:Suru123@cluster0.kuezr4i.mongodb.net/SmartScan?retryWrites=true&w=majority')
.then(()=>console.log('Connected to Database'))
.catch((err)=>console.log(err))