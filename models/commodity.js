const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commoditySchema = new Schema({
  //commodity name ini
  name: {
    type: String,
  },
  category: {
    type: String,
    enum: [
      'instant noodles',
      'noddles',
      'rice',
      'chicken meat',
      'beef meat',
      'pork meat',
      'coffee',
      'milk',
      'can goods',
      'eggs',
    ],
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
});
const Commodity = mongoose.model('Commodity', commoditySchema);
module.exports = Commodity;
