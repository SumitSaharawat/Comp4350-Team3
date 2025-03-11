"use client";

import React, {createContext, useContext, useEffect, useState} from "react";
import { Goal, getGoalsFromServer } from "@/app/api/goal";

interface GoalsContextType {
    goals: Goal[];
    getGoals: (userId: string) => Promise<boolean>;
}

const GoalsContext = createContext<GoalsContextType>({
    goals: [],
    getGoals: async ()=> false,
})

export function GoalsProvider({ children }: { children: React.ReactNode }) {
    const [goals, setGoals] = useState<Goal[]>([]);

    const handleGetGoals = async (userId: string) => {
        const data = await getGoalsFromServer(userId);
        if (Array.isArray(data)) {
            setGoals(data);
            return true;
        }
        return false;
    };

    return (
        <GoalsContext.Provider
            value={{
                goals,
                getGoals: handleGetGoals,
            }}
        >
            {children}
        </GoalsContext.Provider>
    );
}

export function useGoals() {
    const context = useContext(GoalsContext);
    if (!context) {
        throw new Error("use Goal must be used within a GoalsProvider");
    }
    return context;
}