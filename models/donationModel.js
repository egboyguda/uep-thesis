const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const donationSchema = new Schema({
  name: {
    type: String,
  },
  contactNumber: {
    type: String,
  },
  civilStatus: {
    type: String,
    enum: ['single', 'married', 'annulled', 'widow'],
  },
  itemDonation: {
    type: Schema.Types.ObjectId,
    ref: 'Commodity',
  },
});
const Donation = mongoose.model('Donation', donationSchema);
module.exports = Donation;
