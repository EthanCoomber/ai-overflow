import { AnswerType } from "./entityTypes";
import { Tag } from "./entityTypes";
import { ClickTagFunctionType, IdFunctionType, MessageFunctionType, StringFunctionType, VoidFunctionType } from "./functionTypes";

/**
 * Interface defining the props for the Answer component
 * @interface AnswerProps
 * @property {string} text - The content of the answer
 * @property {string} ansBy - The username of the person who provided the answer
 * @property {string} meta - Metadata about the answer (e.g., timestamp)
 */
interface AnswerProps {
    text: string;
    ansBy: string;
    meta: string;
  }

  /**
 * Interface defining the props for the AnswerHeader component
 * @interface AnswerHeaderProps
 * @property {number} ansCount - The number of answers for the question
 * @property {string} title - The title of the question being answered
 */
interface AnswerHeaderProps {
    ansCount: number;
    title: string;
  }

  /**
 * Interface defining the props for the QuestionBody component
 * @interface QuestionBodyProps
 * @property {number} views - The number of views the question has received
 * @property {number} votes - The number of votes the question has received
 * @property {string} text - The content/body of the question
 * @property {string} askby - The username of the person who asked the question
 * @property {string} meta - Metadata about the question (e.g., timestamp)
 */
interface QuestionBodyProps {
    views: number;
    votes: number;
    text: string;
    askby: string;
    meta: string;
    handleUpvote: VoidFunctionType;
    qid: string;
  }

  /**
 * Interface defining the props for the FormField component
 * @interface FormFieldProps
 * @property {string} title - The label text for the form field
 * @property {boolean} [mandatory=true] - Whether the field is required or not
 * @property {string} [hint] - Optional hint text to display below the title
 * @property {string} [error] - Optional error message to display
 * @property {React.ReactNode} children - The form input element(s) to render
 */
interface FormFieldProps {
    title: string;
    mandatory?: boolean;
    hint?: string;
    error?: string;
    children: React.ReactNode;
  }

  /**
 * Interface defining the props for the Input component
 * @interface InputProps
 * @property {string} title - The label text for the input field
 * @property {string} [hint] - Optional hint text to display below the title
 * @property {string} id - The HTML id attribute for the input element
 * @property {boolean} [mandatory=true] - Whether the field is required or not
 * @property {string} val - The current value of the input field
 * @property {StringFunctionType} setState - Callback function to update the input value
 * @property {string} [err] - Optional error message to display
 */
interface InputProps {
    title: string;
    hint?: string;
    id: string;
    mandatory?: boolean;
    val: string;
    setState: StringFunctionType;
    err?: string;
  }

  /**
 * Interface defining the props for the PageHeader component
 * @interface PageHeaderProps
 * @property {string} title - The title text to display in the header
 * @property {number} [count] - Optional count to display with the title
 * @property {React.ReactNode} [actions] - Optional primary actions to display on the right side
 * @property {React.ReactNode} [secondaryActions] - Optional secondary actions to display in a separate row
 */
interface PageHeaderProps {
    title: string;
    count?: number;
    actions?: React.ReactNode;
    secondaryActions?: React.ReactNode;
  }


/**
 * Interface defining the props for the Textarea component
 * @interface TextareaProps
 * @property {string} title - The label text for the textarea field
 * @property {boolean} [mandatory=true] - Whether the field is required or not
 * @property {string} [hint] - Optional hint text to display below the title
 * @property {string} id - The HTML id attribute for the textarea element
 * @property {string} val - The current value of the textarea field
 * @property {StringFunctionType} setState - Callback function to update the textarea value
 * @property {string} [err] - Optional error message to display
 */
interface TextareaProps {
    title: string;
    mandatory?: boolean;
    hint?: string;
    id: string;
    val: string;
    setState: StringFunctionType;
    err?: string;
  }

  /**
 * Interface defining the props for the OrderButton component
 * @interface OrderButtonProps
 * @property {string} message - The ordering option text (e.g., "newest", "active", "unanswered")
 * @property {MessageFunctionType} setQuestionOrder - Callback function to update the question order
 */
interface OrderButtonProps {
    message: string;
    setQuestionOrder: MessageFunctionType;
  }

  /**
 * Interface defining the props for the QuestionHeader component
 * @interface QuestionHeaderProps
 * @property {string} title_text - The title text for the header
 * @property {number} qcnt - The count of questions to display
 * @property {MessageFunctionType} setQuestionOrder - Callback function to update the question order
 * @property {VoidFunctionType} handleNewQuestion - Callback function to handle creating a new question
 */
interface QuestionHeaderProps {
    title_text: string;
    qcnt: number;
    setQuestionOrder: MessageFunctionType;
    handleNewQuestion: VoidFunctionType;
  }
  
  /**
 * Interface defining the props for the Question component
 * @interface QuestionProps
 * @property {Object} q - The question object containing all question data
 * @property {string} q._id - Unique identifier for the question
 * @property {AnswerType[]} q.answers - Array of answers for the question
 * @property {number} q.views - Number of views the question has received
 * @property {number} q.votes - Number of votes the question has received
 * @property {string} q.title - Title of the question
 * @property {Tag[]} q.tags - Array of tags associated with the question
 * @property {string} q.asked_by - Username of the person who asked the question
 * @property {string} q.ask_date_time - Timestamp when the question was asked
 * @property {Object[]} [q.comments] - Optional array of comments on the question
 * @property {string} q.comments.text - The comment text
 * @property {string} [q.comments.comment_by] - Username of the commenter
 * @property {string} q.comments.comment_time - Timestamp when the comment was posted
 * @property {ClickTagFunctionType} clickTag - Callback function to handle tag clicks
 * @property {IdFunctionType} handleAnswer - Callback function to handle viewing answers
 * @property {IdFunctionType} handleUpvote - Callback function to handle upvoting
 */
