const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
  name: {
    type: String,
  },
  destination: {
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
  quantity: {
    units: {
      type: String,
    },
    number: {
      type: Number,
    },
  },
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;
