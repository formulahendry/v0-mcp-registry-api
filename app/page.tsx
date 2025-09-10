import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">MCP Server Registry</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover and publish Model Context Protocol (MCP) servers. A fully OpenAPI-compliant registry for finding and sharing
              MCP server implementations with 150+ available servers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Browse Servers</h3>
              <p className="text-blue-700 mb-4">
                Explore 150+ available MCP servers with detailed information about packages, versions, and
                implementations via our OpenAPI-compliant v0 API.
              </p>
              <Link
                href="/v0/servers"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View v0 API
              </Link>
            </div>

            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-green-900 mb-3">API Specification</h3>
              <p className="text-green-700 mb-4">
                View the complete OpenAPI 3.1.0 specification for the MCP Server Registry API with all endpoints and schemas.
              </p>
              <Link
                href="/v0/openapi.yaml"
                className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                OpenAPI Spec
              </Link>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">OpenAPI v0 Endpoints</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded-lg p-4">
                <code className="text-blue-600 font-mono">GET /v0/servers</code>
                <p className="text-gray-600 mt-1">List all servers</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <code className="text-blue-600 font-mono">GET /v0/servers/&#123;id&#125;</code>
                <p className="text-gray-600 mt-1">Get server details</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <code className="text-green-600 font-mono">POST /v0/publish</code>
                <p className="text-gray-600 mt-1">Publish server</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
              <p className="text-yellow-800 text-sm">
                <strong>Legacy API:</strong> Previous <code>/api/*</code> endpoints are still available for backwards compatibility but are deprecated in favor of the OpenAPI-compliant <code>/v0/*</code> endpoints.
              </p>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-indigo-900 mb-3">Cursor-based Pagination</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-indigo-800 mb-2">Basic Request</h4>
                <code className="text-indigo-600 font-mono text-xs block mb-1">GET /v0/servers?limit=30</code>
                <p className="text-gray-600 mt-2">Start with the first page of results</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-indigo-800 mb-2">Next Page</h4>
                <code className="text-indigo-600 font-mono text-xs block mb-1">
                  GET /v0/servers?cursor=abc123&limit=30
                </code>
                <p className="text-gray-600 mt-2">Use next_cursor from previous response</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-indigo-800 mb-2">Response Metadata</h4>
              <p className="text-gray-600 text-sm">
                Responses include metadata with <code className="text-indigo-600">next_cursor</code> and{" "}
                <code className="text-indigo-600">count</code> fields for efficient pagination as specified in the OpenAPI schema.
              </p>
            </div>
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Server Details with Version</h4>
              <code className="text-blue-600 font-mono text-xs block mb-1">
                GET /v0/servers/&#123;server-id&#125;?version=1.0.2
              </code>
              <p className="text-gray-600 text-sm mt-2">
                Optional version parameter to filter server details by specific version
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
