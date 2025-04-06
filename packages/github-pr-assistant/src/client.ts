import { Anthropic } from '@anthropic-ai/sdk';
import { spawn } from 'child_process';
import { ClientConfig, PRDataWithPrompt, ReviewResult } from './types';
import path from 'path';
import { generatePRReviewPrompt } from '@gh-ai-pr-assistant/mcp-server';
import fs from 'fs';

/**
 * Client for PR review using Anthropic Claude and MCP
 */
export class PRReviewClient {
  private anthropic: Anthropic;
  private config: Required<ClientConfig>;
  
  /**
   * Create a new PR review client
   * @param config Client configuration
   */
  constructor(config: ClientConfig = {}) {
    // Set defaults and apply provided config
    this.config = {
      anthropicApiKey: config.anthropicApiKey || process.env.ANTHROPIC_API_KEY || '',
      githubToken: config.githubToken || process.env.GITHUB_ACCESS_TOKEN || '',
      model: config.model || 'claude-3-sonnet-20240229',
      maxTokens: config.maxTokens || 4000
    };
    
    if (!this.config.anthropicApiKey) {
      throw new Error('Anthropic API key is required. Provide it in the config or set ANTHROPIC_API_KEY environment variable.');
    }
    
    if (!this.config.githubToken) {
      throw new Error('GitHub token is required. Provide it in the config or set GITHUB_ACCESS_TOKEN environment variable.');
    }
    
    // Initialize Anthropic client
    this.anthropic = new Anthropic({
      apiKey: this.config.anthropicApiKey,
    });
  }
  
  /**
   * Run a PR review
   * @param prData Pull request data
   * @returns Review result
   */
  async reviewPR(prData: PRDataWithPrompt): Promise<ReviewResult> {
    try {
      console.log('Starting PR review process...');
      
      // Generate prompt if not provided
      if (!prData.prompt) {
        prData.prompt = generatePRReviewPrompt(prData);
      }
      
      // Create a temporary script to run the MCP server
      const tmpScriptPath = path.join(process.cwd(), 'tmp-mcp-server.js');
      fs.writeFileSync(tmpScriptPath, `
const { startServer } = require('@gh-ai-pr-assistant/mcp-server');
startServer();
      `);
      
      // Launch MCP server process
      const serverProcess = spawn('node', [tmpScriptPath], {
        stdio: ['pipe', 'pipe', 'pipe'],
        env: {
          ...process.env,
          GITHUB_ACCESS_TOKEN: this.config.githubToken
        }
      });

      // Process PR data and generate system message
      const systemMessage = `You are Claude, an AI assistant acting as a professional code reviewer. Your goal is to provide helpful, constructive feedback on code changes in GitHub pull requests.

## Approach to Reviews
- Be thorough but balanced - focus on meaningful issues rather than minor stylistic preferences
- Provide specific, actionable feedback with clear explanations
- Balance pointing out problems with positive reinforcement
- When suggesting changes, explain why they improve the code
- Consider security, performance, maintainability, and readability

## Review Focus Areas
1. Potential security vulnerabilities (injection attacks, authentication issues, etc.)
2. Logic bugs or edge cases
3. Performance issues (inefficient algorithms, unnecessary computations)
4. Code organization and maintainability
5. Error handling and edge cases
6. Test coverage and effectiveness
7. Documentation quality

## Response Format
- Begin with a brief summary of the PR and your overall assessment
- Group feedback by file, with clear headings
- Include specific line references when applicable
- For each issue identified:
  * Clearly describe the problem
  * Explain why it's an issue
  * Suggest a concrete improvement
- End with a conclusion summarizing key points and next steps

Maintain a professional, constructive tone throughout your review. Your goal is to help improve the code quality while respecting the developer's work.`;

      // Call Anthropic API with MCP
      const response = await this.anthropic.completions.create({
        model: this.config.model,
        max_tokens_to_sample: this.config.maxTokens,
        prompt: `\n\nHuman: ${systemMessage}\n\n${prData.prompt}\n\nAssistant:`,
        temperature: 0.7,
        top_k: 50
      });

      // Clean up the temporary script
      if (fs.existsSync(tmpScriptPath)) {
        fs.unlinkSync(tmpScriptPath);
      }

      // Process the response
      console.log('PR review completed');
      
      // Extract content
      const content = response.completion || '';
      
      // No tool uses in this version of the API
      const toolUses: Array<{name: string, input: Record<string, any>, output: Record<string, any>}> = [];
      
      return {
        content,
        toolUses
      };

    } catch (error) {
      console.error('Error in PR review process:', error instanceof Error ? error.message : String(error));
      throw error;
    }
  }
}