// client/src/__tests__/Question.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Question from '../components/main/questionPage/question/questionView';

// Define types to match the expected interface
interface AnswerType {
  text: string;
  ans_by: string;
  ans_date_time: Date;
}

interface Tag {
  name: string;
}

const mockQuestion = {
  _id: 'abc123',
  title: 'How do I use React?',
  text: 'I need help understanding hooks in React.',
  views: 150,
  votes: 7,
  answers: [{ 
    text: 'Use useEffect', 
    ans_by: 'dev1', 
    ans_date_time: new Date() 
  }] as AnswerType[],
  tags: [{ name: 'react' }, { name: 'hooks' }] as Tag[],
  asked_by: 'newbie123',
  ask_date_time: new Date().toISOString(),
};

describe('Question component', () => {
  it('renders Material UI components and displays question info', () => {
    render(
      <Question
        q={mockQuestion}
        clickTag={jest.fn()}
        handleAnswer={jest.fn()}
        handleUpvote={jest.fn()}
      />
    );

    expect(screen.getByText('How do I use React?')).toBeInTheDocument();
    expect(screen.getByText('react')).toBeInTheDocument();
    expect(screen.getByText('hooks')).toBeInTheDocument();
    expect(screen.getByText('newbie123')).toBeInTheDocument();
    expect(screen.getByText(/answers/)).toBeInTheDocument();
    expect(screen.getByText(/views/)).toBeInTheDocument();
    expect(screen.getAllByRole('button').length).toBeGreaterThan(1);
});
});
