import { PRReviewClient } from '../client';
import { PRDataWithPrompt } from '../types';
import fs from 'fs';

// Mock the Anthropic SDK
jest.mock('@anthropic-ai/sdk', () => {
  return {
    __esModule: true,
    Anthropic: jest.fn().mockImplementation(() => ({
      completions: {
        create: jest.fn().mockResolvedValue({
          completion: 'Test review content'
        })
      }
    }))
  };
});

// Mock child_process
jest.mock('child_process', () => ({
  spawn: jest.fn().mockReturnValue({
    stdio: ['pipe', 'pipe', 'pipe']
  })
}));

// Mock fs
jest.mock('fs', () => ({
  writeFileSync: jest.fn(),
  existsSync: jest.fn().mockReturnValue(true),
  unlinkSync: jest.fn()
}));

describe('PRReviewClient', () => {
  beforeEach(() => {
    // Set environment variables for testing
    process.env.ANTHROPIC_API_KEY = 'test-api-key';
    process.env.GITHUB_TOKEN = 'test-github-token';
  });

  afterEach(() => {
    jest.clearAllMocks();
    delete process.env.ANTHROPIC_API_KEY;
    delete process.env.GITHUB_TOKEN;
  });

  it('should initialize with default config', () => {
    const client = new PRReviewClient();
    expect(client).toBeDefined();
  });

  it('should throw error if API key is missing', () => {
    delete process.env.ANTHROPIC_API_KEY;
    expect(() => new PRReviewClient()).toThrow('Anthropic API key is required');
  });

  it('should throw error if GitHub token is missing', () => {
    delete process.env.GITHUB_TOKEN;
    expect(() => new PRReviewClient({ anthropicApiKey: 'test-key' })).toThrow('GitHub token is required');
  });

  it('should perform PR review', async () => {
    const client = new PRReviewClient();
    
    const prData: PRDataWithPrompt = {
      title: 'Test PR',
      prompt: 'Test prompt'
    };
    
    const result = await client.reviewPR(prData);
    
    expect(result.content).toBe('Test review content');
    expect(result.toolUses).toEqual([]);
    expect(fs.writeFileSync).toHaveBeenCalled();
    expect(fs.unlinkSync).toHaveBeenCalled();
  });
});