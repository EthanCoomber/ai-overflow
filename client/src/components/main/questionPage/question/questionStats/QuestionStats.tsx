import { Box, Typography, Stack } from "@mui/material";
import { QuestionAnswer, Visibility, ThumbUp } from "@mui/icons-material";
import { QuestionStatsProps } from "../../../../../types/componentPropTypes";

/**
 * Renders the statistics section of a question card
 * 
 * This component displays various statistics about a question including
 * the number of answers, views, votes, and comments. It also provides
 * an upvote button that users can click to upvote the question.
 * 
 * @param {QuestionStatsProps} props - The component props
 * @param {Object} props.q - The question object containing all question data
 * @param {IdFunctionType} props.handleUpvote - Callback function to handle upvoting
 * @returns {JSX.Element} The rendered QuestionStats component
 */
const QuestionStats = ({ q, handleUpvote, hasVoted }: QuestionStatsProps) => {        
  return (
    <Box sx={{ width: '16.66%' }} id="question-stats">
      <Stack spacing={1} id="stats-stack">
        <Box display="flex" alignItems="center" id="answer-count">
          <QuestionAnswer fontSize="small" color="action" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {q.answers.length || 0} answers
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" id="view-count">
          <Visibility fontSize="small" color="action" sx={{ mr: 1 }} />
          <Typography variant="body2" color="text.secondary">
            {q.views} views
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" id="vote-container">
          <button
            onClick={(e) => {
              e.stopPropagation();
              console.log("Calling handleUpvote", q._id);
              if (!hasVoted) {
                handleUpvote(q._id);
              }
            }}
            style={{
              background: hasVoted ? "#4CAF50" : "#f48024",
              color: "white",
              padding: "4px 8px",
              borderRadius: "4px",
              border: "none",
              cursor: hasVoted ? "not-allowed" : "pointer",
              fontSize: "12px",
            }}
            id="vote-button"
          >
            <ThumbUp fontSize="small" />
            {q.votes || 0}
          </button>
        </Box>
        {q.comments && (
          <Box display="flex" alignItems="center" id="comment-count">
            <Typography variant="body2" color="text.secondary" id="comment-count">
              💬 {q.comments.length} comments
            </Typography>
          </Box>
        )}
      </Stack>
    </Box>
  );
};

export default QuestionStats;
