import { type NextRequest, NextResponse } from "next/server"
import { ServerServiceV01 } from "../../../../../../src/services/serverServiceV01"

// GET /v0.1/servers/{serverName}/versions/{version} - Get specific MCP server version
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ serverName: string; version: string }> }
) {
  try {
    const { serverName, version } = await params
    const decodedServerName = decodeURIComponent(serverName)
    const decodedVersion = decodeURIComponent(version)
    
    const result = await ServerServiceV01.getServerVersion(decodedServerName, decodedVersion)
    
    if (!result) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching server version:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
