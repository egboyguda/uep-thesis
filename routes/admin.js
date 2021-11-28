const express = require('express');
const router = express.Router({ mergeParams: true });
const phil = require('phil-reg-prov-mun-brgy');
const Donation = require('../models/donationModel');
const Commodity = require('../models/commodity');
const StockRecord = require('../models/stockRecord');
const path = require('path');
const passport = require('passport');
const { render } = require('ejs');
const { isAdminL, isLoggedIn } = require('../middleware');
const User = require('../models/user');
const { find } = require('../models/donationModel');
const Relief = require('../models/relief');
const Person = require('../models/person');
const { route } = require('./barangay');
const Family = require('../models/family');

// router.get('/fake', async (req, res) => {
//   const user = new User({ username: 'test3', isBarangay: true });
//   await User.register(user, 'test3');
//   res.redirect('/login');
// });
router.get('/househeld2', async (req, res) => {
  const barangays = await phil.getBarangayByMun('084815');
  //console.log(phil.provinces);
  const municipal = await phil.getCityMunByProvince('0848');
  //console.log(municipal);
  res.render('barangay/househeld2', { barangays, municipal });
});
//dd pag kuwa barangay sa municipal

router.get('/logout', (req, res) => {
  req.logOut();

  res.redirect('/login');
});
router.get('/barcode/:id', async (req, res) => {
  const { id } = req.params;
  const barangay = await phil.getBarangayByMun(id);
  res.send(barangay);
});
router.get('/family/:id', isLoggedIn, async (req, res) => {
  const id = req.params.id;
  const person = await Family.find({ headFamily: { $eq: id } });
  const family = await Person.findById(id);
  console.log(family);
  //console.log(person.headFamily);
  //console.log(person);
  res.render('admin/family', { person, family });
});
//dd pag log in
router.get('/login', (req, res) => {
  res.render('admin/login');
});
router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
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
router.get('/', isLoggedIn, async (req, res) => {
  const user = await User.find({});
  const relief = await Relief.find({});
  const people = await Person.find({});
  const donation = await Donation.find({});
  const staff = await User.find({
    isStaff: { $eq: true },
  });
  const finish = await Relief.find({
    isCompleted: { $eq: true },
  });
  const commodity = await Commodity.find({});
  console.log(user.length);
  res.render('admin/dashboard', {
    userLength: user.length,
    reliefLength: relief.length,
    personL: people.length,
    donationL: donation.length,
    staffL: staff.length,
    completed: finish.length,
    com: commodity.length,
  });
  //res.redirect('/add');
});
router.get('/add', isLoggedIn, (req, res) => {
  res.render('admin/donation');
});
router.post('/add', isLoggedIn, async (req, res) => {
  const { name, calamity, commodity, expiration, acceptName, arrivalDate } =
    req.body;
  const donator = await Donation({ name: name, calamity: calamity });

  for (const e of commodity) {
    const data = await new Commodity({
      name: e.commodityName,
      units: e.units,
      quantity: e.quantity,
      expiration: e.expiration,
      arrivalDate: arrivalDate,
      acceptName: acceptName,
    });
    data.donator = donator;
    await data.save();
    const stock = await StockRecord.find({
      expiration: {
        $eq: e.expiration,
      },
    });
    //console.log(stock);

    const record = await new StockRecord({
      name: e.commodityName,
      units: e.units,
      quantity: parseFloat(e.quantity),
      expiration: e.expiration,
    });
    await record.save();
    console.log(record);
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
router.get('/api/stock', isLoggedIn, async (req, res) => {
  const stock = await StockRecord.find({});
  res.send(stock);
});
//dd pag track sa relief
router.get('/track', isLoggedIn, async (req, res) => {
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
router.get('/track/:barangay', isLoggedIn, async (req, res) => {
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

router.get('/track/relief/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const relief = await Relief.findById(id);
  console.log('called');
  res.render('admin/relief', { id, relief });
});
router.get('/account', isLoggedIn, isAdminL, (req, res) => {
  res.render('admin/account');
});
router.post('/account', isLoggedIn, isAdminL, async (req, res) => {
  console.log(req.body);
  try {
    const { username, up, role } = req.body;
    if (role == 'admin' || role == 'Admin') {
      const user = new User({ username: username, isAdmin: true });
      await User.register(user, up);
    } else if (role == 'staff' || role == 'Staff') {
      const user = new User({ username: username, isStaff: true });
      await User.register(user, up);
    } else {
      const user = new User({ username: username, isBarangay: true });
      await User.register(user, up);
    }
    req.flash('success', 'successfully added');
  } catch (error) {
    console.log(error.message);
    req.flash('error', error.message);
  }
  res.redirect('/account');
});

router.get('/edit/:id', isLoggedIn, async (req, res) => {
  const barangays = await phil.getBarangayByMun('084815');
  const { id } = req.params;
  const person = await Person.findById(id);
  console.log(person);
  res.render('barangay/edit', { person, barangays });
});

router.post('/edit/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const {
    name,
    barangay,
    beneficiary,
    contactNumber,
    occupation,
    income,
    workplace,
    civilStatus,
    sector,
    education,
    health,
    family,
    birthday,
    nickname,
  } = req.body;
  const person = await Person.findByIdAndUpdate(id, {
    name: name,
    sector: sector,
    beneficiary: beneficiary,
    contactNumber: contactNumber,
    occupation: occupation,
    income: income,
    workplace: workplace,
    nickname: nickname,
    civilStatus: civilStatus,
    education: education,
    health: health,
    bday: birthday,
    barangay: barangay.trim(),
  });
  await person.family.push(...family);
  person.save();
  res.send('ok');
});

router.get('/goods/:id', isLoggedIn, async (req, res) => {
  const { id } = req.params;
  const stock = await StockRecord.findById(id);
  res.send(stock);
});
router.post('/goods/:id', async (req, res) => {
  const { name, quantity, expiration, id } = req.body;
  await StockRecord.findByIdAndUpdate(id, {
    name: name,
    expiration: new Date(expiration),
    quantity: quantity,
  });
  res.send('ok');
});
router.get('/account/edit', isLoggedIn, async (req, res) => {
  //const user = await User.find({});
  res.render('admin/acountEdit');
});
router.get('/api/user', async (req, res) => {
  const user = await User.find({});
  res.send(user);
});
router.get(
  '/.well-known/pki-validation/C73645055E30E86B2250C5E94FDB3E40.txt',
  (req, res) => {
    let filePath = path.join(__dirname, 'C73645055E30E86B2250C5E94FDB3E40.txt');
    res.sendFile(filePath);
  }
);
router.delete('/delete/:id', async (req, res) => {
  const { id } = req.params;
  const commodity = await Commodity.findByIdAndDelete(id);
  console.log(commodity);
  res.send('ok');
});
router.patch('/edite', async (req, res) => {
  console.log(req.body);
  const { id, password, account } = req.body;
  const user = await User.findById(id);

  console.log(user);
  await user.setPassword(password, function (err, user) {
    if (err) {
      res.send('error');
    } else {
      user.save();
      res.send('ok');
    }
  });
});

//delete commodity
router.delete('/stock/:id', async (req, res) => {
  const { id } = req.params;
  const stock = await StockRecord.findByIdAndDelete(id);
  res.send('ok');
});

//family
router.get('/family/info/:id', async (req, res) => {
  const { id } = req.params;

  const family = await Family.findById(id);
  res.send(family);
});
router.put('/data/:id', async (req, res) => {
  const { id } = req.params;
  console.log(id);
  console.log(req.body);
  const {
    sector,
    health,
    education,
    civilStatus,
    workplace,
    income,
    occupation,
    contactNumber,
  } = req.body;

  const person = await Person.findByIdAndUpdate(id, req.body);
  res.send(person);
});
router.put('/family/edot/:id', async (req, res) => {
  const { id } = req.params;
  await Family.findByIdAndUpdate(id, req.body);
  res.send('ok');
});
router.delete('/del/:id', async (req, res) => {
  const { id } = req.params;
  await Person.findByIdAndRemove(id);
  res.send('ok');
});
module.exports = router;
