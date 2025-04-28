import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AnswerPage from '../pages/answerPage/AnswerPage';
import { BrowserRouter } from 'react-router-dom';

interface ReactMarkdownProps {
  children: string;
}

jest.mock('react-markdown', () => ({
  __esModule: true,
  default: (props: ReactMarkdownProps) => <div data-testid="markdown">{props.children}</div>,
}));



// Mock useParams and useAnswerPage
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ qid: '123' }),
}));

jest.mock('../hooks/useAnswerPage', () => ({
  useAnswerPage: () => ({
    question: {
      _id: '123',
      title: 'How to center a div?',
      text: 'I want to center a div using CSS.',
      views: 100,
      votes: 3,
      answers: [],
      comments: [],
      asked_by: 'cssGuru',
      ask_date_time: new Date().toISOString(),
    },
    commentText: '',
    setCommentText: jest.fn(),
    isTyping: false,
    displayedAIAnswer: '',
    fetchingAIAnswer: false,
    fetchingAIAnswerError: false,
    aiError: false,
    errorMessage: '',
    handleNewQuestion: jest.fn(),
    handleNewAnswer: jest.fn(),
    fetchAIAnswer: jest.fn(),
    handleCommentSubmit: jest.fn(),
  }),
}));

describe('AnswerPage component', () => {
  it('renders question details using Material UI components', () => {
    render(
      <BrowserRouter>
        <AnswerPage />
      </BrowserRouter>
    );

    expect(screen.getByText('How to center a div?')).toBeInTheDocument();
    expect(screen.getByText(/views/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '3' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Write a comment...')).toBeInTheDocument();
    expect(screen.getByText('Answer Question')).toBeInTheDocument();
    expect(screen.getByText('Get AI Answer')).toBeInTheDocument();
  });
});
