import { useEffect, useState, useContext } from "react";
import { getQuestionById, getAIAnswer, addCommentToQuestion, upvoteQuestion } from "../services/questionService";
import { QuestionResponseType } from "../types/entityTypes";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import { ErrorWithResponse } from "../types/errorTypes";
import { getCookie, setCookie } from "../utils";

/**
 * The custom hook is used to fetch a question by its id.
 * @param qid the id of the question to fetch
 * @returns the state of the question viewer component.
 */
export const useAnswerPage = (qid: string) => {
  const [question, setQuestion] = useState<QuestionResponseType | null>(null);
  const [aiAnswer, setAIAnswer] = useState<string | null>(null);
  const [fetchingAIAnswer, setFetchingAIAnswer] = useState<boolean>(false);
  const [fetchingAIAnswerError, setFetchingAIAnswerError] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();
  const [displayedAIAnswer, setDisplayedAIAnswer] = useState("");
  const [aiError, setAiError] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    if (qid) {
      dispatch({ type: "SET_QID", payload: qid });
    }
  }, [qid, dispatch]);

  useEffect(() => {
    if (aiAnswer) {
      if (typeof aiAnswer !== 'string') {
        setAiError(true);
        return;
      }

      setAiError(false);
      setIsTyping(true);
      setDisplayedAIAnswer("");
      let index = 0;
      const timer = setInterval(() => {
        if (index < aiAnswer.length) {
          setDisplayedAIAnswer(aiAnswer.slice(0, index + 1));
          index++;
        } else {
          clearInterval(timer);
          setIsTyping(false);
        }
      }, 15);

      return () => clearInterval(timer);
    }
  }, [aiAnswer]);

  useEffect(() => {
    if (fetchingAIAnswerError) {
      setAiError(true);
      setErrorMessage("There was an error generating the AI answer");
    }
  }, [fetchingAIAnswerError]);

  const handleNewQuestion = () => {
    navigate("/new-question");
  };

  const handleNewAnswer = () => {
    navigate(`/new-answer/${qid}`);
  };

  const handleCommentSubmit = async () => {
    try {
      if (!qid || !commentText.trim()) return;
      const exists = await getQuestionById(qid);
      console.log('exists', exists);
      if (!exists) {
        setErrorMessage("Question not found");
        return;
      }
      const username = state.user?.username || "anonymous";
      await addCommentToQuestion(qid, {
        text: commentText,
        comment_by: username,
      });
      const updated = await getQuestionById(qid);
      console.log('updated', updated);
      setQuestion(updated);
      setCommentText("");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleUpvote = async () => {
    if (!qid || !question) return;

    const votedCookie = getCookie("votedQuestions") || "[]";
    const votedQuestions = JSON.parse(votedCookie);

    if (votedQuestions.includes(qid)) {
      return;
    }

    try {
      const res = await upvoteQuestion(qid);
      if (!res) {
        return;
      }
      const updatedVotes = [...votedQuestions, qid];
      setCookie("votedQuestions", JSON.stringify(updatedVotes));

      // Update the local question state with the new vote count
      setQuestion(prevQuestion => {
        if (!prevQuestion) return null;
        return {
          ...prevQuestion,
          votes: (prevQuestion.votes || 0) + 1
        };
      });
    } catch (error) {
      console.error("Failed to upvote the question:", error);
    }
  };

  /**
   * A useEffect hook in React is used to manage side effects of a component.
   * A side effect is an operation that interacts with the outside world, e.g., an API call.
   * The hook ensures that the side effect is executed when the component is rendered and only when its dependencies change.
   * 
   * In this case, the hook will execute only when the question is rendered and if the question id changes.
   * The question id is passed as a dependency to the hook.
   * 
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log('qid in useAnswerPage', qid);
        if (!qid) return;
        console.log('looking for question with id', qid);
        const res = await getQuestionById(qid);
        console.log("res", res);
        setQuestion(res || null);
      } catch (error) {
        console.error("Error fetching question:", error);
      }
    };
    fetchData();
  }, [qid]);

  const fetchAIAnswer = async () => {
    try {
      setFetchingAIAnswer(true);
      setFetchingAIAnswerError(false);
      setErrorMessage("");
      const res = await getAIAnswer(qid);
      setAIAnswer(res || null);
      setFetchingAIAnswer(false);
    } catch (error: unknown) {
      console.error("Error fetching AI answer:", JSON.stringify(error, null, 2));
      setFetchingAIAnswer(false);
      setFetchingAIAnswerError(true);

      const isErrorWithResponse = (err: unknown): err is ErrorWithResponse => {
        return typeof err === 'object' && err !== null;
      };

      if (isErrorWithResponse(error)) {
        console.log("Error fetching AI answer status:", error.response, error.status);

        // Handle specific error status codes
        if (error.response?.status === 429 || error.status === 429) {
          setErrorMessage("Too many requests. Please try again later.");
        } else if (error.response?.status === 500 || error.status === 500) {
          setErrorMessage("Service unavailable. Please try again later.");
        } else if (error.response?.data?.error) {
          setErrorMessage(error.response.data.error);
        } else {
          setErrorMessage("There was an error generating the AI answer");
        }
      } else {
        setErrorMessage("There was an error generating the AI answer");
      }
    }
  };

  return {
    question,
    aiAnswer,
    fetchingAIAnswer,
    fetchAIAnswer,
    fetchingAIAnswerError,
    errorMessage,
    handleNewQuestion,
    handleNewAnswer,
    isTyping,
    aiError,
    displayedAIAnswer,
    handleCommentSubmit,
    commentText,
    setCommentText,
    handleUpvote
  }
};
