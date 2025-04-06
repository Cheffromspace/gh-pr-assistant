# GitHub PR Assistant

An AI-powered GitHub PR reviewer using Anthropic Claude and Model Context Protocol (MCP).

## Features

- Automatically reviews GitHub pull requests
- Uses Claude AI to provide detailed code review feedback
- Interactive tools to fetch files, add comments, and approve PRs
- Can be used as a library or CLI tool

## Installation

```bash
npm install @gh-ai-pr-assistant/github-pr-assistant
```

## Usage

### As a library

```typescript
import { PRReviewClient } from '@gh-ai-pr-assistant/github-pr-assistant';

const client = new PRReviewClient({
  anthropicApiKey: 'your-anthropic-api-key', // Or set via process.env.ANTHROPIC_API_KEY
  githubToken: 'your-github-token', // Or set via process.env.GITHUB_TOKEN
  model: 'claude-3-7-sonnet-20250219' // Optional
});

// Review a PR
const review = await client.reviewPR({
  // PR data
  number: 123,
  owner: 'your-org',
  repo: 'your-repo',
  // ... other PR details
});

console.log(review.content);
```

### Command Line

```bash
# Set environment variables
export ANTHROPIC_API_KEY=your-anthropic-api-key
export GITHUB_TOKEN=your-github-token

# Run the review
gh-ai-pr-review review --owner your-org --repo your-repo --pr 123
```

## API

### `PRReviewClient`

The main client class for interacting with the PR review system.

#### Constructor

```typescript
new PRReviewClient(config?: ClientConfig)
```

**Parameters:**
- `config` (optional): Configuration object with:
  - `anthropicApiKey`: Anthropic API key
  - `githubToken`: GitHub API token  
  - `model`: Claude model to use (default: claude-3-7-sonnet-20250219)
  - `maxTokens`: Maximum tokens for response (default: 4000)

#### Methods

##### `reviewPR(prData: PRDataWithPrompt): Promise<ReviewResult>`

Performs a review of the provided PR data.

**Parameters:**
- `prData`: PR data object with optional prompt field

**Returns:** Review result with content and tool uses

## License

MIT