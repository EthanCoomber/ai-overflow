import "./App.css";
import React from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AppProvider } from "./context/AppContext";
import Header from "./components/header";
import HomePage from "./pages/homePage/HomePage";
import TagPage from "./pages/tagPage/TagPage";
import AnswerPage from "./pages/answerPage/AnswerPage";
import NewQuestionPage from "./pages/newQuestionPage/NewQuestionPage";
import NewAnswerPage from "./pages/newAnswerPage/NewAnswerPage";
import SideBarNav from "./components/main/sideBarNav/sideBarNavView";
import Login from "./pages/loginPage/LoginPage";
import Signup from "./pages/signupPage/SignUpPage";
import ProtectedRoute from "./components/protectedRoute/ProtectedRoute";

// Create a Layout component to handle conditional rendering of Header and SideBarNav
const Layout = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const isAuthPage = location.pathname === "/login" || location.pathname === "/signup";

  return (
    <div className="layout-container">
      {!isAuthPage && <SideBarNav />}
      <div className="content-container">
        {!isAuthPage && <Header />}
        {children}
      </div>
    </div>
  );
};

const App = () => (
  <AppProvider>
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <Layout>
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/tags"
          element={
            <Layout>
              <ProtectedRoute>
                <TagPage />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/question/:qid"
          element={
            <Layout>
              <ProtectedRoute>
                <AnswerPage />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/new-question"
          element={
            <Layout>
              <ProtectedRoute>
                <NewQuestionPage />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route
          path="/new-answer/:qid"
          element={
            <Layout>
              <ProtectedRoute>
                <NewAnswerPage />
              </ProtectedRoute>
            </Layout>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  </AppProvider>
);

export default App;