import { v5 as uuidv5 } from "uuid"
import type { ServerDetail, ServerList } from "../types"

// Namespace UUID for generating deterministic server IDs
const MCP_REGISTRY_NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8"

/**
 * Generate deterministic UUID based on server name
 * This ensures the same server name always generates the same UUID across application restarts
 */
const generateServerIdFromName = (serverName: string): string => {
  return uuidv5(serverName, MCP_REGISTRY_NAMESPACE)
}

/**
 * Get the deterministic server ID for a given server name
 * This can be used by external clients to predict server IDs
 */
export const getServerIdForName = (serverName: string): string => {
  return generateServerIdFromName(serverName)
}

const generateMockServers = (): ServerDetail[] => {
  const registryTypes = ["npm", "pypi", "docker", "github"]
  const statuses = ["active", "deprecated"]

  const serverNames = [
    "filesystem",
    "database",
    "web-scraper",
    "email",
    "calendar",
    "slack",
    "github",
    "jira",
    "notion",
    "trello",
    "discord",
    "telegram",
    "twitter",
    "reddit",
    "youtube",
    "spotify",
    "aws-s3",
    "gcp-storage",
    "azure-blob",
    "mongodb",
    "postgresql",
    "mysql",
    "redis",
    "elasticsearch",
    "kafka",
    "rabbitmq",
    "docker",
    "kubernetes",
    "terraform",
    "ansible",
    "jenkins",
    "gitlab",
    "bitbucket",
    "confluence",
    "sharepoint",
    "dropbox",
    "google-drive",
    "onedrive",
    "box",
    "figma",
    "sketch",
    "adobe-creative",
    "canva",
    "miro",
    "lucidchart",
    "salesforce",
    "hubspot",
    "zendesk",
    "intercom",
    "freshdesk",
    "servicenow",
    "workday",
    "bamboohr",
    "greenhouse",
    "lever",
    "stripe",
    "paypal",
    "square",
    "quickbooks",
    "xero",
    "freshbooks",
    "wave",
    "mint",
    "ynab",
    "personal-capital",
    "robinhood",
    "coinbase",
    "binance",
    "kraken",
    "gemini",
    "blockfi",
    "celsius",
    "nexo",
    "weather-api",
    "maps",
    "translation",
    "ocr",
    "speech-to-text",
    "text-to-speech",
    "image-recognition",
    "sentiment-analysis",
    "chatgpt",
    "claude",
    "gemini-ai",
    "llama",
    "stable-diffusion",
    "midjourney",
    "dall-e",
    "runway",
    "luma",
    "suno",
    "elevenlabs",
    "replicate",
    "huggingface",
    "openai",
    "anthropic",
    "cohere",
    "together-ai",
    "perplexity",
    "you-com",
    "brave-search",
    "duckduckgo",
    "bing",
    "google-search",
    "wikipedia",
    "wolfram-alpha",
    "arxiv",
    "pubmed",
    "semantic-scholar",
    "jstor",
    "coursera",
    "udemy",
    "khan-academy",
    "duolingo",
    "anki",
    "quizlet",
    "grammarly",
    "hemingway",
    "notion-ai",
    "obsidian",
    "roam-research",
    "logseq",
    "remnote",
    "todoist",
    "any-do",
    "ticktick",
    "things",
    "omnifocus",
    "asana",
    "monday",
    "clickup",
    "linear",
    "height",
    "shortcut",
    "pivotal-tracker",
    "azure-devops",
    "circleci",
    "travis-ci",
    "github-actions",
    "gitlab-ci",
    "buildkite",
    "teamcity",
    "octopus-deploy",
    "spinnaker",
    "argo-cd",
    "flux",
    "helm",
    "kustomize",
    "istio",
    "linkerd",
    "consul",
    "vault",
    "nomad",
    "packer",
    "vagrant",
    "virtualbox",
    "vmware",
    "proxmox",
    "xen",
    "kvm",
    "qemu",
    "parallels",
    "utm",
    "lima",
  ]

  const descriptions = [
    "A powerful server for managing and processing data efficiently",
    "Seamless integration with popular productivity tools and workflows",
    "Advanced automation capabilities for streamlined operations",
    "Real-time data synchronization and collaboration features",
    "Secure and scalable solution for enterprise environments",
    "User-friendly interface with comprehensive API support",
    "High-performance processing with minimal resource usage",
    "Cross-platform compatibility with extensive plugin ecosystem",
    "AI-powered insights and intelligent data processing",
    "Robust security features with enterprise-grade encryption",
  ]

  return Array.from({ length: 150 }, (_, index) => {
    const name = serverNames[index % serverNames.length]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const registryType = registryTypes[Math.floor(Math.random() * registryTypes.length)]
    const description = descriptions[Math.floor(Math.random() * descriptions.length)]
    const version = `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`
    
    // Create full server name
    const fullServerName = `io.modelcontextprotocol/${name}${index > serverNames.length ? `-${Math.floor(index / serverNames.length)}` : ""}`
    
    // Generate deterministic server ID based on the full server name
    const serverId = generateServerIdFromName(fullServerName)

    const baseDate = new Date("2023-01-01")
    const randomDays = Math.floor(Math.random() * 365)
    const createdDate = new Date(baseDate.getTime() + randomDays * 24 * 60 * 60 * 1000)
    const updatedDate = new Date(createdDate.getTime() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)

    // Determine distribution pattern based on index
    const isEvenIndex = index % 2 === 0
    
    // Generate packages array based on index pattern
    const packages = isEvenIndex 
      ? [
          // Primary npm package
          {
            registry_type: "npm" as const,
            registry_base_url: "https://registry.npmjs.org",
            identifier: `@modelcontextprotocol/server-${name}`,
            version,
            transport: { type: "stdio" as const },
          },
          // Secondary Python package
          {
            registry_type: "pypi" as const,
            registry_base_url: "https://pypi.org",
            identifier: `mcp-server-${name}`,
            version,
            transport: { type: "stdio" as const },
          },
        ]
      : [
          // Single package for odd indices
          {
            registry_type: registryType as "npm" | "pypi" | "docker" | "github",
            registry_base_url:
              registryType === "npm"
                ? "https://registry.npmjs.org"
                : registryType === "pypi"
                  ? "https://pypi.org"
                  : registryType === "docker"
                    ? "https://hub.docker.com"
                    : "https://github.com",
            identifier:
              registryType === "npm"
                ? `@modelcontextprotocol/server-${name}`
                : registryType === "pypi"
                  ? `mcp-server-${name}`
                  : registryType === "docker"
                    ? `modelcontextprotocol/${name}-server`
                    : `modelcontextprotocol/${name}-server`,
            version,
            transport: { type: "stdio" as const },
          },
        ]

    // Generate remotes array based on index pattern
    const remotes = isEvenIndex 
      ? [
          // Multiple remotes for even indices
          {
            type: "streamable-http" as const,
            url: `https://api.${name}.example.com/mcp`,
          },
          {
            type: "sse" as const,
            url: `https://api.${name}.example.com/mcp/sse`,
          },
        ]
      : undefined

    const serverData: any = {
      name: fullServerName,
      description: `${description} - ${name} integration for MCP.`,
      status: status as "active" | "deprecated",
      repository: {
        url: `https://github.com/modelcontextprotocol/${name}-server`,
        source: "github" as const,
        id: generateServerIdFromName(`repo-${name}`), // Deterministic repository ID
      },
      version,
      packages,
      created_at: createdDate.toISOString(),
      updated_at: updatedDate.toISOString(),
      _meta: {
        "io.modelcontextprotocol.registry/publisher-provided": {
          tool: "publisher-cli",
          version: "1.2.3",
          build_info: {
            commit: "abc123def456",
            timestamp: updatedDate.toISOString(),
          }
        },
        "io.modelcontextprotocol.registry/official": {
          id: serverId,
          published_at: createdDate.toISOString(),
          updated_at: updatedDate.toISOString(),
          is_latest: true,
        },
      },
    }

    // Add remotes only if they exist
    if (remotes) {
      serverData.remotes = remotes
    }

    return serverData
  })
}

