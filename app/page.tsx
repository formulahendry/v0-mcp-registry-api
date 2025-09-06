import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl mx-auto text-center">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="mb-8">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-4">MCP Server Registry</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover and publish Model Context Protocol (MCP) servers. A centralized registry for finding and sharing
              MCP server implementations with 150+ available servers.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-blue-900 mb-3">Browse Servers</h3>
              <p className="text-blue-700 mb-4">
                Explore 150+ available MCP servers with detailed information about packages, versions, and
                implementations.
              </p>
              <Link
                href="/api/servers"
                className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                View API
              </Link>
            </div>

            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-green-900 mb-3">Publish Servers</h3>
              <p className="text-green-700 mb-4">
                Share your MCP server implementations with the community through our publishing API.
              </p>
              <Link
                href="/api/api-docs"
                className="inline-block bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                API Docs
              </Link>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-6 mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">API Endpoints</h3>
            <div className="grid md:grid-cols-3 gap-4 text-sm">
              <div className="bg-white rounded-lg p-4">
                <code className="text-blue-600 font-mono">GET /api/servers</code>
                <p className="text-gray-600 mt-1">List all servers</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <code className="text-blue-600 font-mono">GET /api/servers/[id]</code>
                <p className="text-gray-600 mt-1">Get server details</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <code className="text-green-600 font-mono">POST /api/publish</code>
                <p className="text-gray-600 mt-1">Publish server</p>
              </div>
            </div>
          </div>

          <div className="bg-indigo-50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-indigo-900 mb-3">Pagination Examples</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-indigo-800 mb-2">Page-based Pagination</h4>
                <code className="text-indigo-600 font-mono text-xs block mb-1">GET /api/servers?page=1&limit=20</code>
                <code className="text-indigo-600 font-mono text-xs block mb-1">GET /api/servers?page=2&limit=20</code>
                <p className="text-gray-600 mt-2">Navigate through pages with page numbers</p>
              </div>
              <div className="bg-white rounded-lg p-4">
                <h4 className="font-semibold text-indigo-800 mb-2">Cursor-based Pagination</h4>
                <code className="text-indigo-600 font-mono text-xs block mb-1">GET /api/servers?limit=20</code>
                <code className="text-indigo-600 font-mono text-xs block mb-1">
                  GET /api/servers?cursor=abc123&limit=20
                </code>
                <p className="text-gray-600 mt-2">Use next_cursor from response for efficient pagination</p>
              </div>
            </div>
            <div className="mt-4 p-4 bg-white rounded-lg">
              <h4 className="font-semibold text-indigo-800 mb-2">Response Metadata</h4>
              <p className="text-gray-600 text-sm">
                All paginated responses include metadata with <code className="text-indigo-600">total</code>,{" "}
                <code className="text-indigo-600">page</code>,<code className="text-indigo-600">total_pages</code>,{" "}
                <code className="text-indigo-600">has_next</code>, and{" "}
                <code className="text-indigo-600">has_previous</code> fields.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
