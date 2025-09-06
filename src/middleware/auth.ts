import jwt from "jsonwebtoken"
import type { User } from "../types"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"

export const generateToken = (user: User): string => {
  return jwt.sign({ id: user.id, username: user.username, email: user.email }, JWT_SECRET, { expiresIn: "24h" })
}

export const verifyToken = (token: string): Promise<Omit<User, "password"> | null> => {
  return new Promise((resolve) => {
    jwt.verify(token, JWT_SECRET, (err: any, decoded: any) => {
      if (err) {
        resolve(null)
      } else {
        resolve(decoded as Omit<User, "password">)
      }
    })
  })
}

// Legacy Express middleware (kept for compatibility)
export const authenticateToken = (req: any, res: any, next: any) => {
  const authHeader = req.headers["authorization"]
  const token = authHeader && authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({ error: "Invalid or expired Registry JWT token" })
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(401).json({ error: "Invalid or expired Registry JWT token" })
    }
    req.user = user as User
    next()
  })
}
