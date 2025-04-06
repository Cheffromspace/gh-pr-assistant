#!/usr/bin/env node
import { Command } from 'commander';
import { PRReviewClient } from './client';
import { PRData } from '@gh-ai-pr-assistant/mcp-server';

const program = new Command();

program
  .name('gh-ai-pr-review')
  .description('GitHub PR review assistant using Anthropic Claude and MCP')
  .version('0.1.0');

program
  .command('review')
  .description('Review a pull request')
  .requiredOption('--owner <owner>', 'Repository owner')
  .requiredOption('--repo <repo>', 'Repository name')
  .requiredOption('--pr <number>', 'Pull request number', parseInt)
  .option('--model <model>', 'Claude model to use (default: claude-3-7-sonnet-20250219)')
  .option('--max-tokens <tokens>', 'Maximum tokens for response', parseInt)
  .action(async (options) => {
    try {
      // Create client with options
      const client = new PRReviewClient({
        model: options.model,
        maxTokens: options.maxTokens
      });
      
      // Create minimal PR data (in a real implementation, this would fetch the PR data from GitHub)
      const prData: PRData = {
        number: options.pr,
        // This is a simplified implementation - in a real application,
        // you would fetch the PR details from the GitHub API here
      };
      
      // Run the review
      const result = await client.reviewPR(prData);
      
      // Output the review
      console.log(result.content);
      
    } catch (error) {
      console.error('Error:', error instanceof Error ? error.message : String(error));
      process.exit(1);
    }
  });

program.parse();