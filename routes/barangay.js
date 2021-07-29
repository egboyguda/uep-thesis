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

router.get('/track', isLoggedIn, async (req, res) => {
  if (typeof req.query.barangay === 'undefined') {
    const barangays = await phil.getBarangayByMun('084815');
    res.render('barangay/track', { barangays });
    return;
  }
  const { barangay } = req.query;
  console.log(barangay);
  const relief = await Relief.find({
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
  res.redirect('/barangay/relief');
});

//dd man pag scan sa qrcode sa tawo

router.get('/qrscan/:id', async (req, res) => {
  const { id } = req.params;
  res.render('barangay/qrscan', { id });
});
router.post('/qrscan/:id', async (req, res) => {
  console.log(req.body);
  const { person } = req.body;
  const { id } = req.params;
  const relief = await Relief.findById(id);
  const user = await Person.findById(person);

  console.log(person);
  if (user.barangay === relief.barangay) {
    await relief.accepted.push(user);
    console.log(relief.accepted);
    console.log(relief.accepted.length);
    if (relief.number === relief.accepted.length) {
      relief.isCompleted = await true;
    }
    await user.relief.push(relief);
    await user.populate(relief.relief);
    await user.save();
    await relief.save();
    res.send(relief);
    return;
  }
  res.send('ok');
});
module.exports = router;
