"use client"

import { useState, useEffect } from "react"
import { Search, ExternalLink, Package, GitBranch, Calendar, Globe, FileCode, ChevronDown, ChevronUp } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

interface Icon {
  src: string
  mimeType?: string
  sizes?: string[]
  theme?: string
}

interface Repository {
  url: string
  source: string
  id?: string
  subfolder?: string
}

interface Package {
  registryType: string
  registryBaseUrl?: string
  identifier: string
  version?: string
  transport: {
    type: string
  }
}

interface ServerDetail {
  name: string
  description: string
  version: string
  title?: string
  repository?: Repository
  websiteUrl?: string
  icons?: Icon[]
  packages?: Package[]
  remotes?: any[]
  _meta?: any
}

interface ServerResponse {
  server: ServerDetail
  _meta: {
    "io.modelcontextprotocol.registry/official"?: {
      status: string
      publishedAt: string
      updatedAt: string
      isLatest: boolean
    }
  }
}

interface ServerList {
  servers: ServerResponse[]
  metadata?: {
    nextCursor?: string
    count?: number
  }
}

export default function RegistryBrowser() {
  const [baseUrl, setBaseUrl] = useState("http://localhost:3000/v0.1")
  const [customUrl, setCustomUrl] = useState("")
  const [searchKeyword, setSearchKeyword] = useState("")
  const [latestOnly, setLatestOnly] = useState(true)
  const [servers, setServers] = useState<ServerResponse[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedServer, setSelectedServer] = useState<ServerResponse | null>(null)
  const [expandedServers, setExpandedServers] = useState<Set<string>>(new Set())
  const [currentCursor, setCurrentCursor] = useState<string | undefined>()
  const [hasMore, setHasMore] = useState(false)

  const fetchServers = async (cursor?: string, append = false) => {
    setLoading(true)
    setError(null)

    try {
      const url = new URL(`${baseUrl}/servers`)
      url.searchParams.set("limit", "30")
      if (searchKeyword) {
        url.searchParams.set("search", searchKeyword)
      }
      if (latestOnly) {
        url.searchParams.set("version", "latest")
      }
      if (cursor) {
        url.searchParams.set("cursor", cursor)
      }

      const response = await fetch(url.toString())
      
      if (!response.ok) {
        throw new Error(`Failed to fetch servers: ${response.statusText}`)
      }

      const data = await response.json() as ServerList
      
      if (append) {
        setServers((prev) => [...prev, ...data.servers])
      } else {
        setServers(data.servers)
      }
      
      setCurrentCursor(data.metadata?.nextCursor)
      setHasMore(!!data.metadata?.nextCursor)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setServers([])
    } finally {
      setLoading(false)
    }
  }

  const loadMore = () => {
    if (currentCursor && !loading) {
      fetchServers(currentCursor, true)
    }
  }

  const toggleServerExpansion = (serverName: string) => {
    setExpandedServers((prev) => {
      const next = new Set(prev)
      if (next.has(serverName)) {
        next.delete(serverName)
      } else {
        next.add(serverName)
      }
      return next
    })
  }

  const applyCustomUrl = () => {
    if (customUrl.trim()) {
      setBaseUrl(customUrl.trim())
    }
  }

  useEffect(() => {
    fetchServers()
  }, [baseUrl, searchKeyword, latestOnly])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">MCP Registry Browser</h1>
        <p className="text-muted-foreground">
          Browse and search Model Context Protocol servers (v0.1 API)
        </p>
      </div>

      {/* Configuration Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>Configure the registry API endpoint</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="custom-url">Registry Base URL</Label>
              <Input
                id="custom-url"
                placeholder="http://localhost:3000/v0.1"
                value={customUrl}
                onChange={(e) => setCustomUrl((e.target as HTMLInputElement).value)}
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => e.key === "Enter" && applyCustomUrl()}
              />
            </div>
            <div className="flex items-end">
              <Button onClick={applyCustomUrl}>Apply</Button>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">
            Current endpoint: <code className="bg-muted px-1 py-0.5 rounded">{baseUrl}</code>
          </div>
        </CardContent>
      </Card>

      {/* Search and Filter Section */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search & Filter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search servers by name..."
                value={searchKeyword}
                onChange={(e) => setSearchKeyword((e.target as HTMLInputElement).value)}
                className="pl-10"
              />
            </div>
            <Button
              variant="outline"
              onClick={() => fetchServers()}
              disabled={loading}
            >
              Search
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox
              id="latest-only"
              checked={latestOnly}
              onCheckedChange={(checked: boolean) => setLatestOnly(checked as boolean)}
            />
            <Label
              htmlFor="latest-only"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
            >
              Show latest versions only
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="mb-6 border-destructive">
          <CardContent className="pt-6">
            <p className="text-destructive">Error: {error}</p>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {loading && servers.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Loading servers...</p>
        </div>
      )}

      {/* Server List */}
      {!loading && servers.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No servers found</p>
        </div>
      )}

      <div className="space-y-4">
        {servers.map((serverResponse) => {
          const { server } = serverResponse
          const metadata = serverResponse._meta["io.modelcontextprotocol.registry/official"]
          const isExpanded = expandedServers.has(server.name)

          return (
            <Card key={`${server.name}-${server.version}`} className="overflow-hidden">
              <CardHeader className="cursor-pointer" onClick={() => toggleServerExpansion(server.name)}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl truncate">
                        {server.title || server.name.split("/")[1]}
                      </CardTitle>
                      {metadata?.isLatest && (
                        <Badge variant="default" className="shrink-0">Latest</Badge>
                      )}
                      <Badge variant="outline" className="shrink-0">v{server.version}</Badge>
                      {metadata?.status === "deprecated" && (
                        <Badge variant="destructive" className="shrink-0">Deprecated</Badge>
                      )}
                    </div>
                    <CardDescription className="text-sm mb-2">
                      {server.name}
                    </CardDescription>
                    <p className="text-sm line-clamp-2">{server.description}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e: React.MouseEvent) => {
                        e.stopPropagation()
                        setSelectedServer(serverResponse)
                      }}
                    >
                      View Details
                    </Button>
                    {isExpanded ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CardHeader>

              {isExpanded && (
                <CardContent className="pt-0 border-t">
                  <div className="grid gap-4 pt-4">
                    {/* Quick Info */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {metadata?.publishedAt && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Published</p>
                            <p>{formatDate(metadata.publishedAt)}</p>
                          </div>
                        </div>
                      )}
                      {server.packages && server.packages.length > 0 && (
                        <div className="flex items-center gap-2 text-sm">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Registry</p>
                            <p>{server.packages[0].registryType}</p>
                          </div>
                        </div>
                      )}
                      {server.repository && (
                        <div className="flex items-center gap-2 text-sm">
                          <GitBranch className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Source</p>
                            <p>{server.repository.source}</p>
                          </div>
                        </div>
                      )}
                      {server.websiteUrl && (
                        <div className="flex items-center gap-2 text-sm">
                          <Globe className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="text-xs text-muted-foreground">Website</p>
                            <a
                              href={server.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline flex items-center gap-1"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Visit <ExternalLink className="h-3 w-3" />
                            </a>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Packages */}
                    {server.packages && server.packages.length > 0 && (
                      <div>
                        <h4 className="font-semibold mb-2 text-sm">Packages</h4>
                        <div className="space-y-2">
                          {server.packages.map((pkg, idx) => (
                            <div key={idx} className="bg-muted p-3 rounded-md text-sm">
                              <div className="flex items-center justify-between mb-1">
                                <code className="text-xs font-mono">{pkg.identifier}</code>
                                <Badge variant="outline" className="text-xs">
                                  {pkg.registryType}
                                </Badge>
                              </div>
                              <p className="text-xs text-muted-foreground">
                                Transport: {pkg.transport.type}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Repository */}
                    {server.repository && (
                      <div>
                        <h4 className="font-semibold mb-2 text-sm">Repository</h4>
                        <a
                          href={server.repository.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          {server.repository.url} <ExternalLink className="h-3 w-3" />
                        </a>
                        {server.repository.subfolder && (
                          <p className="text-xs text-muted-foreground mt-1">
                            Subfolder: {server.repository.subfolder}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              )}
            </Card>
          )
        })}
      </div>

      {/* Load More */}
      {hasMore && (
        <div className="mt-6 text-center">
          <Button onClick={loadMore} disabled={loading} variant="outline">
            {loading ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}

      {/* Server Details Dialog */}
      <Dialog open={!!selectedServer} onOpenChange={() => setSelectedServer(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedServer?.server.title || selectedServer?.server.name.split("/")[1]}
            </DialogTitle>
            <DialogDescription>{selectedServer?.server.name}</DialogDescription>
          </DialogHeader>

          {selectedServer && (
            <div className="space-y-6">
              {/* Version and Status */}
              <div className="flex gap-2">
                <Badge variant="outline">v{selectedServer.server.version}</Badge>
                {selectedServer._meta["io.modelcontextprotocol.registry/official"]?.isLatest && (
                  <Badge variant="default">Latest</Badge>
                )}
                {selectedServer._meta["io.modelcontextprotocol.registry/official"]?.status === "deprecated" && (
                  <Badge variant="destructive">Deprecated</Badge>
                )}
              </div>

              {/* Description */}
              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">{selectedServer.server.description}</p>
              </div>

              {/* Icons */}
              {selectedServer.server.icons && selectedServer.server.icons.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Icons</h3>
                  <div className="flex gap-4">
                    {selectedServer.server.icons.map((icon, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-2">
                        <img
                          src={icon.src}
                          alt="Server icon"
                          className="w-16 h-16 object-contain border rounded"
                          onError={(e) => {
                            (e.currentTarget as HTMLImageElement).style.display = "none"
                          }}
                        />
                        {icon.sizes && (
                          <p className="text-xs text-muted-foreground">{icon.sizes.join(", ")}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Packages */}
              {selectedServer.server.packages && selectedServer.server.packages.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Packages</h3>
                  <div className="space-y-3">
                    {selectedServer.server.packages.map((pkg, idx) => (
                      <div key={idx} className="bg-muted p-4 rounded-md">
                        <div className="flex items-center justify-between mb-2">
                          <code className="text-sm font-mono font-semibold">{pkg.identifier}</code>
                          <Badge variant="outline">{pkg.registryType}</Badge>
                        </div>
                        {pkg.version && (
                          <p className="text-sm text-muted-foreground mb-1">Version: {pkg.version}</p>
                        )}
                        {pkg.registryBaseUrl && (
                          <p className="text-sm text-muted-foreground mb-1">
                            Registry: {pkg.registryBaseUrl}
                          </p>
                        )}
                        <p className="text-sm text-muted-foreground">Transport: {pkg.transport.type}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Repository */}
              {selectedServer.server.repository && (
                <div>
                  <h3 className="font-semibold mb-2">Repository</h3>
                  <div className="bg-muted p-4 rounded-md space-y-2">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">URL</p>
                      <a
                        href={selectedServer.server.repository.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                      >
                        {selectedServer.server.repository.url} <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Source</p>
                      <p className="text-sm">{selectedServer.server.repository.source}</p>
                    </div>
                    {selectedServer.server.repository.subfolder && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Subfolder</p>
                        <p className="text-sm font-mono">{selectedServer.server.repository.subfolder}</p>
                      </div>
                    )}
                    {selectedServer.server.repository.id && (
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Repository ID</p>
                        <p className="text-sm font-mono">{selectedServer.server.repository.id}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Website */}
              {selectedServer.server.websiteUrl && (
                <div>
                  <h3 className="font-semibold mb-2">Website</h3>
                  <a
                    href={selectedServer.server.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1"
                  >
                    {selectedServer.server.websiteUrl} <ExternalLink className="h-4 w-4" />
                  </a>
                </div>
              )}

              {/* Remotes */}
              {selectedServer.server.remotes && selectedServer.server.remotes.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Remote Endpoints</h3>
                  <div className="space-y-2">
                    {selectedServer.server.remotes.map((remote: any, idx: number) => (
                      <div key={idx} className="bg-muted p-3 rounded-md">
                        <div className="flex items-center justify-between mb-1">
                          <code className="text-sm font-mono">{remote.url}</code>
                          <Badge variant="outline" className="text-xs">
                            {remote.type}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Metadata */}
              {selectedServer._meta["io.modelcontextprotocol.registry/official"] && (
                <div>
                  <h3 className="font-semibold mb-2">Registry Metadata</h3>
                  <div className="bg-muted p-4 rounded-md space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Status:</span>
                      <span className="font-medium">
                        {selectedServer._meta["io.modelcontextprotocol.registry/official"].status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Published:</span>
                      <span className="font-medium">
                        {formatDate(selectedServer._meta["io.modelcontextprotocol.registry/official"].publishedAt)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Updated:</span>
                      <span className="font-medium">
                        {formatDate(selectedServer._meta["io.modelcontextprotocol.registry/official"].updatedAt)}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Raw JSON */}
              <Collapsible>
                <CollapsibleTrigger asChild>
                  <Button variant="outline" className="w-full">
                    <FileCode className="h-4 w-4 mr-2" />
                    View Raw JSON
                  </Button>
                </CollapsibleTrigger>
                <CollapsibleContent className="mt-2">
                  <pre className="bg-muted p-4 rounded-md text-xs overflow-x-auto">
                    {JSON.stringify(selectedServer, null, 2)}
                  </pre>
                </CollapsibleContent>
              </Collapsible>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
