"use client";

import React, { createContext, useContext, useState } from "react";
import {
    Goal,
    getGoalsFromServer,
    addGoalToServer,
    editGoalToServer,
    deleteGoalToServer,
} from "@/app/api/goal";

interface GoalsContextType {
    goals: Goal[];
    getGoals: (userId: string) => Promise<boolean>;
    addGoal: (
        userId: string,
        name: string,
        time: string,
        currAmount: number,
        goalAmount: number,
        category: string
    ) => Promise<{ message: string }>;
    editGoal: (
        goalId: string,
        name: string,
        time: string,
        currAmount: number,
        goalAmount: number,
        category: string
    ) => Promise<{ message: string }>;
    deleteGoal: (goalId: string) => Promise<{ message: string }>;
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
        category: string
    ) => {
        try {
            return await addGoalToServer(
                userId,
                name,
                time,
                currAmount,
                goalAmount,
                category
            );
        } catch (error) {
            throw new Error(
                error instanceof Error ? error.message : "Add goal failed"
            );
        }
    };

    const handleEditGoal = async (
        goalId: string,
        name: string,
        time: string,
        currAmount: number,
        goalAmount: number,
        category: string
    ) => {
        try {
            return await editGoalToServer(
                goalId,
                name,
                time,
                currAmount,
                goalAmount,
                category
            );
        } catch (error) {
            throw new Error(
                error instanceof Error ? error.message : "edit goal failed"
            );
        }
    };

    const handleDeleteGoal = async (goalId: string) => {
        try {
            return await deleteGoalToServer(goalId);
        } catch (error) {
            throw new Error(
                error instanceof Error ? error.message : "delete goal failed"
            );
        }
    };

    return (
        <GoalsContext.Provider
            value={{
                goals,
                getGoals: handleGetGoals,
                addGoal: handleAddGoal,
                editGoal: handleEditGoal,
                deleteGoal: handleDeleteGoal,
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
