const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commoditySchema = new Schema({
  //commodity name ini
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
  donator: {
    type: Schema.Types.ObjectId,
    ref: 'Donation',
  },
  arrivalDate: {
    type: Date,
  },
  acceptName: {
    type: String,
  },
});
const Commodity = mongoose.model('Commodity', commoditySchema);
module.exports = Commodity;
