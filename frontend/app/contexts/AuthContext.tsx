"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import {
    login,
    logout,
    signup,
    resetPassword,
    User,
    getUser,
} from "@/app/api/auth";

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<{ message: string }>;
    signup: (
        username: string,
        password: string
    ) => Promise<{ message: string }>;
    logout: () => Promise<void>;
    resetPassword: (
        username: string,
        password: string
    ) => Promise<{ message: string }>;
    getUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);

    // useEffect(() => {
    //     // check user state
    //     getUser().then((user) => setUser(user));
    // }, []);

    // get user info from localStorage (after refreshed page)
    // useEffect(() => {
    //     const storedUser = localStorage.getItem("user");
    //     if (storedUser) {
    //         setUser(JSON.parse(storedUser));
    //     }
    // }, []);

    const handleLogin = async (username: string, password: string) => {
        try {
            const result = await login(username, password);
            localStorage.setItem("username", result.user.username);
            setUser(result.user);
            setTimeout(() => {
                // Give 1 sec to holding
                window.location.href = "/transactions";
            }, 1000);

            return result;
        } catch (error) {
            console.error("Login failed", error);
            throw new Error(
                error instanceof Error ? error.message : "Login failed"
            );
        }
    };

    const handleSignup = async (username: string, password: string) => {
        try {
            const result = await signup(username, password);
            setTimeout(() => {
                // Give 1 sec to holding
                window.location.href = "/auth/login";
            }, 1000);

            return result;
        } catch (error) {
            console.error("Signup failed", error);
            throw new Error(
                error instanceof Error ? error.message : "Signup failed"
            );
        }
    };

    const handleLogout = async () => {
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
            setTimeout(() => {
                // Give 1 sec to holding
                window.location.href = "/auth/login";
            }, 1000);

            return result;
        } catch (error) {
            console.error("Reset password failed", error);
            throw new Error(
                error instanceof Error ? error.message : "Reset password failed"
            );
        }
    };

    const handleGetUser = async () => {
        const receivedUser = await getUser();
        setUser(receivedUser);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                login: handleLogin,
                signup: handleSignup,
                logout: handleLogout,
                resetPassword: handleResetPassword,
                getUser: handleGetUser,
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
