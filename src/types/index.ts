export interface Repository {
  url: string
  source: string
  id: string
  subfolder?: string
}

export interface VersionDetail {
  version: string
  release_date: string
  is_latest: boolean
}

export interface Input {
  description?: string
  is_required?: boolean
  format?: "string" | "number" | "boolean" | "filepath"
  value?: string
  is_secret?: boolean
  default?: string
  choices?: string[]
}

export interface InputWithVariables extends Input {
  variables?: Record<string, Input>
}

export interface PositionalArgument extends InputWithVariables {
  type: "positional"
  value_hint?: string
  is_repeated?: boolean
}

export interface NamedArgument extends InputWithVariables {
  type: "named"
  name: string
  is_repeated?: boolean
}

export type Argument = PositionalArgument | NamedArgument

export interface KeyValueInput extends InputWithVariables {
  name: string
}

export interface Package {
  registry_type?: string
  registry_base_url?: string
  identifier?: string
  version?: string
  file_sha256?: string
  runtime_hint?: string
  runtime_arguments?: Argument[]
  package_arguments?: Argument[]
  environment_variables?: KeyValueInput[]
}

export interface Remote {
  transport_type: "streamable" | "sse"
  url: string
  headers?: KeyValueInput[]
}

export interface Server {
  name: string
  description: string
  status?: "active" | "deprecated"
  repository?: Repository
  version_detail: VersionDetail
  created_at?: string
  updated_at?: string
}

export interface ServerDetail extends Server {
  $schema?: string
  packages?: Package[]
  remotes?: Remote[]
  _meta?: {
    publisher?: Record<string, any>
    "io.modelcontextprotocol.registry"?: {
      id: string
      published_at: string
      updated_at: string
      is_latest: boolean
      release_date: string
    }
    [key: string]: any
  }
}

export interface ServerList {
  servers: ServerDetail[]
  metadata?: {
    next_cursor?: string
    count?: number
    total?: number
    page?: number
    total_pages?: number
    has_next?: boolean
    has_previous?: boolean
  }
}

export interface User {
  id: string
  username: string
  email: string
  password: string
  created_at: string
}

export interface AuthRequest extends Request {
  user?: User
}
