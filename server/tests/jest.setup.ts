// jest.setup.ts
process.env.OPENAI_API_KEY = 'test-key';

jest.mock('../config/openai', () => ({
  openai: {
    chat: {
      completions: {
        create: jest.fn().mockResolvedValue({
          choices: [{ message: { content: 'Mock AI Answer (global setup)' } }],
        }),
      },
    },
  },
}));
