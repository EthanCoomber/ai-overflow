import { Box, Typography, Chip } from "@mui/material";
import { QuestionContentProps } from "../../../../../types/componentPropTypes";

/**
 * Renders the content section of a question card
 * 
 * This component displays the question title and associated tags.
 * It handles click events for both viewing the question details and
 * filtering by tags.
 * 
 * @param {QuestionContentProps} props - The component props
 * @param {Object} props.q - The question object containing all question data
 * @param {ClickTagFunctionType} props.clickTag - Callback function to handle tag clicks
 * @param {IdFunctionType} props.handleAnswer - Callback function to handle viewing answers
 * @returns {JSX.Element} The rendered QuestionContent component
 */
const QuestionContent = ({ q, clickTag, handleAnswer }: QuestionContentProps) => {
  return (
    <Box 
      sx={{ width: '58.33%', cursor: 'pointer' }} 
      id="question-content"
      onClick={() => handleAnswer(q._id)}
    >
      <Typography variant="h6" component="div" gutterBottom className="postTitle" id="question-title">
        {q.title}
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }} id="question-tags">
        {q.tags.map((tag, idx) => (
          <Chip
            key={idx}
            label={tag.name}
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              clickTag(tag.name);
            }}
            sx={{ 
              backgroundColor: '#e1ecf4', 
              color: '#39739d',
              '&:hover': {
                backgroundColor: '#d0e3f1',
              }
            }}
            id={`tag-${tag.name}`}
          />
        ))}
      </Box>
    </Box>
  );
};

export default QuestionContent;
