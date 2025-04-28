import "./questionBodyView.css";
import { Box, Typography, Paper, Stack, Divider, Button } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PersonIcon from "@mui/icons-material/Person";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import { QuestionBodyProps } from "../../../../types/componentPropTypes";
import { getCookie } from "../../../../utils";

/**
 * Renders the body of a question in the answer page
 * 
 * Displays the question text along with metadata such as view count,
 * vote count, who asked the question, and when it was asked.
 * 
 * @param {QuestionBodyProps} props - The component props
 * @param {number} props.views - The number of views the question has received
 * @param {number} props.votes - The number of votes the question has received
 * @param {string} props.text - The content/body of the question
 * @param {string} props.askby - The username of the person who asked the question
 * @param {string} props.meta - Metadata about the question (e.g., timestamp)
 * @param {Function} props.handleUpvote - Function to handle upvoting the question
 * @returns {JSX.Element} The rendered QuestionBody component
 */
const QuestionBody = ({ views, votes, text, askby, meta, handleUpvote, qid }: QuestionBodyProps) => {
  const votedQuestions = JSON.parse(getCookie("votedQuestions") || "[]");
  const hasVoted = votedQuestions.includes(qid);

  return (
    <Paper
      id="questionBody"
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 2,
        mb: 2,
      }}
    >
      <Box sx={{ mb: 2 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="subtitle1" display="flex" alignItems="center">
            <VisibilityIcon fontSize="small" sx={{ mr: 0.5 }} />
            {views} views
          </Typography>
          <div id="vote-container">
            <Button
              variant="contained"
              color={hasVoted ? "success" : "primary"}
              onClick={handleUpvote}
              disabled={hasVoted}
              startIcon={<ThumbUpIcon fontSize="small" />}
            >
              {votes}
            </Button>
          </div>
        </Stack>
      </Box>

      <Typography variant="body1">{text}</Typography>

      <Divider sx={{ mb: 2, mt: 2 }} />

      <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
        <Typography variant="subtitle2" display="flex" alignItems="center">
          <PersonIcon fontSize="small" sx={{ mr: 0.5 }} />
          {askby}
        </Typography>
        <Typography variant="caption" color="text.secondary" display="flex" alignItems="center">
          <AccessTimeIcon fontSize="small" sx={{ mr: 0.5 }} />
          asked {meta}
        </Typography>
      </Stack>
    </Paper>
  );
};

export default QuestionBody;
