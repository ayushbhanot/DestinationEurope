const express = require('express');
const router = express.Router();
const { loadData } = require('../utils/loadData');

router.get('/', async (req, res) => {
    try {
        const data = await loadData();
        console.log('Loaded Destinations:', data);
        res.json(data);
    } catch (error) {
        console.error('Failed to load destinations:', error);
        res.status(500).json({ error: 'Failed to load destinations' });
    }
});

router.get('/countries', async (req, res) => {
    try {
        const data = await loadData();
        console.log('Loaded Data:', data);
        const countries = [...new Set(data.map(d => d.Country))].filter(Boolean);
        console.log('Extracted Countries:', countries);
        countries.length > 0
            ? res.json(countries)
            : res.status(404).json({ error: 'No countries found' });
    } catch (error) {
        console.error('Failed to load countries:', error);
        res.status(500).json({ error: 'Failed to load countries' });
    }
});

router.get('/test-load-data', async (req, res) => {
    try {
        const data = await loadData();
        console.log('Raw Loaded Data:', data);
        res.json(data);
    } catch (error) {
        console.error('Error in /test-load-data:', error.message);
        res.status(500).json({ error: 'Failed to load data', details: error.message });
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id.trim();
    try {
        const data = await loadData();
        const destination = data.find(d => d.ID === id);
        destination ? res.json(destination) : res.status(404).json({ error: "Destination not found" });
    } catch (error) {
        res.status(500).json({ error: "Failed to load destination by ID" });
    }
});

router.get('/:id/coordinates', async (req, res) => {
    const id = req.params.id.trim();
    try {
        const data = await loadData();
        const destination = data.find(d => d.ID === id);
        if (destination) {
            res.json({ latitude: destination.Latitude, longitude: destination.Longitude });
        } else {
            res.status(404).json({ error: "Destination not found" });
        }
    } catch (error) {
        res.status(500).json({ error: "Failed to load coordinates" });
    }
});

module.exports = router;
