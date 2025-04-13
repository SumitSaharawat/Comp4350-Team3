"use client";

/**
 * Goal List
 *
 * A responsive grid layout that displays all GoalCard components.
 * If no goals exist, shows a fallback message.
 */

import React from "react";
import GoalCard from "./GoalCard";
import { Goal } from "@/app/api/goal";

// Props passed to GoalList
interface GoalListProps {
    goals: Goal[];                // Array of goal objects to display
    refreshGoals: () => void;     // Function to refresh goal data after edits/deletions
}

export default function GoalList({ goals, refreshGoals }: GoalListProps) {
    return (
        // Responsive grid layout for cards
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
            {goals.length > 0 ? (
                // Render a GoalCard for each goal
                goals.map((goal) => (
                    <GoalCard
                        key={goal.id}
                        goal={goal}
                        refreshGoals={refreshGoals}
                    />
                ))
            ) : (
                // Fallback message when no goals are present
                <p className="col-span-full text-center text-gray-500">
                    No goals found.
                </p>
            )}
        </div>
    );
}
