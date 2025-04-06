# GitHub AI PR Assistant

A monorepo containing tools for AI-powered GitHub PR review using Anthropic Claude.

## Packages

- [@gh-ai-pr-assistant/mcp-server](./packages/mcp-server): MCP server package for GitHub PR review
- [@gh-ai-pr-assistant/github-pr-assistant](./packages/github-pr-assistant): GitHub PR review client

## Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/gh-ai-pr-assistant.git
cd gh-ai-pr-assistant

# Install dependencies
npm install

# Build all packages
npm run build

# Set environment variables
export ANTHROPIC_API_KEY=your-anthropic-api-key
export GITHUB_TOKEN=your-github-token

# Run a PR review
node packages/github-pr-assistant/dist/cli.js review --owner your-org --repo your-repo --pr 123
```

## Development

This is a monorepo using npm workspaces. To work on the packages:

```bash
# Install all dependencies
npm install

# Build all packages
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

## License

MIT