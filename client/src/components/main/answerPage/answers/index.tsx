import { Box } from "@mui/material";
import Answer from "../answer/answerView";
import { getMetaData } from "../../../../utils";
import { AnswerType } from "../../../../types/entityTypes";

/**
 * Renders a list of answers for a question
 * 
 * @component
 * @param {Object} props - The component props
 * @param {Array} props.answers - The list of answers to display
 * @returns {JSX.Element} The rendered Answers component
 */
const Answers = ({ answers = [] }: { answers: AnswerType[] }) => {
  return (
    <Box className="answers-container">
      {answers.map((a, idx) => (
        <Box key={idx} id={`answer-${idx}`}>
          <Answer
            text={a.text}
            ansBy={a.ans_by}
            meta={getMetaData(new Date(a.ans_date_time))}
          />
        </Box>
      ))}
    </Box>
  );
};

export default Answers;
