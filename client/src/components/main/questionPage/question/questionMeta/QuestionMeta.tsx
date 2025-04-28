import { Box, Typography } from "@mui/material";
import { Person, AccessTime } from "@mui/icons-material";
import { getMetaData } from "../../../../../utils";
import { QuestionMetaProps } from "../../../../../types/componentPropTypes";

/**
 * Renders the metadata section of a question card
 * 
 * This component displays information about who asked the question
 * and when it was asked. It's displayed on the right side of the question card.
 * 
 * @param {QuestionMetaProps} props - The component props
 * @param {Object} props.q - The question object containing all question data
 * @param {IdFunctionType} props.handleAnswer - Callback function to handle viewing answers
 * @returns {JSX.Element} The rendered QuestionMeta component
 */
const QuestionMeta = ({ q, handleAnswer }: QuestionMetaProps) => {
  return (
    <Box 
      sx={{ width: '25%', cursor: 'pointer' }} 
      id="question-meta"
      onClick={() => handleAnswer(q._id)}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }} id="question-author" className="question_author">
        <Person fontSize="small" color="action" sx={{ mr: 0.5 }} />
        <Typography variant="body2" color="text.secondary" id="author-name">
          {q.asked_by}
        </Typography>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 1 }} id="question-time" className="question_meta">
        <AccessTime fontSize="small" color="action" sx={{ mr: 0.5 }} />
        <Typography variant="body2" color="text.secondary" id="question-timestamp">
          asked {getMetaData(new Date(q.ask_date_time))}
        </Typography>
      </Box>
    </Box>
  );
};

export default QuestionMeta;
