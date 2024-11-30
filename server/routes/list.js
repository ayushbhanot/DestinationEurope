const express = require('express');
const List = require('../models/List');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();
const User = require('../models/User');

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
  const { page = 1, limit = 10 } = req.query;
  try {
    const lists = await List.find({ visibility: 'public' })
      .sort({ lastModified: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalLists = await List.countDocuments({ visibility: 'public' });

    res.json({
      lists,
      currentPage: Number(page),
      totalPages: Math.ceil(totalLists / limit),
      totalLists,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get('/public', authMiddleware, async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  try {
    const lists = await List.find({ visibility: 'public' })
      .sort({ lastModified: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    const totalLists = await List.countDocuments({ visibility: 'public' });

    res.json({
      lists,
      currentPage: Number(page),
      totalPages: Math.ceil(totalLists / limit),
      totalLists,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/mine', authMiddleware, async (req, res) => {
  try {
    const lists = await List.find({ user: req.user.id });
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
    await list.deleteOne();
    res.json({ message: 'List deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Add a review to a list
router.post('/:id/reviews', authMiddleware, async (req, res) => {
  const { rating, comment } = req.body;

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be between 1 and 5' });
  }

  try {
    const list = await List.findById(req.params.id);
    if (!list) return res.status(404).json({ error: 'List not found' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const review = {
      user: user.id,
      nickname: user.nickname,
      rating,
      comment,
      date: Date.now(),
    };

    list.reviews.push(review);
    list.averageRating =
      list.reviews.reduce((sum, review) => sum + review.rating, 0) / list.reviews.length;

    await list.save();
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// Get a list by ID with reviews
router.get('/:id', async (req, res) => {
  try {
    const list = await List.findById(req.params.id)
      .populate('user', 'nickname')
      .populate('reviews.user', 'nickname');

    if (!list) return res.status(404).json({ error: 'List not found' });
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});




module.exports = router;
