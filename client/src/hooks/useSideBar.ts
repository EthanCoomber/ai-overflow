import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

/**
 * Custom hook for sidebar navigation functionality
 * 
 * This hook provides navigation functions and state for the sidebar navigation component.
 * It handles navigation between different sections while managing application state.
 * 
 * @returns {Object} Navigation state and handlers
 * @returns {boolean} isQuestionsSelected - Whether the questions section is currently selected
 * @returns {boolean} isTagsSelected - Whether the tags section is currently selected
 * @returns {Function} handleQuestions - Function to navigate to the questions page
 * @returns {Function} handleTags - Function to navigate to the tags page
 */
const useSideBar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname;
  const { dispatch } = useContext(AppContext);
  
  // Determine which menu item is selected based on the current path
  const isQuestionsSelected = path === "/" || path.includes("/question") || path.includes("/new-question");
  const isTagsSelected = path === "/tags";

  /**
   * Handles navigation to the questions page
   * Resets question order to "newest" and clears search before navigation
   */
  const handleQuestions = () => {
    dispatch({ type: "SET_QUESTION_ORDER", payload: "newest" });
    dispatch({ type: "SET_SEARCH", payload: "" });
    navigate("/");
  };

  /**
   * Handles navigation to the tags page
   * Resets question order to "newest" and clears search before navigation
   */
  const handleTags = () => {
    dispatch({ type: "SET_QUESTION_ORDER", payload: "newest" });
    dispatch({ type: "SET_SEARCH", payload: "" });
    navigate("/tags");
  };

  return {
    isQuestionsSelected,
    isTagsSelected,
    handleQuestions,
    handleTags
  };
};

export default useSideBar;
