const express = require('express');
const router = express.Router({ mergeParams: true });
const phil = require('phil-reg-prov-mun-brgy');
const Donation = require('../models/donationModel');
const Commodity = require('../models/commodity');
const StockRecord = require('../models/stockRecord');

const passport = require('passport');
//const { isAdminL, isLoggedIn } = require('../middleware');

//dd an dashboard

//dd pag add donator
//mag add cya dd donation
router.get('/', (req, res) => {
  res.render('donation');
});
router.post('/', async (req, res) => {
  const {
    name,
    contactNumber,
    civilStatus,
    commodityName,
    units,
    quantity,
    category,
  } = req.body;
  console.log(req.body);
  const data = await Donation.find({
    name: { $eq: name },
  });
  if (data.length === 0) {
    const donate = await new Donation({
      name: name,
      contactNumber: contactNumber,
      civilStatus: `${civilStatus.trim()}`,
    });
    const commodity = await new Commodity({
      name: `${commodityName.toLowerCase().replace(/\s+/g, '')}`,
      units: `${units.trim()}`,
      quantity: quantity,
      category: `${category.trim()}`,
    });
    await commodity.save();
    donate.itemDonation = await commodity;
    await donate.save();

    const stock = await StockRecord.find({
      name: { $eq: commodity.name },
    });
    if (stock.length === 0) {
      const newStock = await new StockRecord({
        name: commodity.name,
        units: commodity.units,
        quantity: commodity.quantity,
      });
      console.log(newStock);
      await newStock.save();
    } else {
      console.log(stock);
      stock[0].quantity += commodity.quantity;
      //console.log(stock);
      await stock[0].save();
    }
  } else {
    console.log('asda');
  }

  res.redirect('/');
});
module.exports = router;
