const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const stockRecordSchema = new Schema({
  name: {
    type: String,
  },

  units: {
    type: String,
    enum: ['kg', 'pcs'],
  },
  quantity: {
    type: Number,
  },
});

const StockRecord = mongoose.model('StockRecord', stockRecordSchema);
module.exports = StockRecord;
