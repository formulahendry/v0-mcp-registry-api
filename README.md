# MCP Server Registry API

A professional Node.js REST API for the Model Context Protocol (MCP) Server Registry, built with Express.js, TypeScript, and comprehensive validation.

## Features

- 🔐 **JWT Authentication** - Secure user authentication and authorization
- 📊 **Pagination** - Efficient data retrieval with cursor-based pagination
- ✅ **Comprehensive Validation** - Request validation using Joi schemas
- 🛡️ **Security** - Helmet, CORS, rate limiting, and input sanitization
- 📚 **OpenAPI Documentation** - Auto-generated API documentation
- 🚀 **Performance** - Compression, caching, and optimized responses
- 🐳 **Docker Ready** - Containerized deployment with Docker Compose

## Quick Start

### Development

\`\`\`bash
# Install dependencies
npm install

# Start development server
npm run dev

# The API will be available at http://localhost:3001
\`\`\`

### Production

\`\`\`bash
# Build the application
npm run build

# Start production server
npm start
\`\`\`

### Docker

\`\`\`bash
# Build and run with Docker Compose
docker-compose up -d

# View logs
docker-compose logs -f
\`\`\`

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get JWT token

### Servers

- `GET /servers` - List all MCP servers (with pagination)
- `GET /servers/:id` - Get specific server details
- `POST /servers/publish` - Publish a new server (requires authentication)

### Utility

- `GET /health` - Health check endpoint
- `GET /api-docs` - OpenAPI documentation

## Environment Variables

\`\`\`env
PORT=3001
JWT_SECRET=your-super-secret-jwt-key
ALLOWED_ORIGINS=http://localhost:3000,https://yourdomain.com
NODE_ENV=production
\`\`\`

## API Usage Examples

### Register a User

\`\`\`bash
curl -X POST http://localhost:3001/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'
\`\`\`

### List Servers

\`\`\`bash
curl http://localhost:3001/servers?limit=10
\`\`\`

### Get Server Details

\`\`\`bash
curl http://localhost:3001/servers/550e8400-e29b-41d4-a716-446655440000
\`\`\`

### Publish a Server

\`\`\`bash
curl -X POST http://localhost:3001/servers/publish \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "com.example/my-server",
    "description": "My awesome MCP server",
    "version_detail": {
      "version": "1.0.0",
      "release_date": "2024-01-15T10:30:00Z",
      "is_latest": true
    }
  }'
\`\`\`

## Architecture

\`\`\`
src/
├── middleware/          # Express middleware
│   ├── auth.ts         # JWT authentication
│   ├── validation.ts   # Request validation
│   └── rateLimiter.ts  # Rate limiting
├── routes/             # API route handlers
│   ├── auth.ts         # Authentication routes
│   └── servers.ts      # Server management routes
├── services/           # Business logic
│   ├── authService.ts  # Authentication service
│   └── serverService.ts # Server management service
├── types/              # TypeScript type definitions
│   └── index.ts        # Shared types and interfaces
└── server.ts           # Main application entry point
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## License

MIT License - see LICENSE file for details
