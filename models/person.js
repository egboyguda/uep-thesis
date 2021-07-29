const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const personSchema = new Schema({
  name: {
    type: String,
  },
  barangay: {
    type: String,
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
  relief: [
    {
      relief: {
        type: Schema.Types.ObjectId,
        ref: 'Relief',
      },
    },
  ],
});

const Person = mongoose.model('Person', personSchema);
module.exports = Person;
