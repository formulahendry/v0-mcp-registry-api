import { type NextRequest, NextResponse } from "next/server"
import { ServerServiceV01 } from "../../../src/services/serverServiceV01"

// GET /v0.1/servers - List MCP servers
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const cursor = searchParams.get("cursor") || undefined
    const limitParam = searchParams.get("limit")
    const limit = limitParam ? Number.parseInt(limitParam, 10) : 30
    const search = searchParams.get("search") || undefined
    const updatedSince = searchParams.get("updated_since") || undefined
    const version = searchParams.get("version") || undefined

    if (limit > 100) {
      return NextResponse.json({ error: "Limit cannot exceed 100" }, { status: 400 })
    }

    const result = await ServerServiceV01.getAllServers(cursor, limit, search, updatedSince, version)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching servers:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
