const mongoose = require('mongoose');

const userDataSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    mobile_number: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'], // Assuming gender can only be one of these values
        required: true,
    },
    fileName : {
        type: String,
        required: true,
    },
    destinationPath : {
        type : String,
        required: true,
    }
});

const UserData = mongoose.model('UserData', userDataSchema);

module.exports = UserData;
