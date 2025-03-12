"use client";

import React, {createContext, useContext, useState} from "react";
import { Goal, getGoalsFromServer, addGoalToServer } from "@/app/api/goal";

interface GoalsContextType {
    goals: Goal[];
    getGoals: (userId: string) => Promise<boolean>;
    addGoal: (userId: string,
              name: string,
              time: string,
              currAmount: number,
              goalAmount: number,
              category: string) => Promise<{message: string}>;
}

const GoalsContext = createContext<GoalsContextType | undefined>(undefined);

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

    const handleAddGoal = async (
        userId: string,
        name: string,
        time: string,
        currAmount: number,
        goalAmount: number,
        category: string) => {

        try {
            return await addGoalToServer(userId, name, time, currAmount, goalAmount, category);
        } catch (error) {
            console.error("add new Goal", error);
            throw new Error(
                error instanceof Error ? error.message : "Add goal failed"
            );
        }
    };

    return (
        <GoalsContext.Provider
            value={{
                goals,
                getGoals: handleGetGoals,
                addGoal: handleAddGoal,
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
