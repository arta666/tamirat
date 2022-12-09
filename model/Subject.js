const {model, Schema} = require('mongoose')

const subjectSchema = new Schema({
    title:{
        type:String,
        required: true,
        unique: true
    },
    description:String
})

module.exports = model("Subject", subjectSchema)