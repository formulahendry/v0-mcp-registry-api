import { NextResponse } from "next/server"

const OPENAPI_SPEC_URL = "https://raw.githubusercontent.com/modelcontextprotocol/registry/refs/heads/main/docs/reference/api/openapi.yaml"

// GET /v0.1/openapi.yaml - Fetch the OpenAPI specification
export async function GET() {
  try {
    const response = await fetch(OPENAPI_SPEC_URL)
    
    if (!response.ok) {
      throw new Error(`Failed to fetch OpenAPI spec: ${response.statusText}`)
    }
    
    const yamlContent = await response.text()
    
    return new NextResponse(yamlContent, {
      headers: {
        "Content-Type": "application/yaml",
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      },
    })
  } catch (error) {
    console.error("Error fetching OpenAPI spec:", error)
    return NextResponse.json(
      { error: "Failed to fetch OpenAPI specification" },
      { status: 500 }
    )
  }
}
