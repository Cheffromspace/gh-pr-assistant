import { generatePRReviewPrompt } from '../prompt';
import { PRData } from '../types';

describe('generatePRReviewPrompt', () => {
  it('should generate a prompt with basic PR data', () => {
    const prData: PRData = {
      title: 'Test PR',
      body: 'This is a test PR',
      user: {
        login: 'testuser'
      },
      head: {
        ref: 'feature-branch'
      },
      base: {
        ref: 'main'
      },
      number: 123,
      created_at: '2023-01-01T00:00:00Z',
      updated_at: '2023-01-02T00:00:00Z'
    };

    const prompt = generatePRReviewPrompt(prData);
    
    expect(prompt).toContain('# GitHub PR Code Review');
    expect(prompt).toContain('Title: Test PR');
    expect(prompt).toContain('Description: This is a test PR');
    expect(prompt).toContain('Created by: testuser');
    expect(prompt).toContain('Branch: feature-branch → main');
    expect(prompt).toContain('PR Number: #123');
  });

  it('should handle missing data gracefully', () => {
    const prData: PRData = {
      // Minimal data
    };

    const prompt = generatePRReviewPrompt(prData);
    
    expect(prompt).toContain('# GitHub PR Code Review');
    expect(prompt).toContain('Title: N/A');
    expect(prompt).toContain('Description: N/A');
    expect(prompt).toContain('Created by: N/A');
  });
});