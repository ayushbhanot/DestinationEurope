const express = require('express');
const List = require('../models/List');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Create new list
router.post('/', authMiddleware, async (req, res) => {
  const { name, description, destinations, visibility } = req.body;
  try {
    const newList = new List({
      name,
      description,
      destinations,
      visibility,
      user: req.user.id
    });
    const list = await newList.save();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all lists
router.get('/', async (req, res) => {
  try {
    const lists = await List.find({ visibility: 'public' });
    res.json(lists);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
