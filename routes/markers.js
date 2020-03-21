const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const Marker = require('../models/Marker');

//@route    POST /marker/add
//@desc     Add a marker
//@access   Public
router.post(
  '/add',
  //   [
  //     check(
  //       'id',
  //       'Name needs to be between 1 and 35 characters long.',
  //     ).isLength({ min: 1, max: 35 }),
  //     check(
  //       'description',
  //       'Description needs to be between 1 and 725 characters long.',
  //     ).isLength({ min: 1, max: 725 }),
  //     check(
  //       'category',
  //       'Category needs to be between 1 and 35 characters long.',
  //     ).isLength({ min: 1, max: 35 }),
  //   ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id, lat, long } = req.body;

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
        long,
      });

      await marker.save();

      res.send('Marker added!');
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server error');
    }
  },
);

module.exports = router;
