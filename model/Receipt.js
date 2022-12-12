const {model, Schema} = require('mongoose')
const  autoIncrement = require('mongoose-auto-increment')


const receiptSchema = new Schema({
    receiptNumber:{
        type:Number,
         default:1
        },
    customerName:{
        type:String,
        required: true,
    },
    customerPhone:{
        type:String,
        required: true,
    },
    device: String,
    subject: String,
    cost: Number,
    fee:  Number,
    prePayment: Number,
    remainingPayment:Number,
    description:String,
    createdAt:{type:Date,default:Date.now}
})

receiptSchema.plugin(autoIncrement.plugin, {
    model: 'Receipt',
    field: 'receiptNumber'
});
// receiptSchema.plugin(AutoIncrementSimple, [{ field: 'receiptNumber' }]);



module.exports = model("Receipt", receiptSchema)