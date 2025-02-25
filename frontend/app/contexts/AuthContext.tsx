"use client";

import React, {createContext, useContext, useEffect, useState} from "react";
import {getUser, login, logout, signup, resetPassword, User} from "@/app/api/auth";

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<{ message: string }>;
    signup: (username: string, password: string) => Promise<{ message: string }>;
    logout: () => Promise<void>;
    resetPassword: (username:string, password: string) => Promise<{ message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        // check user state
        getUser().then((user) => setUser(user));
    }, []);

    const handleLogin = async (username: string, password: string) => {
        try{
            const result = await login(username, password);
            setTimeout(() => {  // Give 2 sec to holding
                window.location.href = "/transactions";
            }, 2000);

            return result;
        }catch(error) {
            console.error("Login failed", error);
            throw new Error("Login failed");
        }
    };

    const handleSignup = async (username: string, password: string) => {
        return await signup(username, password);
    };

    const handleLogout = async () =>{
        try {
            await logout();
            localStorage.clear();
            setUser(null);
            window.location.href = "/auth/login";
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    const handleResetPassword = async (username: string, password: string) => {
        try {
            const result = await resetPassword(username, password);
            setTimeout(() => {  // Give 2 sec to holding
                window.location.href = "/auth/login";
            }, 2000);

            return result;
        } catch (error) {
            console.error("Reset password failed", error);
            throw new Error("Reset password failed");
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login: handleLogin,
                signup: handleSignup,
                logout: handleLogout,
                resetPassword: handleResetPassword,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
