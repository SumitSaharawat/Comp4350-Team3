"use client";

/**
 * Dashboard Goal Card
 *
 * A compact summary component displaying the top 3 upcoming financial goals.
 * Shows goal progress and due dates, with a link to the full goals page.
 */

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useGoals } from "@/app/contexts/GoalContext";
import { useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";

export default function DashboardGoalCard() {
    const router = useRouter();
    const {user} = useAuth();
    const {goals, getGoals} = useGoals();

    /**
     * Fetch goals for the current user on component mount
     */
    useEffect(() => {
        const userId = user?.id || localStorage.getItem("userid");
        if (userId) getGoals(userId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Select top 3 incomplete goals with the nearest deadlines
     */
    const upcomingGoals = goals
        .filter(g => g.currAmount < g.goalAmount)
        .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
        .slice(0, 3);

    return (
        <div className="bg-black p-4 rounded-xl shadow flex flex-col h-full">
            {/* Header with navigation link */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-white font-semibold text-lg">Goals</h2>
                <button
                    className="text-blue-400 text-sm hover:underline"
                    onClick={() => router.push("/goal")}
                >
                    See More
                </button>
            </div>

            {/* Goal list (max 3 goals shown) */}
            <div className="flex flex-col gap-3 text-sm">
                {upcomingGoals.map((goal) => {
                    const progress = goal.currAmount / goal.goalAmount;

                    return (
                        <div key={goal.id} className="p-3 rounded-lg bg-black border border-gray-600">
                            {/* Goal name */}
                            <p className="text-white font-medium">{goal.name}</p>

                            {/* Goal target and due date */}
                            <div className="flex justify-between text-gray-300 text-sm">
                                <span>Target: CAD {goal.goalAmount.toLocaleString()}</span>
                                <span>Due: {format(new Date(goal.time), "MMM d, yyyy")}</span>
                            </div>

                            {/* Progress bar */}
                            <div className="w-full bg-gray-700 h-1 rounded-full mt-2">
                                <div
                                    className={`h-full rounded-full transition-all duration-300 ${
                                        progress >= 0.75
                                            ? "bg-green-400"
                                            : progress >= 0.5
                                                ? "bg-blue-400"
                                                : progress >= 0.25
                                                    ? "bg-yellow-400"
                                                    : "bg-red-400"
                                    }`}
                                    style={{ width: `${Math.min(progress * 100, 100)}%` }}
                                />
                            </div>

                            {/* Progress text */}
                            <p className="text-gray-400 text-xs mt-1">
                                {((progress * 100) || 0).toFixed(0)}% saved — CAD {goal.currAmount.toLocaleString()}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
