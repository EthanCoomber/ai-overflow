// tests/aiRateLimit.test.ts
process.env.OPENAI_API_KEY = 'test-key';

jest.mock('../config/openai', () => ({
  openai: {
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: 'Mock AI Answer' } }],
        }),
      },
    },
  },
}));

jest.mock('../services/questionService');

import request from 'supertest';
import app from '../app';
import * as questionService from '../services/questionService';

describe('Rate limiting on /question/getAIAnswer/:qid', () => {
  const mockAnswer = 'Mock AI Answer';

  beforeEach(() => {
    (questionService.getAIAnswer as jest.Mock).mockResolvedValue(mockAnswer);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should allow up to 5 requests per minute and block the 6th with 429', async () => {
    const qid = 'abc123';

    for (let i = 0; i < 5; i++) {
      const res = await request(app).get(`/question/getAIAnswer/${qid}`);
      expect(res.statusCode).toBe(200);
      expect(res.text).toContain(mockAnswer);
    }

    const rateLimitRes = await request(app).get(`/question/getAIAnswer/${qid}`);
    expect(rateLimitRes.statusCode).toBe(429);
    expect(rateLimitRes.body.message).toMatch(/too many/i);
  });
});
