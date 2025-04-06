import { PRData } from '@gh-ai-pr-assistant/mcp-server';

// Client configuration
export interface ClientConfig {
  anthropicApiKey?: string;
  githubToken?: string;
  model?: string;
  maxTokens?: number;
}

// PR Data with optional prompt
export interface PRDataWithPrompt extends PRData {
  prompt?: string;
}

// Review result
export interface ReviewResult {
  content: string;
  toolUses?: Array<{
    name: string;
    input: any;
    output: any;
  }>;
}