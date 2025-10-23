import { type NextRequest, NextResponse } from "next/server"

// POST /api/proxy/servers - Proxy requests to external registry APIs
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { baseUrl, params } = body

    if (!baseUrl) {
      return NextResponse.json({ error: "baseUrl is required" }, { status: 400 })
    }

    // Validate that the URL is a valid HTTP(S) URL
    let targetUrl: URL
    try {
      targetUrl = new URL(`${baseUrl}/servers`)
    } catch {
      return NextResponse.json({ error: "Invalid baseUrl" }, { status: 400 })
    }

    // Add query parameters
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          targetUrl.searchParams.set(key, String(value))
        }
      })
    }

    // Make the request to the external API
    const response = await fetch(targetUrl.toString(), {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "User-Agent": "MCP-Registry-Browser/1.0",
      },
    })

    if (!response.ok) {
      const errorText = await response.text()
      return NextResponse.json(
        { error: `External API error: ${response.statusText}`, details: errorText },
        { status: response.status }
      )
    }

    const data = await response.json()
    
    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "public, max-age=60", // Cache for 1 minute
      },
    })
  } catch (error) {
    console.error("Error proxying request:", error)
    return NextResponse.json(
      { error: "Failed to proxy request", details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    )
  }
}
