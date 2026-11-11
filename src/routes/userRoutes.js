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
 *     summary: Create a user
 *     description: Creates a user after validating the email, full name, and password. Passwords are stored as bcrypt hashes.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateUserRequest'
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Required fields, email format, name, or password is invalid, or the email is already registered
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/user/create', createUser);

/**
 * @openapi
 * /user/login:
 *   post:
 *     summary: Authenticate a user
 *     description: Checks the submitted password against the stored bcrypt hash. Returns no password or hash.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *       400:
 *         description: Email or password is missing or invalid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Invalid email or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Authentication could not be completed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/user/login', loginUser);

/**
 * @openapi
 * /user/edit:
 *   put:
 *     summary: Update user details
 *     description: Updates a full name, password, or both. Email is used to identify the user and cannot be changed. Passwords must satisfy the same strength rules as user creation.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateUserRequest'
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Validation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.put('/user/edit', updateUser);

/**
 * @openapi
 * /user/delete:
 *   delete:
 *     summary: Delete a user by email
 *     description: Permanently deletes the account identified by the email in the request body.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/EmailRequest'
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MessageResponse'
 *       400:
 *         description: Missing or invalid email
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.delete('/user/delete', deleteUser);

/**
 * @openapi
 * /user/getAll:
 *   get:
 *     summary: Retrieve all users
 *     description: Returns each user's full name, email, and bcrypt password hash, as required by the assignment. Never expose this endpoint publicly in a production application.
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: List of users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserList'
 *       500:
 *         description: Users could not be retrieved
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/user/getAll', getAllUsers);

/**
 * @openapi
 * /user/uploadImage:
 *   post:
 *     summary: Upload an image for a user
 *     description: Stores one image per user in the server's images directory. Only JPEG, PNG, and GIF extensions are accepted. Use multipart/form-data with the exact field names email and image.
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
 *                 format: email
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Image uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ImageUploadResponse'
 *       400:
 *         description: Invalid file format or image already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Image could not be stored
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
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
