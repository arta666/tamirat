const Receipt = require('../model/Receipt')
const moment = require('moment-jalaali')
const {digitsEnToFa,addCommas} = require('@persian-tools/persian-tools')

module.exports.onAddNewReceipt = async (e, args) => {
  try {

    console.log(args)
    let receipt = new Receipt(args)
    const receiptSaved = await receipt.save()
    e.reply('new-receipt-saved',JSON.stringify(receiptSaved))
} catch (error) {
    e.reply('error',error.message)
}
}

module.exports.onGetReceipts = async (e, args) => {
    try {
        let receipts = await Receipt.find({}).sort({"createdAt":-1}).lean()
        let final = receipts.map(obj => {
            return {...obj,
                cost:digitsEnToFa(addCommas(obj.cost)),
                remainingPayment:digitsEnToFa(addCommas(obj.remainingPayment)),
                prePayment:digitsEnToFa(addCommas(obj.prePayment)),
                fee:digitsEnToFa(addCommas(obj.fee)),
                customerPhone:digitsEnToFa(obj.customerPhone),
                createdAt:new Intl.DateTimeFormat('fa-IR').format(obj.createdAt)}
        });
        e.reply('get-receipts',JSON.stringify(final))
        
    } catch (error) {
        e.reply('error',error.message)
    }
}

module.exports.onDeleteReceipt = async (e, _id) => {
    try {
        const receipt = await Receipt.findByIdAndDelete(_id)
        e.reply('delete-receipt-success',JSON.stringify(receipt))
    } catch (error) {
        console.log(error);
        e.reply('error',error.message)
    }
}

module.exports.onUpdateReceipt = async (e, args) => {
    try {
        let updatedReceipt = await Receipt.findByIdAndUpdate(args.idReceiptToUpdate,
            {
                customerName: args.customerName,
                customerPhone: args.customerPhone,
                device: args.device,
                subject: args.subject,
                cost: args.cost,
                fee: args.fee,
                prePayment: args.prePayment,
                remainingPayment: args.remainingPayment,
                description: args.description
            },
            {new: true})
            
        e.reply("update-receipt-success",JSON.stringify(updatedReceipt))
        
    } catch (error) {
        console.log(error);
        e.reply('error',error.message)
    }
}
