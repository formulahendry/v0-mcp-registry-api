import { NextResponse } from "next/server"

// GET /api/api-docs - API documentation endpoint
export async function GET() {
  return NextResponse.json({
    openapi: "3.1.0",
    info: {
      title: "MCP Server Registry API",
      version: "2025-07-09",
      description: "API for discovering and accessing MCP server metadata",
    },
    servers: [
      {
        url: "https://v0-node-js-api-from-open-api.vercel.app/api",
        description: "Production server",
      },
    ],
    paths: {
      "/servers": {
        get: {
          summary: "List MCP servers",
          parameters: [
            { name: "cursor", in: "query", schema: { type: "string" } },
            { name: "limit", in: "query", schema: { type: "integer" } },
          ],
        },
      },
      "/servers/{id}": {
        get: {
          summary: "Get MCP server details",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
            { name: "version", in: "query", schema: { type: "string" } },
          ],
        },
      },
      "/publish": {
        post: {
          summary: "Publish MCP server",
          security: [{ bearerAuth: [] }],
        },
      },
    },
  })
}
