import { Box, Alert } from "@mui/material";
import ReactMarkdown from "react-markdown";
import { AIAnswerProps } from "../../../../types/componentPropTypes";

/**
 * Renders the AI-generated answer section
 * 
 * This component displays the AI-generated answer with appropriate styling and status indicators.
 * It also shows error messages when AI answer generation fails.
 * 
 * @param {Object} props - The component props
 * @param {string} props.displayedAIAnswer - The AI-generated answer text to display
 * @param {boolean} props.isTyping - Whether the AI is currently generating the answer
 * @param {boolean} props.aiError - Whether there was an error with the AI answer
 * @param {boolean} props.fetchingAIAnswerError - Whether there was an error fetching the AI answer
 * @param {string} props.errorMessage - The error message to display if there was an error
 * @returns {JSX.Element} The rendered AIAnswer component
 */
const AIAnswer = ({ 
  displayedAIAnswer, 
  isTyping, 
  aiError, 
  fetchingAIAnswerError, 
  errorMessage 
}: AIAnswerProps) => {
  return (
    <>
      {displayedAIAnswer && !aiError && (
        <Box className="ai-answer" id="ai-answer-container">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }} id="ai-answer-header">
            <Box sx={{ fontWeight: 'bold' }} id="ai-assistant-label">AI Assistant</Box>
            <Box sx={{ color: 'text.secondary', fontSize: '0.9rem' }} id="ai-answer-status">
              {isTyping ? "Generating..." : "AI Generated Answer"}
            </Box>
          </Box>
          <Box className="answer-content" id="ai-answer-content">
            <ReactMarkdown>{displayedAIAnswer}</ReactMarkdown>
            {isTyping && <span className="typing-cursor" id="typing-cursor">|</span>}
          </Box>
        </Box>
      )}

      {(aiError || fetchingAIAnswerError) && (
        <Alert severity="error" sx={{ mt: 2 }} id="ai-answer-error">
          {errorMessage}
        </Alert>
      )}
    </>
  );
};

export default AIAnswer;
