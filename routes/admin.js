const express = require('express');
const router = express.Router({ mergeParams: true });
const phil = require('phil-reg-prov-mun-brgy');
const Donation = require('../models/donationModel');
const Commodity = require('../models/commodity');
const StockRecord = require('../models/stockRecord');

const passport = require('passport');
const { render } = require('ejs');
const { isAdminL, isLoggedIn } = require('../middleware');
const User = require('../models/user');

router.get('/fake', async (req, res) => {
  const user = new User({ username: 'test2', isStaff: true });
  await User.register(user, 'test2');
  res.redirect('/login');
});

router.get('/logout', (req, res) => {
  req.logOut();

  res.redirect('/login');
});
//dd pag log in
router.get('/login', (req, res) => {
  res.render('admin/login');
});
router.post(
  '/login',
  passport.authenticate('local', {
    //failureFlash: true,
    failureRedirect: '/login',
  }),
  async (req, res) => {
    //req.flash('success', 'log in successful');
    //const redirectUrl = req.session.returnTo || '/admin' || '/barangay';
    //delete req.session.returnTo;
    // if (await req.user.isBarangay) {
    //   res.redirect('/');
    // }
    res.redirect('/');
    //res.redirect(redirectUrl);
  }
);
//dd pag add donator
//mag add cya dd donation
router.get('/', isLoggedIn, (req, res) => {
  res.render('admin/dashboard');
});
router.get('/add', isLoggedIn, isAdminL, (req, res) => {
  res.render('admin/donation');
});
router.post('/add', isLoggedIn, isAdminL, async (req, res) => {
  const {
    name,
    contactNumber,
    civilStatus,
    commodityName,
    units,
    quantity,
    category,
    calamity,
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
      calamity: calamity,
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

    // maghanap stock na kun
    const stock = await StockRecord.find({
      name: { $eq: commodity.category },
    });
    if (stock.length === 0) {
      const newStock = await new StockRecord({
        name: commodity.category,
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

  res.redirect('/add');
});

//dd man pag imud sa tanan na donation
router.get('/view', isLoggedIn, isAdminL, async (req, res) => {
  const donation = await Donation.find({}).populate({
    path: 'itemDonation',
    populate: { path: 'commodity' },
    select: ['name', 'quantity', 'units'],
  });

  res.render('admin/viewDonation', { donation });
});

//dd man pag view sa tanan na stock
router.get('/stock', isLoggedIn, isAdminL, async (req, res) => {
  const stock = await StockRecord.find({});
  res.render('admin/stocklist', { stock });
});
module.exports = router;
