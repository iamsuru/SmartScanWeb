require('../db/dbConfig')
const user = require('../db/loginSchema')
async function doLogin(username,hashPassword){
    try{
        const checkUser = await user.findOne({user_id:username})
        return checkUser.password === hashPassword
    }
    catch(err){
        console.log('error in login ',err)
    }
}

module.exports = {
    doLogin:doLogin
}