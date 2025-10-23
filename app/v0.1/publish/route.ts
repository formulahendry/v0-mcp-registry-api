import { type NextRequest, NextResponse } from "next/server"
import { ServerServiceV01 } from "../../../src/services/serverServiceV01"
import type { ServerDetail } from "../../../src/types/v0.1"

// POST /v0.1/publish - Publish MCP server
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    
    // Basic authentication check (in a real implementation, verify the JWT token)
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Invalid or expired Registry JWT token" },
        { status: 401 }
      )
    }

    const serverData: ServerDetail = await request.json()
    
    // Basic validation
    if (!serverData.name || !serverData.description || !serverData.version) {
      return NextResponse.json(
        { error: "Missing required fields: name, description, or version" },
        { status: 400 }
      )
    }

    // Validate server name format (reverse-DNS with exactly one slash)
    const namePattern = /^[a-zA-Z0-9.-]+\/[a-zA-Z0-9._-]+$/
    if (!namePattern.test(serverData.name)) {
      return NextResponse.json(
        { error: "Invalid server name format. Must be in reverse-DNS format (e.g., 'io.github.user/weather')" },
        { status: 400 }
      )
    }

    // Validate version is not "latest" or a range
    if (serverData.version === "latest" || 
        /[\^~><=\*x]/.test(serverData.version)) {
      return NextResponse.json(
        { error: "Version must be a specific version, not 'latest' or a range" },
        { status: 400 }
      )
    }

    const result = await ServerServiceV01.publishServer(serverData)
    return NextResponse.json(result, { status: 200 })
  } catch (error) {
    console.error("Error publishing server:", error)
    return NextResponse.json(
      { error: "Failed to publish server" },
      { status: 500 }
    )
  }
}
