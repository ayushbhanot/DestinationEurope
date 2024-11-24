// From Lab 3

// Endpoint to search destinations based on field and pattern
app.get('/api/search', async (req, res) => {
    const { field, pattern, n } = req.query;
    try {
        const data = await loadData();
        const actualField = Object.keys(data[0]).find(key => key.toLowerCase().trim() === field.toLowerCase());
        
        if (!actualField) {
            return res.status(400).json({ error: `Field '${sanitize(field)}' does not exist in data.` });
        }
        
        let results = data.filter(d => d[actualField]?.toLowerCase().includes(pattern.toLowerCase()));
        if (n) results = results.slice(0, parseInt(n, 10));
        
        results.length > 0 ? res.json(results) : res.status(404).json({ error: "No matching destinations found" });
    } catch (error) {
        res.status(500).json({ error: "Failed to search data" });
    }
});