interface QuestionProps {
    q: {
      _id: string;
      answers: AnswerType[];
      views: number;
      votes: number;
      title: string;
      tags: Tag[];
      asked_by: string;
      ask_date_time: string;
      comments?: {
        text: string;
        comment_by?: string;
        comment_time: string;
      }[];
    };
    clickTag: ClickTagFunctionType;
    handleAnswer: IdFunctionType;
    handleUpvote: IdFunctionType;
  }

  /**
 * Interface defining the props for the Tag component
 * @interface TagProps
 * @property {Object} t - The tag object containing tag data
 * @property {string} t.name - The name of the tag
 * @property {number} t.qcnt - The number of questions associated with this tag
 * @property {ClickTagFunctionType} clickTag - Callback function to handle tag clicks
 */
interface TagProps {
    t: {
      name: string;
      qcnt: number;
    };
    clickTag: ClickTagFunctionType;
  }

  /**
 * Interface defining the props for the QuestionContent component
 * @interface QuestionContentProps
 * @property {Object} q - The question object containing all question data
 * @property {ClickTagFunctionType} clickTag - Callback function to handle tag clicks
 * @property {IdFunctionType} handleAnswer - Callback function to handle viewing answers
 */
interface QuestionContentProps {
  q: {
    _id: string;
    answers: AnswerType[];
    views: number;
    votes: number;
    title: string;
    tags: Tag[];
    asked_by: string;
    ask_date_time: string;
    comments?: {
      text: string;
      comment_by?: string;
      comment_time: string;
    }[];
  };
    clickTag: ClickTagFunctionType;
    handleAnswer: IdFunctionType;
  }

  /**
 * Interface defining the props for the QuestionStats component
 * @interface QuestionStatsProps
 * @property {Object} q - The question object containing all question data
 * @property {IdFunctionType} handleUpvote - Callback function to handle upvoting
 */
interface QuestionStatsProps {
  q: {
    _id: string;
    answers: AnswerType[];
    views: number;
    votes: number;
    title: string;
    tags: Tag[];
    asked_by: string;
    ask_date_time: string;
    comments?: {
      text: string;
      comment_by?: string;
      comment_time: string;
    }[];
  };
    handleUpvote: IdFunctionType;
    hasVoted: boolean;
  }

  /**
 * Interface defining the props for the QuestionMeta component
 * @interface QuestionMetaProps
 * @property {Object} q - The question object containing all question data
 * @property {string} q.asked_by - Username of the person who asked the question
 * @property {string} q.ask_date_time - Timestamp when the question was asked
 */
interface QuestionMetaProps {
  q: {
    _id: string;
    answers: AnswerType[];
    views: number;
    votes: number;
    title: string;
    tags: Tag[];
    asked_by: string;
    ask_date_time: string;
    comments?: {
      text: string;
      comment_by?: string;
      comment_time: string;
    }[];
  };
    handleAnswer: IdFunctionType;
  }
  
  /**
 * Interface defining the props for the Comments component
 * @interface CommentsProps
 * @property {Array} comments - The list of comments to display
 * @property {string} commentText - The current text in the comment input
 * @property {Function} setCommentText - Function to update the comment text
 * @property {Function} handleCommentSubmit - Function to handle comment submission
 */
interface CommentsProps {
    comments: {
      text: string;
      comment_by?: string;
      comment_time: string;
    }[];
    commentText: string;
    setCommentText: StringFunctionType;
    handleCommentSubmit: VoidFunctionType;
  }

  /**
 * Interface defining the props for the AIAnswer component
 * @interface AIAnswerProps
 * @property {string} displayedAIAnswer - The AI-generated answer text to display
 * @property {boolean} isTyping - Whether the AI is currently generating the answer
 * @property {boolean} aiError - Whether there was an error with the AI answer
 * @property {boolean} fetchingAIAnswerError - Whether there was an error fetching the AI answer
 * @property {string} errorMessage - The error message to display if there was an error
 */
interface AIAnswerProps {
    displayedAIAnswer: string;
    isTyping: boolean;
    aiError: boolean;
    fetchingAIAnswerError: boolean;
    errorMessage: string;
  }

  /**
 * Interface defining the props for the ActionButtons component
 * @interface ActionButtonsProps
 * @property {VoidFunctionType} handleNewAnswer - Function to handle creating a new answer
 * @property {VoidFunctionType} fetchAIAnswer - Function to fetch an AI-generated answer
 * @property {boolean} fetchingAIAnswer - Whether an AI answer is currently being fetched
 * @property {boolean} isTyping - Whether the AI is currently generating text
 * @property {string} displayedAIAnswer - The current AI answer being displayed
 * @property {boolean} fetchingAIAnswerError - Whether there was an error fetching the AI answer
 */
interface ActionButtonsProps {
  handleNewAnswer: VoidFunctionType;
  fetchAIAnswer: VoidFunctionType;
  fetchingAIAnswer: boolean;
  isTyping: boolean;
  displayedAIAnswer: string;
  fetchingAIAnswerError: boolean;
}

export type { 
    AnswerProps, 
    AnswerHeaderProps, 
    QuestionBodyProps, 
    FormFieldProps, 
    InputProps, 
    PageHeaderProps, 
    TextareaProps, 
    OrderButtonProps, 
    QuestionHeaderProps, 
    QuestionProps,
    TagProps,
    QuestionContentProps,
    QuestionStatsProps,
    QuestionMetaProps,
    CommentsProps,
    AIAnswerProps,
    ActionButtonsProps
};