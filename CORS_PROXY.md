# CORS Proxy Solution

## Problem
External registry APIs may not have CORS enabled, causing browser-based requests to fail with CORS errors when users try to access registries hosted on different domains.

## Solution
Implemented a backend proxy endpoint that handles requests to external registries server-side, bypassing CORS restrictions.

## Implementation

### 1. Proxy Endpoint
**File**: `app/api/proxy/servers/route.ts`

- **Endpoint**: `POST /api/proxy/servers`
- **Purpose**: Acts as a server-side proxy for registry API calls
- **Features**:
  - Validates the target URL
  - Forwards query parameters
  - Handles errors gracefully
  - Adds caching headers (1-minute cache)
  - Sets proper User-Agent header

**Request Body**:
```json
{
  "baseUrl": "https://external-registry.example.com/v0.1",
  "params": {
    "limit": "30",
    "search": "keyword",
    "version": "latest",
    "cursor": "..."
  }
}
```

### 2. Smart Client Logic
**File**: `app/registry/page.tsx`

The Registry Browser automatically detects whether to use direct calls or the proxy:

- **Local APIs** (localhost, 127.0.0.1): Direct fetch
- **External APIs**: Proxy via `/api/proxy/servers`

### 3. User Experience
- Transparent to users - no configuration needed
- Shows "(via proxy to avoid CORS issues)" indicator for external APIs
- Same functionality regardless of API location

## Benefits

1. **No CORS Issues**: External registries work without CORS configuration
2. **Security**: Server-side validation of URLs
3. **Caching**: 1-minute cache reduces load on external APIs
4. **Error Handling**: Better error messages for network issues
5. **Future-Proof**: Can add rate limiting, authentication, etc.

## Usage Examples

### Direct Call (Local API)
```typescript
// Browser automatically calls:
fetch("http://localhost:3000/v0.1/servers?limit=30")
```

### Proxied Call (External API)
```typescript
// Browser automatically calls:
fetch("/api/proxy/servers", {
  method: "POST",
  body: JSON.stringify({
    baseUrl: "https://registry.modelcontextprotocol.io/v0.1",
    params: { limit: "30" }
  })
})
```

## Testing

Test the proxy endpoint:
```bash
curl -X POST http://localhost:3000/api/proxy/servers \
  -H "Content-Type: application/json" \
  -d '{
    "baseUrl": "http://localhost:3000/v0.1",
    "params": {
      "limit": "5",
      "version": "latest"
    }
  }'
```

## Future Enhancements

Potential improvements:
- Add request rate limiting per IP
- Support authentication tokens for private registries
- Add request/response logging for debugging
- Implement request timeout configuration
- Add support for other endpoints (versions, publish, etc.)
