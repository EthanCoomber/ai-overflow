// client/src/__tests__/QuestionBody.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import QuestionBody from '../components/main/answerPage/questionBody/questionBodyView';

describe('QuestionBody component', () => {
  it('renders question body and metadata using Material UI components', () => {
    render(
      <QuestionBody
        views={321}
        votes={12}
        text="What is the best way to learn JavaScript?"
        askby="coder123"
        meta="2 days ago"
        handleUpvote={jest.fn()}
        qid="123"
      />
    );

    expect(screen.getByText('What is the best way to learn JavaScript?')).toBeInTheDocument();
    expect(screen.getByText('321 views')).toBeInTheDocument();
    expect(screen.getByText((content, node) => {
      return node?.tagName.toLowerCase() === 'button' && content.trim() === '12';
    })).toBeInTheDocument();
        expect(screen.getByText('coder123')).toBeInTheDocument();
    expect(screen.getByText(/2 days ago/)).toBeInTheDocument();
  });
});
