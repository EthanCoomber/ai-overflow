import "./homePageView.css";
import QuestionHeader from "../../components/main/questionPage/header/headerView";
import Question from "../../components/main/questionPage/question/questionView";
import { useQuestionPage } from "../../hooks/useQuestionPage";

const HomePage = () => {
  const { qlist, setQuestionOrder, clickTag, handleAnswer, handleNewQuestion, handleUpvote, title_text } = useQuestionPage();

  return (
    <>
      <QuestionHeader
        title_text={title_text}
        qcnt={qlist.length}
        setQuestionOrder={setQuestionOrder}
        handleNewQuestion={handleNewQuestion}
      />
      <div id="question_list" className="question_list">
        {qlist.map((q, idx) => (
          <Question
            q={q}
            key={q._id} // Using a stable key based on question ID
            clickTag={clickTag}
            handleAnswer={handleAnswer}
            handleUpvote={handleUpvote}
          />
        ))}
      </div>
      {title_text === "Search Results" && !qlist.length && (
        <div className="bold_title right_padding">No Questions Found</div>
      )}
    </>
  );
};

export default HomePage;
