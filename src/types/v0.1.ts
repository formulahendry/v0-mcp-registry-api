// Types for v0.1 API based on the new OpenAPI spec

export interface Repository {
  url: string
  source: string
  id?: string
  subfolder?: string
}

export interface Input {
  description?: string
  isRequired?: boolean
  format?: "string" | "number" | "boolean" | "filepath"
  value?: string
  isSecret?: boolean
  default?: string
  placeholder?: string
  choices?: string[]
}

export interface InputWithVariables extends Input {
  variables?: Record<string, Input>
}

export interface PositionalArgument extends InputWithVariables {
  type: "positional"
  valueHint?: string
  isRepeated?: boolean
}

export interface NamedArgument extends InputWithVariables {
  type: "named"
  name: string
  isRepeated?: boolean
}

export type Argument = PositionalArgument | NamedArgument

export interface KeyValueInput extends InputWithVariables {
  name: string
}

export interface StdioTransport {
  type: "stdio"
}

export interface StreamableHttpTransport {
  type: "streamable-http"
  url: string
  headers?: KeyValueInput[]
}

export interface SseTransport {
  type: "sse"
  url: string
  headers?: KeyValueInput[]
}

export type Transport = StdioTransport | StreamableHttpTransport | SseTransport

export interface Package {
  registryType: string
  registryBaseUrl?: string
  identifier: string
  version?: string
  fileSha256?: string
  runtimeHint?: string
  transport: Transport
  runtimeArguments?: Argument[]
  packageArguments?: Argument[]
  environmentVariables?: KeyValueInput[]
}

export interface Icon {
  src: string
  mimeType?: "image/png" | "image/jpeg" | "image/jpg" | "image/svg+xml" | "image/webp"
  sizes?: string[]
  theme?: "light" | "dark"
}

export interface ServerDetail {
  name: string
  description: string
  version: string
  title?: string
  repository?: Repository
  websiteUrl?: string
  icons?: Icon[]
  $schema?: string
  packages?: Package[]
  remotes?: (StreamableHttpTransport | SseTransport)[]
  _meta?: {
    "io.modelcontextprotocol.registry/publisher-provided"?: Record<string, any>
    [key: string]: any
  }
}

export interface ServerResponse {
  server: ServerDetail
  _meta: {
    "io.modelcontextprotocol.registry/official"?: {
      status: "active" | "deprecated" | "deleted"
      publishedAt: string
      updatedAt: string
      isLatest: boolean
    }
    [key: string]: any
  }
}

export interface ServerList {
  servers: ServerResponse[]
  metadata?: {
    nextCursor?: string
    count?: number
  }
}
