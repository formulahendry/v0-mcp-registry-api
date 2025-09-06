import { Router, type Request, type Response } from "express"
import Joi from "joi"
import { AuthService } from "../services/authService"

const router = Router()

const authSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
})

// POST /auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { error } = authSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const { email, password } = req.body
    const result = await AuthService.register(email, password)

    res.status(201).json(result)
  } catch (error) {
    console.error("Registration error:", error)

    if (error instanceof Error && error.message === "User already exists") {
      return res.status(409).json({ error: "User already exists" })
    }

    res.status(500).json({ error: "Internal server error" })
  }
})

// POST /auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { error } = authSchema.validate(req.body)
    if (error) {
      return res.status(400).json({ error: error.details[0].message })
    }

    const { email, password } = req.body
    const result = await AuthService.login(email, password)

    res.json(result)
  } catch (error) {
    console.error("Login error:", error)

    if (error instanceof Error && error.message === "Invalid credentials") {
      return res.status(401).json({ error: "Invalid credentials" })
    }

    res.status(500).json({ error: "Internal server error" })
  }
})

export default router
