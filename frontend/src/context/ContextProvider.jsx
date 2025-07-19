import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

export const ContextProvider = ({ children }) => {
  const [user, setuser] = useState(localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null);
  const [token, settoken] = useState(initialState => localStorage.getItem("token") || null);
  const [loading, setloading] = useState(false);
  const [theme, settheme] = useState(() => localStorage.getItem("theme") || "dark");
  const navigate = useNavigate();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);


  const value = {
    user,
    setuser,
    loading,
    setloading,
    theme,
    settheme,
    navigate,
    token,
    settoken
  };
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};