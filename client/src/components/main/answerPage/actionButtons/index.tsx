import { Box, Button } from "@mui/material";
import AddCommentIcon from "@mui/icons-material/AddComment";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { ActionButtonsProps } from "../../../../types/componentPropTypes";


/**
 * Renders the action buttons for the answer page
 * 
 * This component displays buttons for answering a question and getting an AI-generated answer.
 * 
 * @param {ActionButtonsProps} props - The component props
 * @returns {JSX.Element} The rendered ActionButtons component
 */
const ActionButtons = ({
  handleNewAnswer,
  fetchAIAnswer,
  fetchingAIAnswer,
  isTyping,
  displayedAIAnswer,
  fetchingAIAnswerError
}: ActionButtonsProps) => {
  return (
    <Box className="button-container" sx={{ display: 'flex', gap: 2 }} id="answer-actions">
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddCommentIcon />}
        onClick={handleNewAnswer}
        className="answer-button"
        id="answer-question-button"
      >
        Answer Question
      </Button>
      <Button
        variant="outlined"
        color="secondary"
        startIcon={<SmartToyIcon />}
        onClick={fetchAIAnswer}
        disabled={
          fetchingAIAnswer ||
          isTyping ||
          !!displayedAIAnswer ||
          fetchingAIAnswerError
        }
        className="ai-answer-button"
        id="get-ai-answer-button"
      >
        {fetchingAIAnswer
          ? "Generating AI Answer..."
          : displayedAIAnswer
          ? "AI Answer Generated"
          : fetchingAIAnswerError
          ? "Error Occurred"
          : "Get AI Answer"}
      </Button>
    </Box>
  );
};

export default ActionButtons;
