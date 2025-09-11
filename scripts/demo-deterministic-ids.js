#!/usr/bin/env node

// Demonstration script showing deterministic server ID generation
// This can be run independently to verify ID consistency

const { v5: uuidv5 } = require('uuid');

const MCP_REGISTRY_NAMESPACE = "6ba7b810-9dad-11d1-80b4-00c04fd430c8";

function generateServerIdFromName(serverName) {
  return uuidv5(serverName, MCP_REGISTRY_NAMESPACE);
}

// Test server names
const testServers = [
  "io.modelcontextprotocol/filesystem",
  "io.modelcontextprotocol/database", 
  "io.modelcontextprotocol/web-scraper",
  "io.modelcontextprotocol/email",
  "io.modelcontextprotocol/calendar"
];

console.log("🔧 MCP Registry - Deterministic Server ID Demo");
console.log("=" .repeat(50));
console.log();

testServers.forEach(serverName => {
  const id1 = generateServerIdFromName(serverName);
  const id2 = generateServerIdFromName(serverName);
  
  console.log(`📦 Server: ${serverName}`);
  console.log(`🆔 ID (1st call): ${id1}`);
  console.log(`🆔 ID (2nd call): ${id2}`);
  console.log(`✅ Consistent: ${id1 === id2 ? 'YES' : 'NO'}`);
  console.log();
});

console.log("💡 These IDs will be the same every time the application starts!");
console.log("🌐 Test via API: GET /v0/servers/id-lookup?name=io.modelcontextprotocol/filesystem");
