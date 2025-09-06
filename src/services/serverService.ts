import { v4 as uuidv4 } from "uuid"
import type { ServerDetail, ServerList } from "../types"

const generateMockServers = (): ServerDetail[] => {
  const categories = [
    "productivity",
    "development",
    "data",
    "ai",
    "communication",
    "finance",
    "media",
    "security",
    "education",
    "health",
  ]
  const registryTypes = ["npm", "pypi", "docker", "github"]
  const statuses = ["active", "deprecated", "beta"]

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
    const category = categories[Math.floor(Math.random() * categories.length)]
    const status = statuses[Math.floor(Math.random() * statuses.length)]
    const registryType = registryTypes[Math.floor(Math.random() * registryTypes.length)]
    const description = descriptions[Math.floor(Math.random() * descriptions.length)]
    const version = `${Math.floor(Math.random() * 5) + 1}.${Math.floor(Math.random() * 10)}.${Math.floor(Math.random() * 20)}`
    const serverId = uuidv4()

    const baseDate = new Date("2023-01-01")
    const randomDays = Math.floor(Math.random() * 365)
    const createdDate = new Date(baseDate.getTime() + randomDays * 24 * 60 * 60 * 1000)
    const updatedDate = new Date(createdDate.getTime() + Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000)

    return {
      id: serverId,
      name: `io.modelcontextprotocol/${name}${index > serverNames.length ? `-${Math.floor(index / serverNames.length)}` : ""}`,
      description: `${description} - ${name} integration for MCP.`,
      status: status as "active" | "deprecated" | "beta",
      repository: {
        url: `https://github.com/modelcontextprotocol/${name}-server`,
        source: "github" as const,
        id: uuidv4(),
      },
      version_detail: {
        version,
        release_date: updatedDate.toISOString(),
        is_latest: true,
      },
      packages: [
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
        },
      ],
      created_at: createdDate.toISOString(),
      updated_at: updatedDate.toISOString(),
      _meta: {
        publisher: {
          tool: "publisher-cli",
          version: "1.2.3",
        },
        "io.modelcontextprotocol.registry": {
          id: serverId,
          published_at: createdDate.toISOString(),
          updated_at: updatedDate.toISOString(),
          is_latest: true,
          release_date: updatedDate.toISOString(),
        },
      },
    }
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

    return {
      servers: paginatedServers,
      metadata: {
        next_cursor: nextCursor,
        count: paginatedServers.length,
        total: servers.length,
        page: page || Math.floor(startIndex / limit) + 1,
        total_pages: Math.ceil(servers.length / limit),
        has_next: endIndex < servers.length,
        has_previous: startIndex > 0,
      },
    }
  }

  static async getServerById(nameOrId: string, version?: string): Promise<ServerDetail | null> {
    const server = servers.find(
      (s) => s.name === nameOrId || s._meta?.["io.modelcontextprotocol.registry"]?.id === nameOrId,
    )

    if (!server) {
      return null
    }

    // If version is specified, filter by version
    if (version && server.version_detail.version !== version) {
      return null
    }

    return server
  }

  static async publishServer(serverData: ServerDetail, userId: string): Promise<ServerDetail> {
    const now = new Date().toISOString()
    const serverId = uuidv4()

    const newServer: ServerDetail = {
      ...serverData,
      created_at: now,
      updated_at: now,
      _meta: {
        ...serverData._meta,
        "io.modelcontextprotocol.registry": {
          id: serverId,
          published_at: now,
          updated_at: now,
          is_latest: true,
          release_date: serverData.version_detail.release_date,
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
    const index = servers.findIndex((s) => s._meta?.["io.modelcontextprotocol.registry"]?.id === id)

    if (index === -1) {
      return false
    }

    servers.splice(index, 1)
    return true
  }
}
