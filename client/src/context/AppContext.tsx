// context/AppContext.tsx
import React, { createContext, useReducer } from "react";
import { IUser } from "../types/userTypes";
import { QuestionResponseType } from "../types/entityTypes";
import { getCookie, setCookie } from "../utils";

type AppState = {
  search: string;
  mainTitle: string;
  questionOrder: string;
  qid: string;
  user: IUser | null;
  questionList: QuestionResponseType[];
};

type AppAction = {
  type: string;
  payload: unknown;
};


const initialState = {
  search: "",
  mainTitle: "All Questions",
  questionOrder: "newest",
  qid: "",
  user: getCookie("user") ? JSON.parse(getCookie("user") || "null") : null,
  questionList: []
};

export const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}>({
  state: initialState,
  dispatch: () => {
    // This is a placeholder function that will be replaced by the actual dispatch
    // from useReducer when the context is used within the AppProvider
  }
});
export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, dispatch] = useReducer<React.Reducer<AppState, AppAction>>(
    (state: AppState, action: AppAction): AppState => {
      switch (action.type) {
        case "SET_SEARCH":
          return { ...state, search: action.payload as string };
        case "SET_MAIN_TITLE":
          return { ...state, mainTitle: action.payload as string };
        case "SET_QUESTION_ORDER":
          return { ...state, questionOrder: action.payload as string };
        case "SET_QID":
          return { ...state, qid: action.payload as string };
        case "SET_USER":
          const user = action.payload as IUser;
          setCookie("user", JSON.stringify(user));
          return { ...state, user };
        case "SET_QUESTION_LIST":
          return { ...state, questionList: action.payload as QuestionResponseType[] };
        default:
          return state;
      }
    },
    initialState
  );
  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};
