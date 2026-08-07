const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());

const users = [];
// Make users available on app.locals so tests can reset
app.locals.users = users;

// API: list users
app.get('/api/users', (req, res) => {
  res.json(app.locals.users);
});

// API: create user
app.post('/api/users', (req, res) => {
  const { name } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  const user = { id: app.locals.users.length + 1, name };
  app.locals.users.push(user);
  res.status(201).json(user);
});

// Serve static SPA
app.use(express.static(path.join(__dirname, '../public')));

const port = process.env.PORT || 3000;

if (require.main === module) {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
}

// Export app for testing
module.exports = app;
