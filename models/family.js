const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const familySchema = new Schema({
  name: {
    type: String,
  },
  nickname: {
    type: String,
  },
  relation: {
    type: String,
  },
  bday: {
    type: String,
  },
  education: {
    type: String,
  },
  health: {
    type: String,
  },
  sector: {
    type: String,
  },
  occupation: {
    type: String,
  },
  headFamily: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Person',
  },
  gender: {
    type: String,
  },
});
const Family = mongoose.model('Family', familySchema);
module.exports = Family;
