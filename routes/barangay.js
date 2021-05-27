const express = require('express');
const router = express.Router({ mergeParams: true });
const phil = require('phil-reg-prov-mun-brgy');
const qr = require('qrcode');
const Person = require('../models/person');

//dd pag add housheal
router.get('/add', async (req, res) => {
  const barangays = await phil.getBarangayByMun('084815');
  res.render('barangay/househeld', { barangays });
});

router.post('/add', async (req, res) => {
  const { name, barangay } = req.body;
  console.log(req.body);

  const user = await new Person({
    name: name,
    barangay: `${barangay.trim()}`,
  });
  console.log(user);
  res.send(user._id);
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
router.get('/relief', async (req, res) => {
  const barangays = await phil.getBarangayByMun('084815');
  res.render('barangay/relief', { barangays });
});

//dd man pag scan sa qrcode sa tawo
module.exports = router;