const servers: ServerDetail[] = generateMockServers()

export class ServerService {
  static async getAllServers(cursor?: string, limit = 30, page?: number): Promise<ServerList> {
    let startIndex = 0

    // Handle page-based pagination
    if (page && page > 0) {
      startIndex = (page - 1) * limit
    } else if (cursor) {
      // Handle cursor-based pagination
      const decodedCursor = Buffer.from(cursor, "base64").toString("ascii")
      startIndex = Number.parseInt(decodedCursor, 10) || 0
    }

    const endIndex = startIndex + limit
    const paginatedServers = servers.slice(startIndex, endIndex)

    const nextCursor = endIndex < servers.length ? Buffer.from(endIndex.toString()).toString("base64") : undefined

    const metadata: { next_cursor?: string; count: number } = {
      count: paginatedServers.length,
    }
    
    if (nextCursor) {
      metadata.next_cursor = nextCursor
    }

    return {
      servers: paginatedServers,
      metadata,
    }
  }

  static async getServerById(nameOrId: string, version?: string): Promise<ServerDetail | null> {
    const server = servers.find(
      (s) => s.name === nameOrId || s._meta?.["io.modelcontextprotocol.registry/official"]?.id === nameOrId,
    )

    if (!server) {
      return null
    }

    // If version is specified, filter by version
    if (version && server.version !== version) {
      return null
    }

    return server
  }

  static async publishServer(serverData: ServerDetail): Promise<ServerDetail> {
    const now = new Date().toISOString()
    
    // Generate deterministic server ID based on the server name
    const serverId = generateServerIdFromName(serverData.name)

    const newServer: ServerDetail = {
      ...serverData,
      created_at: now,
      updated_at: now,
      _meta: {
        ...serverData._meta,
        "io.modelcontextprotocol.registry/official": {
          id: serverId,
          published_at: now,
          updated_at: now,
          is_latest: true,
        },
      },
    }

    // Check if server with same name exists
    const existingIndex = servers.findIndex((s) => s.name === serverData.name)

    if (existingIndex !== -1) {
      // Update existing server
      servers[existingIndex] = newServer
    } else {
      // Add new server
      servers.push(newServer)
    }

    return newServer
  }

  static async deleteServer(id: string): Promise<boolean> {
    const index = servers.findIndex((s) => s._meta?.["io.modelcontextprotocol.registry/official"]?.id === id)

    if (index === -1) {
      return false
    }

    servers.splice(index, 1)
    return true
  }
}
