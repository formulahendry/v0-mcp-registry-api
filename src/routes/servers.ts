import { Router, type Request, type Response } from "express"
import { ServerService } from "../services/serverService"
import { validateQueryParams, validateServerDetail } from "../middleware/validation"
import { authenticateToken } from "../middleware/auth"
import type { AuthRequest } from "../types"

const router = Router()

// GET /servers - List all servers with pagination
router.get("/", validateQueryParams, async (req: Request, res: Response) => {
  try {
    const { cursor, limit } = req.query as { cursor?: string; limit: number }
    const result = await ServerService.getAllServers(cursor, limit)
    res.json(result)
  } catch (error) {
    console.error("Error fetching servers:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// GET /servers/:id - Get specific server details
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { version } = req.query as { version?: string }

    const server = await ServerService.getServerById(id, version)

    if (!server) {
      return res.status(404).json({ error: "Server not found" })
    }

    res.json(server)
  } catch (error) {
    console.error("Error fetching server:", error)
    res.status(500).json({ error: "Internal server error" })
  }
})

// POST /publish - Publish a new server (requires authentication)
router.post("/publish", authenticateToken, validateServerDetail, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: "Unauthorized" })
    }

    const serverData = req.body
    const publishedServer = await ServerService.publishServer(serverData, req.user.id)

    res.status(200).json(publishedServer)
  } catch (error) {
    console.error("Error publishing server:", error)

    if (error instanceof Error && error.message.includes("permission")) {
      return res.status(403).json({ error: "You do not have permission to publish this server" })
    }

    res.status(500).json({ error: "Failed to publish server" })
  }
})

export default router
