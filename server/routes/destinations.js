const express = require('express');
const router = express.Router();
const { loadData } = require('../utils/loadData');

// Helper function to sanitize user input (for values only)
function sanitize(input) {
    return String(input).replace(/</g, "&lt;").replace(/>/g, "&gt;").trim();
}

// Enhanced search endpoint
router.get('/', async (req, res) => {
    try {
        const data = await loadData(); // Load the data
        console.log("Dataset Keys:", Object.keys(data[0])); // Log the keys from the dataset

        const queryKeys = Object.keys(req.query);

        if (queryKeys.length === 0) {
            return res.status(400).json({ error: "No search parameters provided." });
        }

        // Sanitize query values (but NOT keys)
        const sanitizedQuery = {};
        queryKeys.forEach(key => {
            sanitizedQuery[key] = sanitize(req.query[key]).toLowerCase();
        });

        console.log("Sanitized Query:", sanitizedQuery); // Log sanitized query

        // Filter data based on the sanitized query
        const results = data.filter(record => {
            return queryKeys.every(queryKey => {
                const recordValue = record[queryKey]; // Match exact key from query
                console.log(`Key: ${queryKey}, Query Value: ${sanitizedQuery[queryKey]}, Record Value: ${recordValue}`);
                
                if (!recordValue) {
                    console.log(`Skipping record: Key '${queryKey}' not found in record.`);
                    return false;
                }

                return recordValue.toLowerCase().includes(sanitizedQuery[queryKey]);
            });
        });

        results.length > 0
            ? res.json(results)
            : res.status(404).json({ error: "No matching destinations found." });
    } catch (error) {
        console.error('Failed to search data:', error);
        res.status(500).json({ error: "Failed to search data", details: error.message });
    }
});

module.exports = router;
