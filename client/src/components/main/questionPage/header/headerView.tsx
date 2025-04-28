import "./headerView.css";
import OrderButton from "./orderButton/orderButtonView";
import PageHeader from "../../baseComponents/pageheader/PageHeader";
import { Button, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { QuestionHeaderProps } from "../../../../types/componentPropTypes";

/**
 * Renders the header section for the questions page
 * 
 * This component displays the page title with question count, a button to ask a new question,
 * and ordering options for the question list.
 * 
 * @param {QuestionHeaderProps} props - The component props
 * @param {string} props.title_text - The title text for the header
 * @param {number} props.qcnt - The count of questions to display
 * @param {MessageFunctionType} props.setQuestionOrder - Callback function to update the question order
 * @param {VoidFunctionType} props.handleNewQuestion - Callback function to handle creating a new question
 * @returns {JSX.Element} The rendered QuestionHeader component
 */
const QuestionHeader = ({
  title_text,
  qcnt,
  setQuestionOrder,
  handleNewQuestion,
}: QuestionHeaderProps) => {
  return (
    <PageHeader
      title={"All Questions"}
      count={qcnt}
      actions={
        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleNewQuestion}
          startIcon={<AddIcon />}
          sx={{ fontWeight: 'medium' }}
        >
          Ask a Question
        </Button>
      }
      secondaryActions={
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          {["newest", "active", "unanswered"].map((message, idx) => (
            <OrderButton
              key={idx}
              message={message}
              setQuestionOrder={setQuestionOrder}
            />
          ))}
        </Box>
      }
    />
  );
};

export default QuestionHeader;
