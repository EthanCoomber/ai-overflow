import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { signup } from "../services/userService";
import { AppContext } from "../context/AppContext";

/**
 * A custom hook to handle the state and logic for the signup page.
 * It manages form state, validation, and the signup process.
 * 
 * @returns The state and functions required for the signup page
 */
export const useSignUpPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  
  const navigate = useNavigate();
  const { dispatch } = useContext(AppContext);

  // Helper function to set cookie
  const setCookie = (name: string, value: string, days = 7) => {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = `expires=${date.toUTCString()}`;
    document.cookie = `${name}=${value};${expires};path=/`;
  };

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate password length
    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
      return;
    }
    
    try {
      const { user, token } = await signup(username, email, password);
      console.log("Signup successful:", { user, token });
      setCookie("token", token);
      setCookie("user", JSON.stringify(user));
      dispatch({ type: "SET_USER", payload: user });
      navigate("/");
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'response' in err && 
          err.response && typeof err.response === 'object' && 
          'status' in err.response && err.response.status === 409) {
        setError("User with this email or username already exists.");
      } else {
        setError("Error during signup. Please try again.");
      }
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    
    // Clear error when typing or validate on change
    if (newPassword.length === 0) {
      setPasswordError("");
    } else if (newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters long");
    } else {
      setPasswordError("");
    }
  };

  return {
    username,
    setUsername,
    email,
    setEmail,
    password,
    error,
    passwordError,
    handleSignup,
    handlePasswordChange
  };
};
