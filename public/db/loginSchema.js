const mongoose = require('mongoose')

// creating schema
const userSchema = new mongoose.Schema({
    user_id:{
        type: String,
        required : true,
    },
    password:{
        type: String,
        required : true
    }
})


//model using schema
const user = mongoose.model('user_authentication',userSchema)

module.exports = user