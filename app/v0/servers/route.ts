import { type NextRequest, NextResponse } from "next/server"
import { ServerService } from "../../../src/services/serverService"

// GET /v0/servers - List MCP servers
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const cursor = searchParams.get("cursor") || undefined
    const limitParam = searchParams.get("limit")
    const limit = limitParam ? Number.parseInt(limitParam, 10) : 30

    if (limit > 100) {
      return NextResponse.json({ error: "Limit cannot exceed 100" }, { status: 400 })
    }

    const result = await ServerService.getAllServers(cursor, limit)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching servers:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
