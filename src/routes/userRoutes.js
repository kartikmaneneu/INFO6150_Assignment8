const express = require('express');
const multer = require('multer');
const upload = require('../middleware/upload');
const {
  createUser,
  loginUser,
  updateUser,
  deleteUser,
  getAllUsers,
  uploadUserImage,
} = require('../controllers/userController');

const router = express.Router();

/**
 * @openapi
 * /user/create:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Validation failed
 */
router.post('/user/create', createUser);

/**
 * @openapi
 * /user/login:
 *   post:
 *     summary: Authenticate a user with email and password
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Email or password is missing or invalid
 *       401:
 *         description: Invalid email or password
 */
router.post('/user/login', loginUser);

/**
 * @openapi
 * /user/edit:
 *   put:
 *     summary: Update user details
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *               fullName:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation failed
 *       404:
 *         description: User not found
 */
router.put('/user/edit', updateUser);

/**
 * @openapi
 * /user/delete:
 *   delete:
 *     summary: Delete a user by email
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email]
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */
router.delete('/user/delete', deleteUser);

/**
 * @openapi
 * /user/getAll:
 *   get:
 *     summary: Retrieve all users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserList'
 */
router.get('/user/getAll', getAllUsers);

/**
 * @openapi
 * /user/uploadImage:
 *   post:
 *     summary: Upload an image for a user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [email, image]
 *             properties:
 *               email:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *       400:
 *         description: Invalid file format or image already exists
 *       404:
 *         description: User not found
 */
router.post('/user/uploadImage', (req, res, next) => {
  upload.single('image')(req, res, (error) => {
    if (error instanceof multer.MulterError) {
      return res.status(400).json({
        error: 'Invalid file format. Only JPEG, PNG, and GIF are allowed.',
      });
    }

    if (error) {
      return res.status(400).json({ error: error.message || 'Invalid file format. Only JPEG, PNG, and GIF are allowed.' });
    }

    return next();
  });
}, uploadUserImage);

module.exports = router;
