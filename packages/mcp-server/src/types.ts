// MCP Server Types

// PR Data Interface
export interface PRData {
  title?: string;
  body?: string;
  user?: {
    login?: string;
  };
  head?: {
    ref?: string;
  };
  base?: {
    ref?: string;
  };
  number?: number;
  created_at?: string;
  updated_at?: string;
  comments?: Array<{
    user?: string;
    created_at?: string;
    body?: string;
  }>;
  review_comments?: Array<{
    user?: string;
    created_at?: string;
    path?: string;
    body?: string;
  }>;
  changed_files?: Array<{
    filename?: string;
    status?: string;
    additions?: number;
    deletions?: number;
    patch?: string;
  }>;
}

// Tool Parameter Types
export interface GetFileParams {
  path: string;
  repo: string;
  owner: string;
  ref: string;
}

export interface PRCommentParams {
  body: string;
  repo: string;
  owner: string;
  pull_number: number;
}

export interface PRParams {
  repo: string;
  owner: string;
  pull_number: number;
}

export interface IssueParams {
  repo: string;
  owner: string;
  issue_number: number;
}

// Server Config Type
export interface ServerConfig {
  githubToken?: string;
  transport?: "stdio" | "http";
  port?: number;
}