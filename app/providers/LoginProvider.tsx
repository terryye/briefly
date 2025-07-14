"use client";
import { createContext, useContext, useState } from "react";
import Login from "../components/ui/Login";

interface LoginContextType {
    showLogin: () => void;
}

const LoginContext = createContext<LoginContextType>({
    showLogin: () => {},
});

export const LoginProvider = ({ children }: { children: React.ReactNode }) => {
    const [display, setDisplay] = useState(false);
    // Implement login, logout, and other auth logic here
    const showLogin = () => {
        setDisplay(true);
    };

    // Provide the context value
    const contextValue = { showLogin };

    return (
        <LoginContext.Provider value={contextValue}>
            {children}
            {display && <Login onClose={() => setDisplay(false)} />}
        </LoginContext.Provider>
    );
};

export const useLogin = () => {
    const context = useContext(LoginContext);
    if (!context) {
        throw new Error("useLogin must be used within a LoginProvider");
    }
    return context;
};
