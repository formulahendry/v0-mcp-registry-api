import { NextResponse } from "next/server"
import { getServerIdForName } from "../../../../src/services/serverService"

// GET /v0/servers/id-lookup?name=server-name - Get deterministic server ID for a given name
export async function GET(request: Request) {
  try {
    const url = new URL(request.url)
    const serverName = url.searchParams.get("name")

    if (!serverName) {
      return NextResponse.json({ error: "Server name is required" }, { status: 400 })
    }

    const serverId = getServerIdForName(serverName)

    return NextResponse.json({
      serverName,
      serverId,
      note: "This ID is deterministic and will always be the same for this server name"
    })
  } catch (error) {
    console.error("Error getting server ID:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
