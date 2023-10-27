require('../db/dbConfig')
const path = require('path')
const fsp = require('fs').promises
const personDataSchema = require('../db/personDataSchema')

async function finalUpdate(filePath, formData){
    try{
        const {full_name, email, dob, mobile_number, gender} = formData
        const fileData = await fsp.readFile(filePath)
        const destinationDirectory = 'uploads/StoredPdf/'
        const fileName = Date.now()
        const fileExtension = '.pdf'
        const destinationPath = path.join(destinationDirectory,`${fileName}${fileExtension}`)
        try {
            await fsp.writeFile(destinationPath, fileData);
        } catch (writeError) {
            console.error('Error uploading file:', writeError);
            throw writeError; // Throw the error for handling at a higher level if needed
        }

        const data = new personDataSchema({
            full_name,
            email,
            dob,
            mobile_number,
            gender,
            fileName,
            destinationPath
        })

        await data.save()
        console.log('File saved to MongoDB:');
        // Delete the file after saving it to MongoDB
        try {
            await fsp.unlink(filePath);
        } catch (deleteError) {
            console.error('Error deleting file:', deleteError);
        }
        return true
    }
    catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}

module.exports = {
    finalUpdate : finalUpdate
}