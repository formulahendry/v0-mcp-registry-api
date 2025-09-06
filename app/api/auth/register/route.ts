import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "../../../../src/services/authService"
import Joi from "joi"

const registerSchema = Joi.object({
  username: Joi.string().alphanum().min(3).max(30).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
})

// POST /api/auth/register - Register a new user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { error, value } = registerSchema.validate(body)
    if (error) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.details.map((d) => d.message),
        },
        { status: 400 },
      )
    }

    const result = await AuthService.register(value.username, value.email, value.password)
    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)

    if (error instanceof Error && error.message.includes("already exists")) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
