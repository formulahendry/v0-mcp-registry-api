import { type NextRequest, NextResponse } from "next/server"
import { ServerService } from "../../../src/services/serverService"
import { AuthService } from "../../../src/services/authService"
import Joi from "joi"

const serverSchema = Joi.object({
  name: Joi.string().required().min(1).max(100),
  description: Joi.string().required().min(1).max(500),
  version: Joi.string()
    .required()
    .pattern(/^\d+\.\d+\.\d+$/),
  sourceUrl: Joi.string().uri().required(),
  category: Joi.string().valid("productivity", "development", "communication", "entertainment", "other"),
  license: Joi.string().required(),
  author: Joi.string().max(100),
  tags: Joi.array().items(Joi.string().max(50)).max(10),
  homepage: Joi.string().uri(),
  repository: Joi.string().uri(),
  documentation: Joi.string().uri(),
})

// POST /api/publish - Publish a new server (requires authentication)
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ error: "Authorization token required" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const user = await AuthService.verifyToken(token)

    if (!user) {
      return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
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

    const publishedServer = await ServerService.publishServer(value, user.id)
    return NextResponse.json(publishedServer, { status: 201 })
  } catch (error) {
    console.error("Error publishing server:", error)

    if (error instanceof Error && error.message.includes("permission")) {
      return NextResponse.json({ error: "You do not have permission to publish this server" }, { status: 403 })
    }

    return NextResponse.json({ error: "Failed to publish server" }, { status: 500 })
  }
}
