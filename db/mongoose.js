const mongoose = require('mongoose');
const  autoIncrement = require('mongoose-auto-increment')

const ObjectId = mongoose.Types.ObjectId;

const option = {
  useUnifiedTopology: true,
  autoIndex: true, useNewUrlParser: true}

mongoose.Promise = global.Promise;

mongoose.connect("mongodb://localhost/Tamirat",option)
  .then(() => console.log('Successfully connected to DB'))
  .catch(err => console.log(err));

  autoIncrement.initialize(mongoose.connection)

module.exports = {mongoose,ObjectId};