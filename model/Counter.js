const {model, Schema} = require('mongoose')
const ObjectId = Schema.ObjectId;
const counterSchema = new Schema({
    _id:ObjectId,
    sequence_value: {type:Number, default:0,unique:true}
})

module.exports = model("Counter", counterSchema)