const Receipt = require('../model/Receipt')

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
        const receipts = await Receipt.find()
        e.reply('get-receipts',JSON.stringify(receipts))
        
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
        const updatedReceipt = await Receipt.findByIdAndUpdate(args.idReceiptToUpdate,
            {
                customerName: args.customerName,
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
