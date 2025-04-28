// ProtectedRoute.jsx
import React, { useContext, useEffect } from "react";
import PropTypes from "prop-types";
import { Navigate } from "react-router-dom";
import { AppContext } from "../../context/AppContext";
import { getCookie } from "../../utils";
/**
 * A route component that protects content from unauthenticated users
 * 
 * This component checks if the user is authenticated by verifying the presence
 * of a token in cookies. If authenticated, it renders the child components;
 * otherwise, it redirects to the login page. It also ensures the user data is
 * properly loaded into the application state.
 * 
 * @param {Object} props - The component props
 * @param {React.ReactNode} props.children - The child components to render when authenticated
 * @returns {JSX.Element} The protected route component that either renders children or redirects
 */
const ProtectedRoute = ({ children }) => {
  const { state, dispatch } = useContext(AppContext);
  
  const token = getCookie("token");
  const user = getCookie("user");

  useEffect(() => {
    if (user && !state.user) {
      dispatch({ type: "SET_USER", payload: JSON.parse(user) });
    }
  }, [user, state.user, dispatch]);

  return token ? children : <Navigate to="/login" />;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProtectedRoute;
