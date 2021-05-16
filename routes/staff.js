const express = require('express');
const router = express.Router({ mergeParams: true });
const phil = require('phil-reg-prov-mun-brgy');
const Transaction = require('../models/transaction');
const StockRecord = require('../models/stockRecord');
const { isStaff, isLoggedIn } = require('../middleware');

//dd an pag send sa barangay
router.get('/send', isLoggedIn, isStaff, async (req, res) => {
  const barangays = await phil.getBarangayByMun('084815');
  res.render('staff/send', { barangays });
});

router.post('/send', isLoggedIn, isStaff, async (req, res) => {
  const { category, destination, units, quantity } = req.body;
  const transaction = await new Transaction({
    name: category,
    destination: `${destination.trim()}`,
  });
  transaction.quantity.units = units;
  transaction.quantity.number = quantity;
  console.log(transaction);
  const stock = await StockRecord.find({
    name: { $eq: category },
  });
  stock[0].quantity -= quantity;
  await stock[0].save();
  await transaction.save();
  res.redirect('/staff/send');
});
// pag imud transaction
router.get('/transaction', isLoggedIn, isStaff, async (req, res) => {
  const transaction = await Transaction.find({});
  res.render('staff/transaction', { transaction });
});
//dd pag imud tanan na household
module.exports = router;
