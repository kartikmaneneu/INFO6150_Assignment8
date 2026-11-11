const express = require('express');
const path = require('path');
const multer = require('multer');
const userRoutes = require('./routes/userRoutes');
const setupSwagger = require('./swagger');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/images', express.static(path.join(__dirname, '..', 'images')));

setupSwagger(app);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.use('/', userRoutes);

app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    return res.status(400).json({
      error: 'Invalid file format. Only JPEG, PNG, and GIF are allowed.',
    });
  }

  if (error && error.message) {
    return res.status(400).json({ error: error.message });
  }

  return next();
});

module.exports = app;
