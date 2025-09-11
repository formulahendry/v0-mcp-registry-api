# MCP Server Registry API

Next.js (App Router) API implementing the [Model Context Protocol Server Registry OpenAPI specification](https://github.com/modelcontextprotocol/registry/raw/refs/heads/main/docs/reference/api/openapi.yaml).

## Features

- 🔐 JWT auth (in-memory users for now)
- 📊 Cursor pagination
- ✅ Joi validation per route
- 📚 OpenAPI specification at `/v0/openapi.yaml`
- 🐳 Docker-ready
- 🎯 Fully compliant with MCP Registry API spec

## Quick Start

### Development
```bash
npm install
npm run dev
# Base URL: http://localhost:3000
```

### Production
```bash
npm run build
npm start
```

### Docker
```bash
docker-compose up -d
docker-compose logs -f
```

## API Endpoints

### MCP Registry API (v0) - OpenAPI Compliant
- GET `/v0/servers` - List MCP servers
- GET `/v0/servers/{id}` - Get MCP server details  
- POST `/v0/publish` - Publish MCP server (auth required)
- GET `/v0/openapi.yaml` - OpenAPI specification

### Legacy API (deprecated)
- POST `/api/auth/register`
- POST `/api/auth/login`
- GET `/api/servers`
- GET `/api/servers/[id]`
- POST `/api/publish` (auth required)
- GET `/api/health`
- GET `/api/api-docs`

## Environment Variables
```env
JWT_SECRET=your-super-secret-jwt-key
NODE_ENV=development
```

## Examples

## OpenAPI Specification Compliance

This implementation is fully compliant with the [MCP Server Registry OpenAPI spec](https://github.com/modelcontextprotocol/registry/raw/refs/heads/main/docs/reference/api/openapi.yaml).

### Key Changes from Legacy API:
- **New v0 endpoints**: All new endpoints follow `/v0/*` pattern
- **Updated data models**: Removed `VersionDetail`, simplified `Server` interface
- **Metadata restructure**: `_meta` now uses proper reverse DNS namespacing:
  - `io.modelcontextprotocol.registry/publisher-provided`
  - `io.modelcontextprotocol.registry/official`
- **Simplified pagination**: Removed page-based pagination, cursor-only
- **Status enum**: Only `active` and `deprecated` (removed `beta`)
- **Deterministic server IDs**: Server IDs are now generated deterministically from server names using UUIDv5, ensuring consistency across application restarts

### Specification Highlights:
- **Cursor pagination**: `?cursor=base64_encoded_position&limit=30`
- **Version filtering**: `?version=1.0.2` on server detail endpoint
- **JWT Authentication**: Bearer token for publish endpoint
- **Comprehensive schemas**: Full OpenAPI 3.1.0 specification available

## Example API Usage

### OpenAPI Compliant (v0)

List Servers
```bash
curl http://localhost:3000/v0/servers?limit=10
```

Get Server Details
```bash
curl http://localhost:3000/v0/servers/550e8400-e29b-41d4-a716-446655440000?version=1.0.2
```

Get Deterministic Server ID
```bash
curl "http://localhost:3000/v0/servers/id-lookup?name=io.modelcontextprotocol/filesystem"
```

Publish Server
```bash
curl -X POST http://localhost:3000/v0/publish \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "io.modelcontextprotocol/example",
    "description": "Example MCP server implementation",
    "version": "1.0.0",
    "status": "active",
    "repository": {
      "url": "https://github.com/modelcontextprotocol/example",
      "source": "github",
      "id": "550e8400-e29b-41d4-a716-446655440000"
    },
    "packages": [{
      "registry_type": "npm",
      "registry_base_url": "https://registry.npmjs.org",
      "identifier": "@modelcontextprotocol/server-example",
      "version": "1.0.0"
    }]
  }'
```

### Legacy API (for backwards compatibility)

Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"alice","email":"user@example.com","password":"password123"}'
```

List Servers (Legacy)
```bash
curl http://localhost:3000/api/servers?limit=10
```

## Architecture
```
app/
  v0/                      # OpenAPI compliant endpoints
    servers/route.ts
    servers/[id]/route.ts
    publish/route.ts
    openapi.yaml/route.ts
  api/                     # Legacy endpoints (backwards compatibility)
    auth/login/route.ts
    auth/register/route.ts
    servers/route.ts
    servers/[id]/route.ts
    publish/route.ts
    health/route.ts
    api-docs/route.ts
src/
  services/
  middleware/  
  types/                   # Updated to match OpenAPI spec
```

## Contributing
1. Fork
2. Branch  
3. Code (ensure OpenAPI compliance)
4. Test against specification
5. PR

## License
MIT
