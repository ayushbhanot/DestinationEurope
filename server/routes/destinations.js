//From Lab 3

// Endpoint to get all destinations
app.get('/api/destinations', async (req, res) => {
    try {
        const data = await loadData();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: "Failed to load data" });
    }
});

// Endpoint to get a specific destination by ID with validation
app.get('/api/destination/:id', async (req, res) => {
    const id = req.params.id.trim();
    try {
        const data = await loadData();
        const destination = data.find(d => d.ID === id);
        destination ? res.json(destination) : res.status(404).json({ error: "Destination not found" });
    } catch (error) {
        res.status(500).json({ error: "Failed to load data" });
    }
});

// Endpoint to get geographical coordinates of a destination by ID
app.get('/api/destination/:id/coordinates', async (req, res) => {
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
        res.status(500).json({ error: "Failed to load data" });
    }
});

// Endpoint to get all unique countries
app.get('/api/countries', async (req, res) => {
    try {
        const data = await loadData();
        const countries = [...new Set(data.map(d => d.Country))].filter(Boolean);
        countries.length > 0 ? res.json(countries) : res.status(404).json({ error: "No countries found" });
    } catch (error) {
        res.status(500).json({ error: "Failed to load data" });
    }
});