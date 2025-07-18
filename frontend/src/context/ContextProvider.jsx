import { useState } from "react";
import { createContext } from "react";
import { useNavigate } from "react-router-dom";


export const AppContext=createContext()


export const ContextProvider=({children})=>{
    const [user, setuser] = useState(false)
    const [loading, setloading] = useState(false)
    const [theme, settheme] = useState("dark")
    const navigate=useNavigate();

    const value={
        user,
        setuser,
        loading,
        setloading,
        theme,
        settheme,
        navigate
    }
    return(
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    )
}


export default {AppContext,ContextProvider}