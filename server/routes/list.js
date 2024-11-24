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
      user: req.user.id, // Authenticated user's ID
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

router.put('/:id', authMiddleware, async (req, res) => {
  const { destinations } = req.body;
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ error: 'List not found' });
    if (list.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    list.destinations = destinations;
    list.lastModified = Date.now();
    await list.save();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ error: 'List not found' });
    if (list.user.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }
    await list.remove();
    res.json({ message: 'List deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



module.exports = router;
