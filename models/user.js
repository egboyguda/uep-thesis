const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
  person: {
    type: Schema.Types.ObjectId,
    ref: 'Person',
  },
  isAdmin: {
    type: Boolean,
  },
  isBarangay: {
    type: Boolean,
  },
  isClient: {
    type: Boolean,
  },
  barangay: {
    enum: [
      'Cababto-an',
      'Cabari-an',
      'Cagbigajo',
      'Canjumadal',
      'Camparanga',
      'Ge-adgawan',
      'Ginulgan',
      'Geparayan',
      'Igot',
      'Ynaguingayan',
      'Inanahawan',
      'Manahao',
      'Paninirongan',
      'Poblacion District 1',
      'Poblacion District 2',
      ',Poblacion District 3',
      'Poblacion District 4',
      'Poblacion District 5',
      'Poblacion District 6',
      'Poblacion District 7',
      'Poblacion District 8',
      'San Ramon',
      'Penonogan',
      'Sixto T. Balanguit, Sr.',
      'Tula',
    ],
  },
});

userSchema.plugin(passportLocalMongoose);
const User = mongoose.model('User', userSchema);
module.exports = User;
