const fs = require('fs');
const path = require('path');
const multer = require('multer');

const imagesDirectory = path.join(__dirname, '..', '..', 'images');

if (!fs.existsSync(imagesDirectory)) {
  fs.mkdirSync(imagesDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination(req, file, callback) {
    callback(null, imagesDirectory);
  },
  filename(req, file, callback) {
    const email = String(req.body.email || 'user').trim();
    const sanitizedEmail = email.replace(/[^a-zA-Z0-9._-]/g, '_') || 'user';
    const extension = path.extname(file.originalname).toLowerCase();
    callback(null, `${sanitizedEmail}-${Date.now()}${extension}`);
  },
});

const fileFilter = (req, file, callback) => {
  const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
  const extension = path.extname(file.originalname).toLowerCase();

  if (!allowedExtensions.includes(extension)) {
    return callback(new Error('Invalid file format. Only JPEG, PNG, and GIF are allowed.'));
  }

  callback(null, true);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

module.exports = upload;
