const fs = require('fs');
const csv = require('csv-parser');
const path = require('path');

async function loadData() {
  const results = [];
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, '../data/europe-destinations.csv'))
      .pipe(csv())
      .on('data', (data) => results.push(data))
      .on('end', () => resolve(results))
      .on('error', (err) => reject(err));
  });
}

module.exports = { loadData };
