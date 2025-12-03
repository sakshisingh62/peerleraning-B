const express = require('express');
const app = express();

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Test server running on http://localhost:${PORT}`);
}).on('error', (err) => {
  console.error('Server error:', err);
});