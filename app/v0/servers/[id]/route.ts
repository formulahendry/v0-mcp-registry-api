import { type NextRequest, NextResponse } from "next/server"
import { ServerService } from "../../../../src/services/serverService"

// GET /v0/servers/{id} - Get MCP server details
export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const searchParams = request.nextUrl.searchParams
    const version = searchParams.get("version") || undefined

    const server = await ServerService.getServerById(id, version)

    if (!server) {
      return NextResponse.json({ error: "Server not found" }, { status: 404 })
    }

    return NextResponse.json(server)
  } catch (error) {
    console.error("Error fetching server:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
