import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/userService";
import { AppContext } from "../context/AppContext";

/**
 * Custom hook for handling user login functionality
 * @returns login state and handlers
 */
export const useLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { dispatch } = useContext(AppContext);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { token, user } = await login(email, password);
      
      const setCookie = (name: string, value: string, days = 7) => {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        const expires = `expires=${date.toUTCString()}`;
        document.cookie = `${name}=${value};${expires};path=/`;
      };
      
      setCookie("token", token);
      setCookie("user", JSON.stringify(user));
      
      dispatch({ type: "SET_USER", payload: user });
      navigate("/");
    } catch (err) {
      setError("Invalid credentials or server error");
    }
  };

  return {
    email,
    password,
    error,
    handleEmailChange,
    handlePasswordChange,
    handleSubmit
  };
};
