import { type NextRequest, NextResponse } from "next/server"
import { ServerServiceV01 } from "../../../../../src/services/serverServiceV01"

// GET /v0.1/servers/{serverName}/versions - List all versions of an MCP server
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ serverName: string }> }
) {
  try {
    const { serverName } = await params
    const decodedServerName = decodeURIComponent(serverName)
    
    const result = await ServerServiceV01.getServerVersions(decodedServerName)
    
    if (!result) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching server versions:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
