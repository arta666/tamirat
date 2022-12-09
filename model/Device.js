const {model, Schema} = require('mongoose')

const deviceSchema = new Schema({
    name:{
        type:String,
        required: true,
        unique: true
    }
})

module.exports = model("Device", deviceSchema)