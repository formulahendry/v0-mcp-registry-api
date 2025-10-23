# MCP Registry Browser

An interactive web UI for browsing and exploring Model Context Protocol (MCP) servers using the v0.1 API.

## Features

### 1. **Custom API Endpoint Configuration**
- Set a custom v0.1 API base URL
- Defaults to `http://localhost:3000/v0.1` for local development
- Can connect to any compatible MCP registry API
- Easy URL switching with apply button

### 2. **Search & Filter**
- **Keyword Search**: Search servers by name with real-time filtering
- **Version Filter**: Toggle to show only latest versions or all versions
- Results update automatically as filters change

### 3. **Server List View**
- **Expandable Cards**: Click any server card to expand and see more details
- **Quick Info**: See key information at a glance:
  - Server title and name
  - Version badge (with "Latest" indicator)
  - Status badges (Active, Deprecated)
  - Publication dates
  - Registry type and source

### 4. **Detailed Server View**
Opens a comprehensive dialog with:
- **Full Description**: Complete server description and purpose
- **Icons**: Display server icons with sizes (if available)
- **Packages**: All package registry information
  - Package identifiers
  - Registry types (npm, pypi, etc.)
  - Registry URLs
  - Transport types
- **Repository Information**:
  - Source code URL
  - Repository source (GitHub, GitLab, etc.)
  - Subfolder path (for monorepos)
  - Repository ID
- **Website Link**: Direct link to server's homepage
- **Remote Endpoints**: SSE and HTTP streaming endpoints
- **Registry Metadata**:
  - Status (active, deprecated, deleted)
  - Publication timestamp
  - Last update timestamp
- **Raw JSON**: View the complete API response

### 5. **Pagination**
- **Load More**: Cursor-based pagination for large result sets
- Loads 30 servers at a time
- Shows loading state during fetch operations

### 6. **Responsive Design**
- Mobile-friendly layout
- Adaptive grid for different screen sizes
- Touch-friendly interactions

## Usage

### Access the Browser

Navigate to `/registry` in your browser:
```
http://localhost:3000/registry
```

### Search for Servers

1. Enter a keyword in the search box (e.g., "filesystem", "github", "slack")
2. Press Enter or click the Search button
3. Results will filter to matching servers

### Filter by Latest Version

- Check the "Show latest versions only" checkbox to see only the most recent version of each server
- Uncheck to see all versions of all servers

### View Server Details

1. Click the "View Details" button on any server card
2. Explore the comprehensive server information in the dialog
3. Click links to visit external resources (repository, website)
4. Expand "View Raw JSON" to see the complete API response

### Connect to Different Registry

1. Enter a new base URL in the "Registry Base URL" field
2. Click "Apply" to switch endpoints
3. Example URLs:
   - Local: `http://localhost:3000/v0.1`
   - Production: `https://api.example.com/v0.1`

## API Endpoints Used

The browser consumes the following v0.1 API endpoints:

- `GET /v0.1/servers?limit={limit}&cursor={cursor}&search={keyword}&version={version}`
  - Lists servers with pagination and filtering
  - Supports search by name
  - Supports version filtering (latest or all)

## Technology Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **shadcn/ui**: High-quality React components
  - Card, Dialog, Button, Input, Badge, Checkbox, Collapsible
- **Lucide React**: Icon library

## Component Structure

```
app/registry/page.tsx
├── Configuration Section
│   └── API endpoint input with apply button
├── Search & Filter Section
│   ├── Keyword search input
│   └── Latest version checkbox
├── Server List
│   ├── Expandable server cards
│   │   ├── Header with title, badges, actions
│   │   └── Expanded view with quick info
│   └── Load more button
└── Server Details Dialog
    ├── Version and status badges
    ├── Description
    ├── Icons
    ├── Packages
    ├── Repository info
    ├── Website link
    ├── Remote endpoints
    ├── Registry metadata
    └── Raw JSON viewer
```

## Development

The browser is a client-side React component that:
1. Fetches data from the v0.1 API
2. Manages state for search, filters, and pagination
3. Renders results in an organized, interactive UI
4. Handles loading and error states gracefully

## Future Enhancements

Potential improvements:
- Advanced filters (registry type, status, date range)
- Server comparison view
- Bookmark/favorite servers
- Export server lists
- Dark mode support
- URL query parameters for shareable search results
