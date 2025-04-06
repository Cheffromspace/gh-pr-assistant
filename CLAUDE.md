# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands
- Build: `npm run build`
- Lint: `npm run lint`
- Test all: `npm test`
- Test single: `npm test -w @gh-ai-pr-assistant/[package] -- [test-file-path]`
- Start: `npm start -w @gh-ai-pr-assistant/github-pr-assistant`

## Code Style Guidelines
- Indentation: 2 spaces
- TypeScript: Use strict type checking and appropriate interfaces
- Naming: camelCase for variables/functions, PascalCase for classes
- Error handling: Use try/catch blocks with specific error types
- Async: Follow Node.js async/await patterns
- Imports: Group imports (external, internal, types)
- Use Zod for schema validation
- Maintain JSDoc documentation for public APIs
- For GitHub interactions, handle rate limits and authentication properly
- When processing webhooks, validate all inputs before processing
- When working with MCPs, follow the @modelcontextprotocol/sdk patterns