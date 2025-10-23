# API Test Examples

## Using curl (if available)

### Test v0.1 endpoints

```bash
# List all servers (with pagination)
curl http://localhost:3000/v0.1/servers?limit=5

# Search for servers
curl http://localhost:3000/v0.1/servers?search=filesystem

# Filter by version
curl http://localhost:3000/v0.1/servers?version=latest

# Get all versions of a server (URL-encode the server name)
curl "http://localhost:3000/v0.1/servers/io.modelcontextprotocol%2Ffilesystem/versions"

# Get specific version
curl "http://localhost:3000/v0.1/servers/io.modelcontextprotocol%2Ffilesystem/versions/latest"

# Get OpenAPI spec
curl http://localhost:3000/v0.1/openapi.yaml
```

### Test original v0 endpoints (backward compatibility)

```bash
# List servers (original endpoint)
curl http://localhost:3000/v0/servers?limit=5
```

## Using PowerShell

```powershell
# List all servers
Invoke-RestMethod -Uri "http://localhost:3000/v0.1/servers?limit=5"

# Search for servers
Invoke-RestMethod -Uri "http://localhost:3000/v0.1/servers?search=filesystem"

# Get all versions
Invoke-RestMethod -Uri "http://localhost:3000/v0.1/servers/io.modelcontextprotocol%2Ffilesystem/versions"

# Get specific version
Invoke-RestMethod -Uri "http://localhost:3000/v0.1/servers/io.modelcontextprotocol%2Ffilesystem/versions/latest"

# Test original v0 endpoint
Invoke-RestMethod -Uri "http://localhost:3000/v0/servers?limit=5"
```

## Using PowerShell with formatted output

```powershell
# Get servers and display as JSON
Invoke-RestMethod -Uri "http://localhost:3000/v0.1/servers?limit=2" | ConvertTo-Json -Depth 10

# Count servers returned
(Invoke-RestMethod -Uri "http://localhost:3000/v0.1/servers").servers.Count

# Get server names
(Invoke-RestMethod -Uri "http://localhost:3000/v0.1/servers").servers.server.name
```

## Publish a server (requires authentication)

```powershell
$body = @{
    name = "com.example/test-server"
    description = "Test MCP server"
    version = "1.0.0"
    packages = @(
        @{
            registryType = "npm"
            identifier = "@example/test-server"
            version = "1.0.0"
            transport = @{
                type = "stdio"
            }
        }
    )
} | ConvertTo-Json -Depth 10

$headers = @{
    "Authorization" = "Bearer test-token"
    "Content-Type" = "application/json"
}

Invoke-RestMethod -Uri "http://localhost:3000/v0.1/publish" -Method Post -Body $body -Headers $headers
```

## Expected Response Formats

### v0.1 Server List Response
```json
{
  "servers": [
    {
      "server": {
        "name": "io.modelcontextprotocol/filesystem",
        "description": "...",
        "version": "1.0.0",
        "title": "Filesystem",
        "repository": { ... },
        "packages": [ ... ]
      },
      "_meta": {
        "io.modelcontextprotocol.registry/official": {
          "status": "active",
          "publishedAt": "2024-01-01T00:00:00.000Z",
          "updatedAt": "2024-01-01T00:00:00.000Z",
          "isLatest": true
        }
      }
    }
  ],
  "metadata": {
    "count": 1,
    "nextCursor": "MQ=="
  }
}
```

### v0 Server List Response (original format)
```json
{
  "servers": [
    {
      "name": "io.modelcontextprotocol/filesystem",
      "description": "...",
      "version": "1.0.0",
      "status": "active",
      "packages": [ ... ],
      "_meta": { ... }
    }
  ],
  "metadata": {
    "count": 1,
    "next_cursor": "MQ=="
  }
}
```

## Notes

- Server names must be URL-encoded when used in path parameters (e.g., `io.modelcontextprotocol/filesystem` becomes `io.modelcontextprotocol%2Ffilesystem`)
- The `/` in server names is represented as `%2F` in URLs
- The `version` parameter in query strings can be `latest` or a specific version like `1.2.3`
- Authentication for publish endpoint is validated but uses a mock token in development
