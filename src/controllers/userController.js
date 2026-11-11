const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const {
  isStrongPassword,
  isValidEmail,
  isValidFullName,
} = require('../utils/validators');

async function createUser(req, res) {
  const { fullName, email, password } = req.body || {};

  if (!fullName || !email || !password) {
    return res.status(400).json({ error: 'Validation failed.' });
  }

  const trimmedFullName = String(fullName).trim();
  const normalizedEmail = String(email).trim().toLowerCase();

  if (!isValidFullName(trimmedFullName) || !isValidEmail(normalizedEmail) || !isStrongPassword(password)) {
    return res.status(400).json({ error: 'Validation failed.' });
  }

  try {
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'Validation failed.' });
    }

    const user = new User({
      fullName: trimmedFullName,
      email: normalizedEmail,
      password,
    });

    await user.save();
    return res.status(201).json({ message: 'User created successfully.' });
  } catch (error) {
    return res.status(400).json({ error: 'Validation failed.' });
  }
}

async function loginUser(req, res) {
  const { email, password } = req.body || {};
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (!isValidEmail(normalizedEmail) || typeof password !== 'string' || password.length === 0) {
    return res.status(400).json({ error: 'Valid email and password are required.' });
  }

  try {
    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    return res.status(200).json({
      message: 'Login successful.',
      user: {
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to authenticate user, Check Again!' });
  }
}

async function updateUser(req, res) {
  const { email, fullName, password } = req.body || {};

  if (!email) {
    return res.status(400).json({ error: 'Validation failed.' });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  if (!isValidEmail(normalizedEmail)) {
    return res.status(400).json({ error: 'Validation failed.' });
  }

  if (!fullName && !password) {
    return res.status(400).json({ error: 'Validation failed.' });
  }

  try {
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (fullName !== undefined) {
      const trimmedFullName = String(fullName).trim();
      if (!isValidFullName(trimmedFullName)) {
        return res.status(400).json({ error: 'Validation failed.' });
      }
      user.fullName = trimmedFullName;
    }

    if (password !== undefined) {
      if (!isStrongPassword(password)) {
        return res.status(400).json({ error: 'Validation failed.' });
      }
      user.password = password;
    }

    await user.save();
    return res.status(200).json({ message: 'User updated successfully.' });
  } catch (error) {
    return res.status(400).json({ error: 'Validation failed.' });
  }
}

async function deleteUser(req, res) {
  const email = String(req.body?.email || req.query?.email || '').trim().toLowerCase();

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: 'Validation failed.' });
  }

  try {
    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.status(200).json({ message: 'User deleted successfully.' });
  } catch (error) {
    return res.status(404).json({ error: 'User not found.' });
  }
}

async function getAllUsers(req, res) {
  try {
    const users = await User.find({}, 'fullName email password');
    return res.status(200).json({
      users: users.map((user) => ({
        fullName: user.fullName,
        email: user.email,
        password: user.password,
      })),
    });
  } catch (error) {
    return res.status(500).json({ error: 'Unable to fetch users.' });
  }
}

async function uploadUserImage(req, res) {
  const email = String(req.body?.email || '').trim().toLowerCase();

  if (!req.file) {
    return res.status(400).json({ error: 'Invalid file format. Only JPEG, PNG, and GIF are allowed.' });
  }

  if (!isValidEmail(email)) {
    fs.unlink(req.file.path, () => {});
    return res.status(400).json({ error: 'Validation failed.' });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      fs.unlink(req.file.path, () => {});
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.imagePath) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({ error: 'Image already exists for this user!' });
    }

    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif'];
    const extension = path.extname(req.file.originalname).toLowerCase();
    if (!allowedExtensions.includes(extension)) {
      fs.unlink(req.file.path, () => {});
      return res.status(400).json({
        error: 'Invalid file format. Only JPEG, PNG, and GIF are allowed.',
      });
    }

    const filePath = `/images/${path.basename(req.file.path)}`;
    user.imagePath = filePath;
    await user.save();

    return res.status(201).json({
      message: 'Image uploaded successfully.',
      filePath,
    });
  } catch (error) {
    fs.unlink(req.file.path, () => {});
    return res.status(500).json({ error: 'Unable to upload image.' });
  }
}

module.exports = {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUsers,
  uploadUserImage,
};
