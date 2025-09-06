import { type NextRequest, NextResponse } from "next/server"
import { ServerService } from "../../../src/services/serverService"

// GET /api/servers - List all servers with pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const cursor = searchParams.get("cursor") || undefined
    const limitParam = searchParams.get("limit")
    const limit = limitParam ? Number.parseInt(limitParam, 10) : undefined // undefined -> service default (30)
    const page = searchParams.get("page") ? Number.parseInt(searchParams.get("page")) : undefined

    if (typeof limit === "number" && limit > 100) {
      return NextResponse.json({ error: "Limit cannot exceed 100" }, { status: 400 })
    }

    const result = await ServerService.getAllServers(cursor, limit, page)
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error fetching servers:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
