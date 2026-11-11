const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'User Management API',
    version: '1.0.0',
    description:
      'REST API for user creation, email/password authentication, profile updates, retrieval, deletion, and image uploads. Full names may contain alphabetic characters and spaces. Passwords must be at least 8 characters and contain an uppercase letter, lowercase letter, digit, and special character.',
  },
  servers: [
    {
      url: 'http://localhost:5000',
      description: 'Local development server',
    },
  ],
  tags: [{ name: 'Users', description: 'User and image management endpoints' }],
  components: {
    schemas: {
      CreateUserRequest: {
        type: 'object',
        required: ['fullName', 'email', 'password'],
        additionalProperties: false,
        properties: {
          fullName: {
            type: 'string',
            pattern: '^[A-Za-z\\s]+$',
            example: 'John Doe',
            description: 'Alphabetic characters and spaces only.',
          },
          email: {
            type: 'string',
            format: 'email',
            example: 'john.doe@example.com',
          },
          password: {
            type: 'string',
            minLength: 8,
            pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$',
            example: 'Password1!',
            description: 'At least 8 characters with uppercase, lowercase, digit, and special character.',
          },
        },
        example: {
          fullName: 'John Doe',
          email: 'john.doe@example.com',
          password: 'Password1!',
        },
      },
      LoginRequest: {
        type: 'object',
        required: ['email', 'password'],
        additionalProperties: false,
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'john.doe@example.com',
          },
          password: {
            type: 'string',
            format: 'password',
            example: 'Password1!',
          },
        },
        example: {
          email: 'john.doe@example.com',
          password: 'Password1!',
        },
      },
      UpdateUserRequest: {
        type: 'object',
        required: ['email'],
        minProperties: 2,
        additionalProperties: false,
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'john.doe@example.com',
            description: 'Identifies the user and cannot be changed.',
          },
          fullName: {
            type: 'string',
            pattern: '^[A-Za-z\\s]+$',
            example: 'John Smith',
          },
          password: {
            type: 'string',
            minLength: 8,
            pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^A-Za-z0-9]).{8,}$',
            example: 'NewPassword2@',
          },
        },
        example: {
          email: 'john.doe@example.com',
          fullName: 'John Smith',
        },
      },
      EmailRequest: {
        type: 'object',
        required: ['email'],
        additionalProperties: false,
        properties: {
          email: {
            type: 'string',
            format: 'email',
            example: 'john.doe@example.com',
          },
        },
      },
      UserSummary: {
        type: 'object',
        required: ['fullName', 'email'],
        properties: {
          fullName: { type: 'string', example: 'John Doe' },
          email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
        },
      },
      StoredUser: {
        type: 'object',
        required: ['fullName', 'email', 'password'],
        properties: {
          fullName: { type: 'string', example: 'John Doe' },
          email: { type: 'string', format: 'email', example: 'john.doe@example.com' },
          password: {
            type: 'string',
            example: '$2b$10$hashedPasswordValue',
            description: 'Bcrypt password hash, never the original password.',
          },
        },
      },
      LoginResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Login successful.' },
          user: { $ref: '#/components/schemas/UserSummary' },
        },
      },
      MessageResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'User created successfully.' },
        },
      },
      ImageUploadResponse: {
        type: 'object',
        properties: {
          message: { type: 'string', example: 'Image uploaded successfully.' },
          filePath: { type: 'string', example: '/images/john-doe-1712345678901.jpg' },
        },
      },
      UserList: {
        type: 'object',
        required: ['users'],
        properties: {
          users: {
            type: 'array',
            items: { $ref: '#/components/schemas/StoredUser' },
          },
        },
      },
      ErrorResponse: {
        type: 'object',
        required: ['error'],
        properties: {
          error: {
            type: 'string',
            example: 'Validation failed.',
          },
        },
      },
    },
  },
};

const swaggerOptions = {
  definition: swaggerDefinition,
  apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(swaggerOptions);

function setupSwagger(app) {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
}

module.exports = setupSwagger;
module.exports.swaggerSpec = swaggerSpec;
