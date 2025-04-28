import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

/**
 * Custom hook for handling header functionality
 * @returns header state and handlers
 */
export const useHeader = () => {
  const [searchString, setSearchString] = useState("");
  const { state, dispatch } = useContext(AppContext);
  const navigate = useNavigate();

  const handleSearch = (searchTerm: string) => {
    dispatch({ type: "SET_SEARCH", payload: searchTerm });
  };

  const handleSearchString = (searchTerm: string) => {
    setSearchString(searchTerm);
  };

  const handleLogout = () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    dispatch({ type: "SET_USER", payload: null });
    navigate("/login");
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter') {
      handleSearch(searchString);
    }
  };

  return {
    user: state.user,
    search: state.search,
    searchString,
    handleSearch,
    handleSearchString,
    handleLogout,
    handleKeyDown
  };
};
