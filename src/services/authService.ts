import bcrypt from "bcryptjs"
import { v4 as uuidv4 } from "uuid"
import jwt from "jsonwebtoken"
import type { User } from "../types"
import { generateToken } from "../middleware/auth"

// In-memory storage (replace with actual database in production)
const users: User[] = []

export class AuthService {
  static async register(
    username: string,
    email: string,
    password: string,
  ): Promise<{ user: Omit<User, "password">; token: string }> {
    // Check if user already exists
    const existingUser = users.find((u) => u.email === email || u.username === username)
    if (existingUser) {
      throw new Error("User already exists")
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user: User = {
      id: uuidv4(),
      username,
      email,
      password: hashedPassword,
      created_at: new Date().toISOString(),
    }

    users.push(user)

    // Generate token
    const token = generateToken(user)

    return {
      user: { id: user.id, username: user.username, email: user.email, created_at: user.created_at },
      token,
    }
  }

  static async login(
    username: string,
    password: string,
  ): Promise<{ user: Omit<User, "password">; token: string } | null> {
    // Find user by username or email
    const user = users.find((u) => u.username === username || u.email === username)
    if (!user) {
      return null
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      return null
    }

    // Generate token
    const token = generateToken(user)

    return {
      user: { id: user.id, username: user.username, email: user.email, created_at: user.created_at },
      token,
    }
  }

  static async verifyToken(token: string): Promise<Omit<User, "password"> | null> {
    try {
      const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"
      const decoded = jwt.verify(token, JWT_SECRET) as any

      const user = users.find((u) => u.id === decoded.id)
      if (!user) {
        return null
      }

      return { id: user.id, username: user.username, email: user.email, created_at: user.created_at }
    } catch (error) {
      return null
    }
  }
}
