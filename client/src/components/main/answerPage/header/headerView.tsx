import "./headerView.css";
import PageHeader from "../../baseComponents/pageheader/PageHeader";
import { Typography } from "@mui/material";
import { AnswerHeaderProps } from "../../../../types/componentPropTypes";

/**
 * Renders the header section of the answer page
 * 
 * Displays the number of answers, the question title, and a button to ask a new question.
 * Uses the PageHeader component to maintain consistent layout with other pages.
 * 
 * @param {AnswerHeaderProps} props - The component props
 * @param {number} props.ansCount - The number of answers for the question
 * @param {string} props.title - The title of the question being answered
 * @returns {JSX.Element} The rendered AnswerHeader component
 */
const AnswerHeader = ({ ansCount, title }: AnswerHeaderProps) => {
  return (
    <PageHeader
      title="answers"
      count={ansCount}
      actions={
        <>
          <Typography 
            variant="h6" 
            component="div" 
            className="typography-title answer_question_title"
          >
            {title}
          </Typography>
        </>
      }
    />
  );
};

export default AnswerHeader;
