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
const { find } = require('../models/donationModel');

// router.get('/fake', async (req, res) => {
//   const user = new User({ username: 'test2', isStaff: true });
//   await User.register(user, 'test2');
//   res.redirect('/login');
// });

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
  const { name, calamity, commodity } = req.body;
  const donator = await Donation({ name: name, calamity: calamity });

  for (const e of commodity) {
    const data = await new Commodity({
      name: e.commodityName,
      units: e.units,
      quantity: e.quantity,
    });
    data.donator = donator;
    await data.save();
    const stock = await StockRecord.find({
      name: {
        $eq: e.commodityName,
      },
    });
    //console.log(stock);

    if (stock.length === 0) {
      const record = await new StockRecord({
        name: e.commodityName,
        units: e.units,
        quantity: parseFloat(e.quantity),
      });
      await record.save();
      console.log(record);
    } else {
      console.log('may sulud');

      stock[0].quantity += parseFloat(e.quantity);
      await stock[0].save();
    }
  }
  await donator.save();
  res.status(200).send('ok');
});

//dd pag view donation
router.get('/view', async (req, res) => {
  const commodity = await Commodity.find({}).populate({
    path: 'donator',
    select: ['name', 'calamity'],
  });
  res.render('admin/viewDonation', { commodity });
});

//dd man pag inventory
router.get('/stock', async (req, res) => {
  const stock = await StockRecord.find({});
  res.render('admin/stocklist', { stock });
});
module.exports = router;
