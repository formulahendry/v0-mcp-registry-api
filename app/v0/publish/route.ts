import { type NextRequest, NextResponse } from "next/server"
import { ServerService } from "../../../src/services/serverService"
import { AuthService } from "../../../src/services/authService"
import Joi from "joi"

// Define server schema based on OpenAPI spec
const serverSchema = Joi.object({
  name: Joi.string().required().description("Reverse DNS name of the MCP server"),
  description: Joi.string().required().description("Human-readable description of the server's functionality"),
  status: Joi.string().valid("active", "deprecated").default("active"),
  repository: Joi.object({
    url: Joi.string().uri().required(),
    source: Joi.string().required(),
    id: Joi.string().required(),
    subfolder: Joi.string().optional()
  }).optional(),
  version: Joi.string().required().description("Version string for this server"),
  packages: Joi.array().items(
    Joi.object({
      registry_type: Joi.string().optional(),
      registry_base_url: Joi.string().uri().optional(),
      identifier: Joi.string().optional(),
      version: Joi.string().optional(),
      file_sha256: Joi.string().optional(),
      runtime_hint: Joi.string().optional(),
      runtime_arguments: Joi.array().items(Joi.object()).optional(),
      package_arguments: Joi.array().items(Joi.object()).optional(),
      environment_variables: Joi.array().items(Joi.object()).optional()
    })
  ).optional(),
  remotes: Joi.array().items(
    Joi.object({
      transport_type: Joi.string().valid("streamable", "sse").required(),
      url: Joi.string().uri().required(),
      headers: Joi.array().items(Joi.object()).optional()
    })
  ).optional(),
  _meta: Joi.object().optional()
})

// POST /v0/publish - Publish MCP server
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Invalid or missing authentication token" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const user = await AuthService.verifyToken(token)

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired Registry JWT token" }, { status: 401 })
    }

    const body = await request.json()

    const { error, value } = serverSchema.validate(body)
    if (error) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.details.map((d) => d.message),
        },
        { status: 400 },
      )
    }

    const publishedServer = await ServerService.publishServer(value)
    return NextResponse.json(publishedServer, { status: 200 })
  } catch (error) {
    console.error("Error publishing server:", error)

    if (error instanceof Error && error.message.includes("permission")) {
      return NextResponse.json({ error: "You do not have permission to publish this server" }, { status: 403 })
    }

    return NextResponse.json({ error: "Failed to publish server" }, { status: 500 })
  }
}
