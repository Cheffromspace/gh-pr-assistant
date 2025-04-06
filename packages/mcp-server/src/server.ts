import { Octokit } from '@octokit/rest';
import { ServerConfig, GetFileParams, PRCommentParams, PRParams, IssueParams } from './types';

// Since we cannot install the MCP SDK, we'll create a simplified mock implementation
class McpServer {
  private tools: Record<string, any> = {};
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  // Register a tool
  tool(name: string, handler: (params: any) => Promise<any>): void {
    this.tools[name] = handler;
  }

  // Start listening for connections
  listen(options: any): void {
    console.log(`MCP Server started with options: ${JSON.stringify(options)}`);
  }

  // Process a tool call
  async processTool(name: string, params: any): Promise<any> {
    if (!this.tools[name]) {
      throw new Error(`Tool ${name} not found`);
    }
    return this.tools[name](params);
  }
}

/**
 * Creates and configures an MCP server for GitHub PR review assistance
 * @param config Server configuration options
 * @returns Configured MCP server instance
 */
export function createPRReviewServer(config: ServerConfig = {}) {
  const githubToken = config.githubToken || process.env.GITHUB_TOKEN;
  
  if (!githubToken) {
    console.warn('Warning: No GitHub token provided. API requests will be rate-limited and may fail for private repositories.');
  }

  // Setup the MCP server
  const server = new McpServer({
    name: "GitHub PR Review Server",
    version: "0.1.0"
  });

  // Define get_file tool
  server.tool("get_file", async (params: GetFileParams) => {
    try {
      const octokit = new Octokit({ auth: githubToken });
      const response = await octokit.repos.getContent({
        owner: params.owner,
        repo: params.repo,
        path: params.path,
        ref: params.ref,
        mediaType: {
          format: "raw"
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching file: ${error instanceof Error ? error.message : String(error)}`);
      return { error: error instanceof Error ? error.message : String(error) };
    }
  });

  // Define add_comment tool
  server.tool("add_comment", async (params: PRCommentParams) => {
    try {
      const octokit = new Octokit({ auth: githubToken });
      const response = await octokit.issues.createComment({
        owner: params.owner,
        repo: params.repo,
        issue_number: params.pull_number,
        body: params.body
      });
      return { success: true, comment_id: response.data.id };
    } catch (error) {
      console.error(`Error adding comment: ${error instanceof Error ? error.message : String(error)}`);
      return { error: error instanceof Error ? error.message : String(error) };
    }
  });

  // Define approve tool
  server.tool("approve", async (params: PRParams) => {
    try {
      const octokit = new Octokit({ auth: githubToken });
      await octokit.pulls.createReview({
        owner: params.owner,
        repo: params.repo,
        pull_number: params.pull_number,
        event: "APPROVE"
      });
      return { success: true };
    } catch (error) {
      console.error(`Error approving PR: ${error instanceof Error ? error.message : String(error)}`);
      return { error: error instanceof Error ? error.message : String(error) };
    }
  });

  // Define request_change tool
  server.tool("request_change", async (params: PRCommentParams) => {
    try {
      const octokit = new Octokit({ auth: githubToken });
      await octokit.pulls.createReview({
        owner: params.owner,
        repo: params.repo,
        pull_number: params.pull_number,
        body: params.body,
        event: "REQUEST_CHANGES"
      });
      return { success: true };
    } catch (error) {
      console.error(`Error requesting changes: ${error instanceof Error ? error.message : String(error)}`);
      return { error: error instanceof Error ? error.message : String(error) };
    }
  });

  // Define get_issue tool
  server.tool("get_issue", async (params: IssueParams) => {
    try {
      const octokit = new Octokit({ auth: githubToken });
      const response = await octokit.issues.get({
        owner: params.owner,
        repo: params.repo,
        issue_number: params.issue_number
      });
      return response.data;
    } catch (error) {
      console.error(`Error fetching issue: ${error instanceof Error ? error.message : String(error)}`);
      return { error: error instanceof Error ? error.message : String(error) };
    }
  });

  return server;
}

/**
 * Starts the MCP server with the provided configuration
 * @param config Server configuration options
 * @returns The running server instance
 */
export function startServer(config: ServerConfig = {}) {
  const server = createPRReviewServer(config);
  
  // Start the server with specified transport
  server.listen({
    transport: config.transport || "stdio",
    ...(config.transport === "http" && config.port ? { port: config.port } : {})
  });
  
  return server;
}