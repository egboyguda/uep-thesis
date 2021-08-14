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
const Relief = require('../models/relief');
const Person = require('../models/person');

// router.get('/fake', async (req, res) => {
//   const user = new User({ username: 'test3', isBarangay: true });
//   await User.register(user, 'test3');
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
    if (await req.user.isBarangay) {
      res.redirect('/barangay/add');
    }
    res.redirect('/');
    //res.redirect(redirectUrl);
  }
);
//dd pag add donator
//mag add cya dd donation
router.get('/', isLoggedIn, (req, res) => {
  res.redirect('/add');
});
router.get('/add', isLoggedIn, (req, res) => {
  res.render('admin/donation');
});
router.post('/add', isLoggedIn, async (req, res) => {
  const { name, calamity, commodity, expiration } = req.body;
  const donator = await Donation({ name: name, calamity: calamity });

  for (const e of commodity) {
    const data = await new Commodity({
      name: e.commodityName,
      units: e.units,
      quantity: e.quantity,
      expiration: e.expiration,
    });
    data.donator = donator;
    await data.save();
    const stock = await StockRecord.find({
      expiration: {
        $eq: e.expiration,
      },
    });
    //console.log(stock);

    if (stock.length === 0) {
      const record = await new StockRecord({
        name: e.commodityName,
        units: e.units,
        quantity: parseFloat(e.quantity),
        expiration: e.expiration,
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
//api pag get commodity
router.get('/api/commodity', async (req, res) => {
  const commodity = await Commodity.find({}).populate({
    path: 'donator',
    select: ['name', 'calamity'],
  });
  res.send(commodity);
});

//dd man pag inventory
router.get('/stock', async (req, res) => {
  const stock = await StockRecord.find({});
  res.render('admin/stocklist', { stock });
});

// api sa inventory
router.get('/api/stock', async (req, res) => {
  const stock = await StockRecord.find({});
  res.send(stock);
});
//dd pag track sa relief
router.get('/track', async (req, res) => {
  const barangays = await phil.getBarangayByMun('084815');
  res.render('admin/track', { barangays });
});

//dd pag kuwa sa mga user na naka recieve tas wa paka rcv
router.get('/track/relief', async (req, res) => {
  const { id, option } = req.query;
  if (option === 'received') {
    console.log(req.query);
    const relief = await Relief.findById(id).populate({
      path: 'accepted',
      select: ['name', 'barangay'],
    });
    res.send(relief.accepted);
    return;
  }
  const relief = await Relief.findById(id);
  const person = await Person.find({
    $and: [
      {
        relief: { $nin: id },
      },
      {
        barangay: { $eq: relief.barangay },
      },
    ],
  });
  res.send(person);
});
//dd pag kuwa kun cn o wara pakakuwa relief
router.get('/track/:barangay', async (req, res) => {
  const barangay = req.params.barangay;
  const data = await Relief.find({
    $and: [
      {
        barangay: {
          $eq: `${barangay.trim()}`,
        },
      },
      {
        isCompleted: {
          $ne: true,
        },
      },
    ],
  });
  res.send(data);
  console.log('dis');
});

//dd man pag imud kun pera na an tawo na nakakarawat

router.get('/track/relief/:id', async (req, res) => {
  const { id } = req.params;
  const relief = await Relief.findById(id);
  console.log('called');
  res.render('admin/relief', { id, relief });
});
router.get('/account', isLoggedIn, isAdminL, (req, res) => {
  res.render('admin/account');
});
router.post('/account', isLoggedIn, isAdminL, async (req, res) => {
  const { username, up, role } = req.body;
  if (role == 'admin') {
    const user = new User({ username: username, isAdmin: true });
    await User.register(user, up);
  } else if (role == 'staff') {
    const user = new User({ username: username, isStaff: true });
    await User.register(user, up);
  } else {
    const user = new User({ username: username, isBarangay: true });
    await User.register(user, up);
  }
  res.redirect('/account');
});
module.exports = router;
