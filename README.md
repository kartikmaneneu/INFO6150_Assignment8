# INFO6150 Assignment 8

This project implements a secure REST API for user management and image uploads using Node.js, Express, MongoDB, bcrypt, Swagger, and Multer.

## Features

- Create user with validation
- Authenticate users using email and password
- Update user details while preventing email changes
- Delete user by email
- Fetch all users
- Upload one image per user
- Validate allowed image types: JPEG, PNG, and GIF
- Secure password hashing using bcrypt
- Swagger UI for API documentation

## Setup

1. Install dependencies:
   npm install
2. Copy `.env.example` or use the default `.env` file.
3. Set `MONGO_URI` in `.env` to your MongoDB connection string (local or Atlas). For Atlas, ensure your current IP is allowed in Network Access and the database user credentials are valid.
4. Start the server:
   npm start
   The API starts only after MongoDB connects successfully.
5. Open Swagger docs at:
   http://localhost:5000/api-docs

## API Endpoints

- POST /user/create
- POST /user/login
- PUT /user/edit
- DELETE /user/delete
- GET /user/getAll
- POST /user/uploadImage

## Postman

A sample Postman collection is available in `postman_collection.json`.
