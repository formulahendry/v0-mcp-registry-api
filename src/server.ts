import express from "express"
import cors from "cors"
import helmet from "helmet"
import compression from "compression"
import { rateLimitMiddleware } from "./middleware/rateLimiter"
import serversRouter from "./routes/servers"
import authRouter from "./routes/auth"

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet())
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
    credentials: true,
  }),
)

// Performance middleware
app.use(compression())
app.use(rateLimitMiddleware)

// Body parsing middleware
app.use(express.json({ limit: "10mb" }))
app.use(express.urlencoded({ extended: true }))

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  })
})

// API documentation endpoint
app.get("/api-docs", (req, res) => {
  res.json({
    openapi: "3.1.0",
    info: {
      title: "MCP Server Registry API",
      version: "2025-07-09",
      description: "API for discovering and accessing MCP server metadata",
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: "Development server",
      },
    ],
    paths: {
      "/servers": {
        get: {
          summary: "List MCP servers",
          parameters: [
            { name: "cursor", in: "query", schema: { type: "string" } },
            { name: "limit", in: "query", schema: { type: "integer" } },
          ],
        },
      },
      "/servers/{id}": {
        get: {
          summary: "Get MCP server details",
          parameters: [
            { name: "id", in: "path", required: true, schema: { type: "string" } },
            { name: "version", in: "query", schema: { type: "string" } },
          ],
        },
      },
      "/publish": {
        post: {
          summary: "Publish MCP server",
          security: [{ bearerAuth: [] }],
        },
      },
    },
  })
})

// Routes
app.use("/auth", authRouter)
app.use("/servers", serversRouter)

// Legacy publish endpoint (redirect to /servers/publish)
app.post("/publish", (req, res) => {
  res.redirect(307, "/servers/publish")
})

// 404 handler
app.use("*", (req, res) => {
  res.status(404).json({ error: "Endpoint not found" })
})

// Global error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error("Unhandled error:", err)
  res.status(500).json({ error: "Internal server error" })
})

// Start server
app.listen(PORT, () => {
  console.log(`🚀 MCP Registry API server running on port ${PORT}`)
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`)
  console.log(`🏥 Health Check: http://localhost:${PORT}/health`)
})

export default app
