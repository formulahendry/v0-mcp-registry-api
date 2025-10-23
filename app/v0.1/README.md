# v0.1 API Implementation

This directory contains the implementation of the v0.1 API endpoints based on the [official MCP Server Registry OpenAPI specification](https://raw.githubusercontent.com/modelcontextprotocol/registry/refs/heads/main/docs/reference/api/openapi.yaml).

## New Endpoints

### GET /v0.1/servers
List all MCP servers with support for:
- **Pagination**: `cursor` and `limit` parameters
- **Search**: `search` parameter for filtering by server name
- **Version filtering**: `version` parameter (use `latest` for latest versions or specific version like `1.2.3`)
- **Date filtering**: `updated_since` parameter (RFC3339 datetime)

**Example:**
```bash
GET /v0.1/servers?limit=10&search=filesystem&version=latest
```

### GET /v0.1/servers/{serverName}/versions
List all versions of a specific MCP server, ordered by publication date (newest first).

**Example:**
```bash
GET /v0.1/servers/io.modelcontextprotocol%2Ffilesystem/versions
```

### GET /v0.1/servers/{serverName}/versions/{version}
Get detailed information about a specific version of an MCP server. Use `latest` to get the latest version.

**Example:**
```bash
GET /v0.1/servers/io.modelcontextprotocol%2Ffilesystem/versions/latest
GET /v0.1/servers/io.modelcontextprotocol%2Ffilesystem/versions/1.0.2
```

### POST /v0.1/publish
Publish a new MCP server or update an existing one.

**Authentication**: Requires Bearer token in Authorization header

**Example:**
```bash
POST /v0.1/publish
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "io.modelcontextprotocol/my-server",
  "description": "My awesome MCP server",
  "version": "1.0.0",
  "packages": [
    {
      "registryType": "npm",
      "identifier": "@myorg/my-server",
      "version": "1.0.0",
      "transport": { "type": "stdio" }
    }
  ]
}
```

### GET /v0.1/openapi.yaml
Fetch the official OpenAPI specification from the MCP registry repository.

## Key Differences from v0 API

1. **Response Format**: 
   - v0.1 uses `ServerResponse` format with separated `server` and `_meta` objects
   - v0 returns flat `ServerDetail` objects

2. **Versioning Support**:
   - v0.1 supports multiple versions per server
   - v0 only tracks single version per server

3. **Field Naming**:
   - v0.1 uses camelCase (e.g., `registryType`, `isLatest`, `publishedAt`)
   - v0 uses snake_case (e.g., `registry_type`, `is_latest`, `published_at`)

4. **Additional Features**:
   - v0.1 supports `icons`, `websiteUrl`, `title` fields
   - v0.1 has more detailed transport configurations
   - v0.1 includes comprehensive input/argument handling

## Backward Compatibility

The original `/v0/servers` endpoints remain unchanged and continue to work with the existing schema and response format.

## Implementation Files

- `app/v0.1/servers/route.ts` - List servers endpoint
- `app/v0.1/servers/[serverName]/versions/route.ts` - List versions endpoint  
- `app/v0.1/servers/[serverName]/versions/[version]/route.ts` - Get specific version endpoint
- `app/v0.1/publish/route.ts` - Publish server endpoint
- `app/v0.1/openapi.yaml/route.ts` - OpenAPI spec endpoint
- `src/services/serverServiceV01.ts` - Service layer for v0.1 API (150+ mock servers)
- `src/types/v0.1.ts` - TypeScript types for v0.1 API
