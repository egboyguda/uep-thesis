const express = require('express');
const router = express.Router({ mergeParams: true });
const phil = require('phil-reg-prov-mun-brgy');
const Transaction = require('../models/transaction');
const StockRecord = require('../models/stockRecord');
const { isStaff, isLoggedIn } = require('../middleware');

//dd an pag send sa barangay
router.get('/send', isLoggedIn, isStaff, async (req, res) => {
  const barangays = await phil.getBarangayByMun('084815');
  const stock = await StockRecord.find({});
  res.render('staff/send', { barangays, stock });
});

router.post('/send', isLoggedIn, isStaff, async (req, res) => {
  const { data } = req.body;

  for (i of data) {
    for (j of i.commodityData) {
      console.log(i.barangay);
      console.log(j);
      const transaction = await Transaction({
        name: j.commodityName,
        destination: `${i.barangay.trim()}`,
      });
      transaction.quantity.number = await j.quantity;
      transaction.quantity.units = await j.units;
      const stock = await StockRecord.find({ name: { $eq: j.commodityName } });
      stock[0].quantity -= await j.quantity;
      await stock[0].save();
      await transaction.save();
    }
  }
});
// pag imud transaction
router.get('/transaction', isLoggedIn, isStaff, async (req, res) => {
  const transaction = await Transaction.find({});
  res.render('staff/transaction', { transaction });
});
//dd pag imud tanan na household
module.exports = router;
