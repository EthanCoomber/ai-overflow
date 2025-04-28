import { useEffect, useContext } from "react";
import { getQuestionsByFilter, upvoteQuestion } from "../services/questionService";
import { OrderFunctionType, ClickTagFunctionType, IdFunctionType } from "../types/functionTypes";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { getCookie, setCookie } from "../utils";

/**
 * A custom hook to handle the state and logic for fetching questions based on the filter parameters.
 * The hook interacts with the question service to fetch questions based on the order and search query entered by the user.
 * @returns the list of questions fetched based on the filter parameters
 */
export const useQuestionPage = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(AppContext);

  const title_text = state.search ? "Search Results" : "All Questions";

  /**
   * The effect to fetch questions based on the filter parameters.
   * 
   * the effect runs when the order or search query changes.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("fetching questions", state.questionOrder, state.search);
        const res = await getQuestionsByFilter(state.questionOrder, state.search);
        console.log("questions fetched", res);
        dispatch({ type: "SET_QUESTION_LIST", payload: res || [] });
      } catch (error) {
        console.error("Error fetching questions:", error);
      }
    };

    fetchData();
  }, [state.questionOrder, state.search, dispatch]);


  // Define handlers for the page
  const setQuestionOrder: OrderFunctionType = (newOrder) => {
    dispatch({ type: "SET_QUESTION_ORDER", payload: newOrder });
  };

  const clickTag: ClickTagFunctionType = (tagName) => {
    navigate(`/?search=[${tagName}]`);
  };

  const handleAnswer: IdFunctionType = (questionId) => {
    navigate(`/question/${questionId}`);
  };

  const handleNewQuestion = () => {
    navigate("/new-question");
  };

  const handleUpvote: IdFunctionType = async (questionId) => {
    const votedCookie = getCookie("votedQuestions") || "[]";
    const votedQuestions = JSON.parse(votedCookie);

    if (votedQuestions.includes(questionId)) {
      return;
    }

    try {
      const res = await upvoteQuestion(questionId);
      if (!res) {
        return;
      }
      const updatedVotes = [...votedQuestions, questionId];
      setCookie("votedQuestions", JSON.stringify(updatedVotes));

      dispatch({
        type: "SET_QUESTION_LIST",
        payload: state.questionList.map((q) =>
          q._id === questionId ? { ...q, votes: (q.votes || 0) + 1 } : q
        )
      });
    } catch (error) {
      console.error("Failed to upvote the question:", error);
    }
  };



  return { qlist: state.questionList, setQuestionOrder, clickTag, handleAnswer, handleNewQuestion, handleUpvote, order: state.questionOrder, title_text };
};
