import { NextResponse } from "next/server"

// GET /v0/openapi.yaml - Return the OpenAPI specification
export async function GET() {
  const openApiSpec = `openapi: 3.1.0
jsonSchemaDialect: "https://json-schema.org/draft/2020-12/schema"
$id: https://modelcontextprotocol.io/schemas/draft/2025-07-09/server-registry-openapi
info:
  title: MCP Server Registry API
  version: "2025-07-09"
  summary: API for discovering and accessing MCP server metadata
  description: |
    Specification for a theoretical REST API that serves up metadata about MCP servers.
  license:
    name: MIT
    identifier: MIT

paths:
  /v0/servers:
    get:
      summary: List MCP servers
      description: Returns a list of all registered MCP servers
      parameters:
        - name: cursor
          in: query
          description: Pagination cursor for retrieving next set of results
          required: false
          schema:
            type: string
        - name: limit
          in: query
          description: Maximum number of items to return
          required: false
          schema:
            type: integer
            default: 30
            maximum: 100
      responses:
        '200':
          description: A list of MCP servers
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ServerList'
  /v0/servers/{id}:
    get:
      summary: Get MCP server details
      description: Returns detailed information about a specific MCP server
      parameters:
        - name: id
          in: path
          required: true
          description: Unique ID of the server
          schema:
            type: string
            format: uuid
        - name: version
          in: query
          description: Desired MCP server version
          schema:
            type: string
      responses:
        '200':
          description: Detailed server information
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ServerDetail'
        '404':
          description: Server not found
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: "Server not found"
  /v0/publish:
    post:
      summary: Publish MCP server (Optional)
      description: |
        Publish a new MCP server to the registry or update an existing one.
        
        **Note**: This endpoint is optional for registry implementations. Read-only registries
        may not provide this functionality.
        
        Authentication mechanism is registry-specific and may vary between implementations.
      security:
        - bearerAuth: []
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/ServerDetail'
      responses:
        '200':
          description: Successfully published server
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ServerDetail'
        '401':
          description: Unauthorized - Invalid or missing authentication token
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: "Invalid or expired Registry JWT token"
        '403':
          description: Forbidden - Insufficient permissions
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: "You do not have permission to publish this server"
        '500':
          description: Internal server error
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: string
                    example: "Failed to publish server"

components:
  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
      description: |
        Registry-specific authentication token. The authentication mechanism and token format may vary
        between registry implementations.
        
        Some registries may use JWT tokens, others may use API keys or OAuth. Consult your specific registry's
        authentication documentation.
  
  schemas:
    Repository:
      type: object
      required:
        - url
        - source
        - id
      properties:
        url:
          type: string
          format: uri
          example: "https://github.com/modelcontextprotocol/servers"
        source:
          type: string
          example: "github"
        id:
          type: string
          example: "b94b5f7e-c7c6-d760-2c78-a5e9b8a5b8c9"
        subfolder:
          type: string
          description: "Optional relative path from repository root to the server location within a monorepo structure"
          example: "src/everything"

    Server:
      type: object
      required:
        - name
        - description
        - version
      properties:
        name:
          type: string
          description: "Reverse DNS name of the MCP server"
          example: "io.github.modelcontextprotocol/filesystem"
        description:
          type: string
          description: "Human-readable description of the server's functionality"
          example: "Node.js server implementing Model Context Protocol (MCP) for filesystem operations."
        status:
          type: string
          enum: [active, deprecated]
          default: active
          description: "Server lifecycle status. 'deprecated' indicates the server is no longer recommended for new usage."
          example: "active"
        repository:
          $ref: '#/components/schemas/Repository'
        version:
          type: string
          example: "1.0.2"
          description: "Version string for this server. SHOULD follow semantic versioning (e.g., '1.0.2', '2.1.0-alpha'). Equivalent of Implementation.version in MCP specification."
        created_at:
          type: string
          format: date-time
        updated_at:
          type: string
          format: date-time

    ServerList:
      type: object
      required:
        - servers
      properties:
        servers:
          type: array
          items:
            $ref: '#/components/schemas/ServerDetail'
        metadata:
          type: object
          properties:
            next_cursor:
              type: string
              description: Cursor for next page of results
            count:
              type: integer
              description: Number of items in current page
              example: 30

    ServerDetail:
      description: Schema for a static representation of an MCP server. Used in various contexts related to discovery, installation, and configuration.
      allOf:
        - $ref: '#/components/schemas/Server'
        - type: object
          properties:
            $schema:
              type: string
              format: uri
              description: JSON Schema URI for this server.json format
              example: "https://static.modelcontextprotocol.io/schemas/2025-07-09/server.schema.json"
            packages:
              type: array
              items:
                $ref: '#/components/schemas/Package'
            remotes:
              type: array
              items:
                $ref: '#/components/schemas/Remote'
            _meta:
              type: object
              description: Extension metadata using reverse DNS namespacing
              properties:
                io.modelcontextprotocol.registry/publisher-provided:
                  type: object
                  description: Publisher-specific metadata and build information
                  additionalProperties: true
                io.modelcontextprotocol.registry/official:
                  type: object
                  description: Registry-specific metadata managed by the MCP registry system
                  required:
                    - id
                    - published_at
                    - updated_at
                    - is_latest
                  properties:
                    id:
                      type: string
                      format: uuid
                      description: Unique registry identifier for this server entry
                      example: "550e8400-e29b-41d4-a716-446655440000"
                    published_at:
                      type: string
                      format: date-time
                      description: Timestamp when the server was first published to the registry
                      example: "2023-12-01T10:30:00Z"
                    updated_at:
                      type: string
                      format: date-time
                      description: Timestamp when the server entry was last updated
                      example: "2023-12-01T11:00:00Z"
                    is_latest:
                      type: boolean
                      description: Whether this is the latest version of the server
                      example: true
                  additionalProperties: false
              additionalProperties: true

    Package:
      type: object
      properties:
        registry_type:
          type: string
          description: Registry type indicating how to download packages
          examples: ["npm", "pypi", "oci", "nuget", "mcpb"]
        registry_base_url:
          type: string
          format: uri
          description: Base URL of the package registry
          examples: ["https://registry.npmjs.org", "https://pypi.org"]
        identifier:
          type: string
          description: Package identifier
          example: "@modelcontextprotocol/server-brave-search"
        version:
          type: string
          description: Package version
          example: "1.0.2"

    Remote:
      type: object
      required:
        - transport_type
        - url
      properties:
        transport_type:
          type: string
          enum: [streamable, sse]
          description: Transport protocol type
          example: "sse"
        url:
          type: string
          format: uri
          description: Remote server URL
          example: "https://mcp-fs.example.com/sse"
`

  return new NextResponse(openApiSpec, {
    headers: {
      'Content-Type': 'application/x-yaml',
    },
  })
}
