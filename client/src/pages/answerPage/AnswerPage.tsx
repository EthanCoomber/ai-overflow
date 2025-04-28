/**
 * @fileoverview Answer Page component that displays a question with its answers, comments, and AI answer functionality
 */

import { useParams } from "react-router-dom";
import { useAnswerPage } from "../../hooks/useAnswerPage";
import AnswerHeader from "../../components/main/answerPage/header/headerView";
import QuestionBody from "../../components/main/answerPage/questionBody/questionBodyView";
import { getMetaData } from "../../utils";
import {
  Container,
  Box,
  CircularProgress,
} from "@mui/material";
import Comments from "../../components/main/answerPage/comments/index";
import AIAnswer from "../../components/main/answerPage/aiAnswer/index";
import ActionButtons from "../../components/main/answerPage/actionButtons/index";
import "./answerPageView.css";
import Answers from "../../components/main/answerPage/answers/index";
/**
 * AnswerPage component displays a question and its answers
 * 
 * @component
 * @returns {JSX.Element} The rendered Answer Page
 */
const AnswerPage = () => {
  /** Extract question ID from URL parameters */
  const { qid } = useParams<{ qid: string }>();

  /**
   * Custom hook that provides all the functionality for the answer page
   * 
   * @type {Object} Answer page state and handlers
   */
  const {
    question,                // The question data
    fetchingAIAnswer,        // Boolean indicating if AI answer is being fetched
    fetchingAIAnswerError,   // Error from AI answer fetch attempt
    fetchAIAnswer,           // Function to fetch AI answer
    handleNewAnswer,         // Function to handle submitting a new answer
    isTyping,                // Boolean indicating if AI is "typing" an answer
    aiError,                 // Error from AI processing
    displayedAIAnswer,       // The AI generated answer text
    handleCommentSubmit,     // Function to submit a new comment
    commentText,             // Current comment text input
    setCommentText,          // Function to update comment text
    errorMessage,            // General error message
    handleUpvote             // Function to handle upvoting
  } = useAnswerPage(qid || "");

  return (
    <Container className="container" maxWidth={false} disableGutters>
    {question ? (
        <Box id="question-answer-content" sx={{ width: '100%' }}>
          <AnswerHeader
            ansCount={question.answers.length}
            title={question.title}
          />

          <QuestionBody
            views={question.views}
            votes={question.votes}
            text={question.text}
            askby={question.asked_by}
            meta={getMetaData(new Date(question.ask_date_time))}
            handleUpvote={handleUpvote}
            qid={question._id}
          />

          {/* Render all answers for this question */}
          <Answers answers={question.answers} />
        
          {/* Comments section for the question */}
          <Comments
            comments={question.comments}
            commentText={commentText}
            setCommentText={setCommentText}
            handleCommentSubmit={handleCommentSubmit}
          />

          {/* AI-generated answer section */}
          <AIAnswer
            displayedAIAnswer={displayedAIAnswer}
            isTyping={isTyping}
            aiError={aiError}
            fetchingAIAnswerError={fetchingAIAnswerError}
            errorMessage={errorMessage}
          />

          {/* Action buttons for answering or requesting AI help */}
          <ActionButtons
            handleNewAnswer={handleNewAnswer}
            fetchAIAnswer={fetchAIAnswer}
            fetchingAIAnswer={fetchingAIAnswer}
            isTyping={isTyping}
            displayedAIAnswer={displayedAIAnswer}
            fetchingAIAnswerError={fetchingAIAnswerError}
          />
        </Box>
      ) : (
        <Box className="loading-container" id="loading-container">
          <CircularProgress id="loading-spinner" />
        </Box>
      )}
    </Container>
  );
};

export default AnswerPage;
