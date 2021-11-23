const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = new Schema({
  name: {
    type: String,
  },
  sector: {
    type: String,
  },
  beneficiary: {
    type: String,
  },
  contactNumber: {
    type: String,
  },
  occupation: {
    type: String,
  },
  income: {
    type: Number,
  },
  workplace: {
    type: String,
  },
  nickname: {
    type: String,
  },
  civilStatus: {
    type: String,
  },
  education: {
    type: String,
  },
  health: {
    type: String,
  },
  bday: {
    type: String,
  },
  barangay: {
    type: String,
  },
  family: [{ type: Object }],
  relief: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Relief',
    },
  ],
});

const Person = mongoose.model('Person', personSchema);
module.exports = Person;
