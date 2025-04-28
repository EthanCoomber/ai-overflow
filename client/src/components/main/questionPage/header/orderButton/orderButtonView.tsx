import { Button } from "@mui/material";
import { useContext } from "react";
import { AppContext } from "../../../../../context/AppContext";
import { OrderButtonProps } from "../../../../../types/componentPropTypes";
/**
 * Renders a button for selecting question ordering options
 * 
 * This component displays an order option that can be selected to change
 * how questions are sorted. The active ordering option is visually highlighted.
 * 
 * @param {OrderButtonProps} props - The component props
 * @param {string} props.message - The ordering option text
 * @param {MessageFunctionType} props.setQuestionOrder - Callback function to update the question order
 * @returns {JSX.Element} The rendered OrderButton component
 */
const OrderButton = ({ message, setQuestionOrder }: OrderButtonProps) => {
  const { state, dispatch } = useContext(AppContext);
  const isActive = state.questionOrder === message;
  
  return (
    <Button
      variant={isActive ? "contained" : "outlined"}
      color="primary"
      size="small"
      sx={{ 
        textTransform: 'none',
        mx: 0.5,
        fontWeight: 'medium'
      }}
      onClick={() => {
        dispatch({ type: "SET_QUESTION_ORDER", payload: message });
        setQuestionOrder(message);
      }}
    >
      {message.charAt(0).toUpperCase() + message.slice(1)}
    </Button>
  );
};

export default OrderButton;
