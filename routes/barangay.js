const express = require('express');
const router = express.Router({ mergeParams: true });
const phil = require('phil-reg-prov-mun-brgy');
const qr = require('qrcode');
const Person = require('../models/person');
const { isBarangay, isLoggedIn } = require('../middleware');
const Relief = require('../models/relief');

//dd pag add housheal
router.get('/add', isLoggedIn, isBarangay, async (req, res) => {
  const barangays = await phil.getBarangayByMun('084815');
  res.render('barangay/househeld', { barangays });
});

router.post('/add', isLoggedIn, isBarangay, async (req, res) => {
  const { name, barangay } = req.body;
  console.log(req.body);
  console.log(`${barangay.trim()}`);
  const user = await new Person({
    name: name,
    barangay: `${barangay.trim()}`,
  });
  console.log(user);
  await user.save();

  res.send(user._id);
});

router.get('/track', async (req, res) => {
  if (typeof req.query.barangay === 'undefined') {
    const barangays = await phil.getBarangayByMun('084815');
    res.render('barangay/track', { barangays });
    return;
  }
  const { barangay } = req.query;
  console.log(barangay);
  const relief = await Relief.find({
    barangay: {
      $eq: `${barangay.trim()}`,
    },
  });
  res.send(relief);
});

router.get('/success/:id', async (req, res) => {
  const id = req.params.id;
  console.log(id);

  qr.toDataURL(`${id}`, { version: 5 }, (err, src) => {
    if (err) res.send('error');
    res.render('barangay/success', { src });
  });
});

//dd man pag himu relief
router.get('/relief', isLoggedIn, isBarangay, async (req, res) => {
  const barangays = await phil.getBarangayByMun('084815');
  res.render('barangay/relief', { barangays });
});

router.post('/relief', isLoggedIn, isBarangay, async (req, res) => {
  const { name, destination } = req.body;
  const person = await Person.find({
    barangay: {
      $eq: `${destination.trim()}`,
    },
  });
  console.log(person);
  const relief = await new Relief({
    name: name,
    barangay: `${destination.trim()}`,
    number: person.length,
  });
  await relief.save();
  res.send('ok');
});

//dd man pag scan sa qrcode sa tawo

router.get('/qrscan/:id', async (req, res) => {
  const { id } = req.params;
  res.render('barangay/qrscan', { id });
});
router.post('/qrscan/:id', async (req, res) => {
  console.log(req.body);
  res.send('ok');
});
module.exports = router;
