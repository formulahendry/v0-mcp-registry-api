import { v5 as uuidv5 } from "uuid"
import type { ServerDetail, ServerList, ServerResponse } from "../types/v0.1"

// Namespace UUID for generating deterministic server IDs
const MCP_REGISTRY_NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8"

/**
 * Generate deterministic UUID based on server name
 */
const generateServerIdFromName = (serverName: string): string => {
  return uuidv5(serverName, MCP_REGISTRY_NAMESPACE)
}

const generateMockServers = (): Map<string, ServerResponse[]> => {
  const serverMap = new Map<string, ServerResponse[]>()
  
  const serverNames = [
    "io.modelcontextprotocol/filesystem",
    "io.modelcontextprotocol/database",
    "io.modelcontextprotocol/web-scraper",
    "io.modelcontextprotocol/email",
    "io.modelcontextprotocol/calendar",
    "io.modelcontextprotocol/slack",
    "io.modelcontextprotocol/github",
    "io.modelcontextprotocol/brave-search",
    "io.modelcontextprotocol/weather-api",
    "com.example/demo-server",
  ]

  const descriptions = [
    "A powerful server for managing and processing data efficiently",
    "Seamless integration with popular productivity tools and workflows",
    "Advanced automation capabilities for streamlined operations",
    "Real-time data synchronization and collaboration features",
    "Secure and scalable solution for enterprise environments",
  ]

  serverNames.forEach((serverName, idx) => {
    const versions: ServerResponse[] = []
    const numVersions = Math.floor(Math.random() * 3) + 1 // 1-3 versions per server
    
    for (let v = 0; v < numVersions; v++) {
      const version = `${v + 1}.${Math.floor(Math.random() * 5)}.${Math.floor(Math.random() * 10)}`
      const isLatest = v === numVersions - 1
      
      const baseDate = new Date("2024-01-01")
      const randomDays = Math.floor(Math.random() * 300) + (v * 30)
      const publishedDate = new Date(baseDate.getTime() + randomDays * 24 * 60 * 60 * 1000)
      const updatedDate = new Date(publishedDate.getTime() + Math.floor(Math.random() * 10) * 24 * 60 * 60 * 1000)

      const description = descriptions[Math.floor(Math.random() * descriptions.length)]
      const shortName = serverName.split('/')[1]
      
      const server: ServerDetail = {
        name: serverName,
        description: `${description} - ${shortName} integration for MCP.`,
        version,
        title: shortName.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
        repository: {
          url: `https://github.com/modelcontextprotocol/servers`,
          source: "github",
          id: generateServerIdFromName(`repo-${serverName}`),
          ...(idx % 3 === 0 ? { subfolder: `src/${shortName}` } : {}),
        },
        ...(idx % 2 === 0 ? { websiteUrl: `https://modelcontextprotocol.io/${shortName}` } : {}),
        ...(idx % 3 === 0 ? {
          icons: [
            {
              src: `https://example.com/icons/${shortName}.png`,
              mimeType: "image/png" as const,
              sizes: ["48x48", "96x96"],
            }
          ]
        } : {}),
        $schema: "https://static.modelcontextprotocol.io/schemas/2025-10-17/server.schema.json",
        packages: [
          {
            registryType: "npm",
            registryBaseUrl: "https://registry.npmjs.org",
            identifier: `@modelcontextprotocol/server-${shortName}`,
            version,
            transport: { type: "stdio" },
          }
        ],
        ...(idx % 2 === 0 ? {
          remotes: [
            {
              type: "sse" as const,
              url: `https://api.${shortName}.example.com/sse`,
            }
          ]
        } : {}),
        _meta: {
          "io.modelcontextprotocol.registry/publisher-provided": {
            tool: "publisher-cli",
            version: "1.2.3",
            buildInfo: {
              commit: "abc123def456",
              timestamp: updatedDate.toISOString(),
            }
          }
        }
      }

      const response: ServerResponse = {
        server,
        _meta: {
          "io.modelcontextprotocol.registry/official": {
            status: "active",
            publishedAt: publishedDate.toISOString(),
            updatedAt: updatedDate.toISOString(),
            isLatest,
          }
        }
      }

      versions.push(response)
    }

    // Sort versions by published date (newest first)
    versions.sort((a, b) => {
      const dateA = new Date(a._meta["io.modelcontextprotocol.registry/official"]?.publishedAt || 0)
      const dateB = new Date(b._meta["io.modelcontextprotocol.registry/official"]?.publishedAt || 0)
      return dateB.getTime() - dateA.getTime()
    })

    serverMap.set(serverName, versions)
  })

  return serverMap
}

