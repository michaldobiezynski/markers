const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Marker = require('../models/Marker');

//@route    GET /marker/all
//@desc     Get all markers
//@access   Public
router.get('/all', async (req, res) => {
  try {
    const markers = await Marker.find();
    res.json(markers);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//@route    POST /marker/add
//@desc     Add a marker
//@access   Public
router.post('/add', async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { id, lat, lng } = req.body.data;

  try {
    let marker = await Marker.findOne({ id });

    if (marker) {
      return res
        .status(400)
        .json({ errors: [{ msg: 'Marker already exists' }] });
    }

    marker = new Marker({
      id,
      lat,
      lng,
    });

    await marker.save();

    res.send('Marker added!');
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
});

//@route    DELETE /marker/delete
//@desc     Delete a marker
//@access   Public
router.delete('/delete', async (req, res) => {
  try {
    const marker = await Marker.findOne({
      lat: req.body.source.lat,
      lng: req.body.source.lng,
    });

    if (!marker) {
      return res.status(404).json({ msg: 'Marker not found' });
    }

    await marker.remove();

    res.json({ msg: 'Marker removed' });
  } catch (error) {
    console.error(error.message);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Marker not found' });
    }

    res.status(500).send('Server Errors');
  }
});

module.exports = router;
