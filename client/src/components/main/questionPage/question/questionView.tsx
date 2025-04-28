import "./questionView.css";
import { getCookie } from "../../../../utils";
import { QuestionProps } from "../../../../types/componentPropTypes";
import { 
  Box, 
  Card, 
  CardContent, 
  
} from "@mui/material";
import QuestionStats from "./questionStats/QuestionStats";
import QuestionMeta from "./questionMeta/QuestionMeta";
import QuestionContent from "./questionContent/QuestionContent";

/**
 * Renders a question card with details and interactive elements
 * 
 * This component displays a question with its metadata, including title, tags,
 * vote count, view count, answer count, and author information. It provides
 * interactive elements for upvoting and navigating to the question's answers.
 * 
 * @param {QuestionProps} props - The component props
 * @param {Object} props.q - The question object containing all question data
 * @param {ClickTagFunctionType} props.clickTag - Callback function to handle tag clicks
 * @param {IdFunctionType} props.handleAnswer - Callback function to handle viewing answers
 * @param {IdFunctionType} props.handleUpvote - Callback function to handle upvoting
 * @returns {JSX.Element} The rendered Question component
 */
const Question = ({ q, clickTag, handleAnswer, handleUpvote }: QuestionProps) => {

  
  const votedQuestionsCookie = getCookie("votedQuestions");
  const votedQuestions = votedQuestionsCookie ? JSON.parse(votedQuestionsCookie) : [];
  const hasVoted = votedQuestions.includes(q._id);
  
  return (
    <Card 
      variant="outlined" 
      sx={{ mb: 2, borderRadius: 2 }}
      id="question-card"
    >
      <CardContent>
        <Box sx={{ display: 'flex', gap: 2 }} id="question-container">
            <QuestionStats q={q} handleUpvote={handleUpvote} hasVoted={hasVoted} />
            <QuestionContent q={q} clickTag={clickTag} handleAnswer={handleAnswer} />
            <QuestionMeta q={q} handleAnswer={handleAnswer} />
          </Box>
        </CardContent>
    </Card>
  );
};

export default Question;
