# v0.1 Mock Data Update

## Changes Made

Updated `src/services/serverServiceV01.ts` to generate **150+ mock MCP servers** instead of just 10, matching the scale of the v0 API implementation.

## Implementation Details

### Server Generation
- Generates 150 unique servers using an array of 170+ server names
- Each server can have 1-3 versions
- Server names cycle through the base list and add suffixes for uniqueness (e.g., `filesystem`, `filesystem-2`, `filesystem-3`)

### Server Categories Included

The mock data now includes a comprehensive set of servers across multiple categories:

**Development & DevOps** (30+ servers):
- Version Control: github, gitlab, bitbucket
- CI/CD: jenkins, circleci, travis-ci, github-actions, gitlab-ci
- Container & Orchestration: docker, kubernetes, helm, istio, linkerd
- Infrastructure: terraform, ansible, vagrant, packer, nomad

**Cloud Storage** (15+ servers):
- aws-s3, gcp-storage, azure-blob
- dropbox, google-drive, onedrive, box

**Databases** (10+ servers):
- mongodb, postgresql, mysql, redis
- elasticsearch, kafka, rabbitmq

**AI & ML** (20+ servers):
- LLMs: chatgpt, claude, gemini-ai, llama
- Image: stable-diffusion, midjourney, dall-e
- Audio: elevenlabs, suno
- Platforms: openai, anthropic, cohere, huggingface, replicate

**Productivity** (25+ servers):
- Project Management: jira, notion, trello, asana, monday, linear
- Communication: slack, discord, telegram
- Note-taking: obsidian, roam-research, logseq
- Task Management: todoist, ticktick, things

**Search & Research** (15+ servers):
- brave-search, duckduckgo, bing, google-search
- wikipedia, wolfram-alpha, arxiv, pubmed
- semantic-scholar, jstor

**Learning & Content** (10+ servers):
- coursera, udemy, khan-academy, duolingo
- anki, quizlet, grammarly

**Business & Finance** (15+ servers):
- CRM: salesforce, hubspot
- Support: zendesk, intercom, freshdesk
- Payments: stripe, paypal, square
- Accounting: quickbooks, xero, freshbooks
- Crypto: coinbase, binance, kraken

**Design & Creative** (8+ servers):
- figma, sketch, canva, miro, lucidchart
- adobe-creative

**Virtualization** (10+ servers):
- virtualbox, vmware, proxmox, xen, kvm, qemu, parallels

## Data Characteristics

Each generated server includes:
- **Unique name** in reverse-DNS format (e.g., `io.modelcontextprotocol/filesystem-2`)
- **Multiple versions**: 1-3 versions per server with semantic versioning
- **Realistic timestamps**: Published and updated dates spanning 2024
- **Repository metadata**: GitHub URL, source type, deterministic ID
- **Package information**: NPM registry details with stdio transport
- **Conditional features**:
  - ~50% have website URLs
  - ~33% have icons with size specifications
  - ~50% have SSE remote endpoints
- **Version tracking**: Each version marked as `isLatest: true/false`

## Query Performance

With 150 servers × 1-3 versions each, the service manages approximately **225-450 server versions** total, providing:
- Realistic pagination testing
- Version filtering capabilities
- Search functionality across a large dataset
- Cursor-based navigation

## Comparison with v0 API

| Aspect | v0 API | v0.1 API |
|--------|--------|----------|
| Total Servers | 150 | 150 |
| Versions per Server | 1 (implicit) | 1-3 (explicit) |
| Total Versions | ~150 | ~225-450 |
| Version Tracking | No | Yes |
| Server Name Format | `io.modelcontextprotocol/name-N` | `io.modelcontextprotocol/name-N` |

Both APIs now provide the same scale of mock data for testing and demonstration purposes.