const serversMap: Map<string, ServerResponse[]> = generateMockServers()

export class ServerServiceV01 {
  /**
   * Get all servers with pagination and filtering
   */
  static async getAllServers(
    cursor?: string,
    limit = 30,
    search?: string,
    updatedSince?: string,
    version?: string
  ): Promise<ServerList> {
    // Get all latest versions or filter by version
    let allServers: ServerResponse[] = []
    
    for (const [serverName, versions] of serversMap) {
      if (search && !serverName.toLowerCase().includes(search.toLowerCase())) {
        continue
      }

      if (version) {
        if (version === 'latest') {
          const latest = versions.find(v => v._meta["io.modelcontextprotocol.registry/official"]?.isLatest)
          if (latest) allServers.push(latest)
        } else {
          const specific = versions.find(v => v.server.version === version)
          if (specific) allServers.push(specific)
        }
      } else {
        // By default, return latest version only
        const latest = versions.find(v => v._meta["io.modelcontextprotocol.registry/official"]?.isLatest)
        if (latest) allServers.push(latest)
      }
    }

    // Filter by updatedSince
    if (updatedSince) {
      const sinceDate = new Date(updatedSince)
      allServers = allServers.filter(s => {
        const updatedAt = s._meta["io.modelcontextprotocol.registry/official"]?.updatedAt
        return updatedAt && new Date(updatedAt) >= sinceDate
      })
    }

    // Handle pagination
    let startIndex = 0
    if (cursor) {
      const decodedCursor = Buffer.from(cursor, "base64").toString("ascii")
      startIndex = Number.parseInt(decodedCursor, 10) || 0
    }

    const endIndex = startIndex + limit
    const paginatedServers = allServers.slice(startIndex, endIndex)

    const nextCursor = endIndex < allServers.length 
      ? Buffer.from(endIndex.toString()).toString("base64") 
      : undefined

    const metadata: { nextCursor?: string; count: number } = {
      count: paginatedServers.length,
    }
    
    if (nextCursor) {
      metadata.nextCursor = nextCursor
    }

    return {
      servers: paginatedServers,
      metadata,
    }
  }

  /**
   * Get all versions of a specific server
   */
  static async getServerVersions(serverName: string): Promise<ServerList | null> {
    const versions = serversMap.get(serverName)
    
    if (!versions) {
      return null
    }

    return {
      servers: versions,
      metadata: {
        count: versions.length,
      }
    }
  }

  /**
   * Get a specific version of a server
   */
  static async getServerVersion(serverName: string, version: string): Promise<ServerResponse | null> {
    const versions = serversMap.get(serverName)
    
    if (!versions) {
      return null
    }

    if (version === 'latest') {
      return versions.find(v => v._meta["io.modelcontextprotocol.registry/official"]?.isLatest) || null
    }

    return versions.find(v => v.server.version === version) || null
  }

  /**
   * Publish a new server version
   */
  static async publishServer(serverData: ServerDetail): Promise<ServerResponse> {
    const now = new Date().toISOString()
    
    const response: ServerResponse = {
      server: serverData,
      _meta: {
        "io.modelcontextprotocol.registry/official": {
          status: "active",
          publishedAt: now,
          updatedAt: now,
          isLatest: true,
        },
      },
    }

    // Get existing versions or create new array
    let versions = serversMap.get(serverData.name) || []
    
    // Check if this version already exists
    const existingIndex = versions.findIndex(v => v.server.version === serverData.version)
    
    if (existingIndex !== -1) {
      // Update existing version
      versions[existingIndex] = response
    } else {
      // Mark all other versions as not latest
      versions = versions.map(v => ({
        ...v,
        _meta: {
          ...v._meta,
          "io.modelcontextprotocol.registry/official": {
            ...v._meta["io.modelcontextprotocol.registry/official"]!,
            isLatest: false,
          }
        }
      }))
      
      // Add new version
      versions.push(response)
    }

    serversMap.set(serverData.name, versions)
    
    return response
  }
}
