# MCP Server for GitHub PR Review

This package provides a Model Context Protocol (MCP) server specifically designed for GitHub PR review tasks. It acts as a bridge between LLMs like Claude and the GitHub API.

## Features

- MCP-compatible server that works with Anthropic Claude models
- Tools for GitHub PR interactions:
  - Fetch file contents
  - Add comments to PRs
  - Approve PRs
  - Request changes
  - Get issue data

## Installation

```bash
npm install @gh-ai-pr-assistant/mcp-server
```

## Usage

### Basic Usage

```typescript
import { startServer } from '@gh-ai-pr-assistant/mcp-server';

// Start with default settings (stdio transport)
const server = startServer({
  githubToken: 'your-github-token' // Or set via process.env.GITHUB_TOKEN
});
```

### HTTP Transport

```typescript
import { startServer } from '@gh-ai-pr-assistant/mcp-server';

// Start with HTTP transport
const server = startServer({
  githubToken: 'your-github-token',
  transport: 'http',
  port: 3000
});
```

### Using in Anthropic Claude client

When using with the Anthropic SDK:

```typescript
import { createPRReviewServer } from '@gh-ai-pr-assistant/mcp-server';
import { spawn } from 'child_process';

// Launch the server as a child process
const serverProcess = spawn('node', ['server.js'], {
  stdio: ['pipe', 'pipe', 'pipe'],
  env: {
    ...process.env,
    GITHUB_TOKEN: 'your-github-token'
  }
});

// Then use the server with Anthropic Client
// ...
```

## API

### `startServer(config)`

Starts the MCP server with the provided configuration.

**Parameters:**
- `config` (optional): ServerConfig object with:
  - `githubToken`: GitHub API token
  - `transport`: "stdio" or "http" (default: "stdio")
  - `port`: Port number for HTTP transport

**Returns:** The running server instance

### `createPRReviewServer(config)`

Creates a configured MCP server without starting it.

**Parameters:**
- `config` (optional): ServerConfig object

**Returns:** Configured server instance

### `generatePRReviewPrompt(prData)`

Utility function that generates a formatted prompt for PR review.

**Parameters:**
- `prData`: PRData object containing pull request information

**Returns:** Formatted string for LLM prompt

## License

MIT