import { type NextRequest, NextResponse } from "next/server"
import { AuthService } from "../../../../src/services/authService"
import Joi from "joi"

const loginSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
})

// POST /api/auth/login - Login user
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { error, value } = loginSchema.validate(body)
    if (error) {
      return NextResponse.json(
        {
          error: "Validation failed",
          details: error.details.map((d) => d.message),
        },
        { status: 400 },
      )
    }

    const result = await AuthService.login(value.username, value.password)

    if (!result) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
