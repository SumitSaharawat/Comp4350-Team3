"use client";

import React from "react";
import { Goal } from "@/app/api/goal";
import { MoreHorizontal, PiggyBank } from "lucide-react";

interface GoalCardProps {
    goal: Goal;
}

export default function GoalCard({ goal }: GoalCardProps) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md relative border border-gray-200">
            {/* Goal Title */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                    <PiggyBank className="w-8 h-8 text-gray-600 border border-gray-200 shadow" />
                    <h2 className="text-lg font-semibold">{goal.name}</h2>
                </div>
                <MoreHorizontal className="cursor-pointer text-gray-500 hover:text-black"/>
            </div>

            {/* Goal Amounts */}
            <p className="text-2xl font-bold mt-5">CAD {goal.goalAmount.toLocaleString()}</p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-1.5 rounded-full mt-2 relative">
                <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${(goal.currAmount / goal.goalAmount) * 100}%` }}
                ></div>
            </div>

            {/* Remind amount */}
            <div className="flex justify-between mt-3 text-sm text-gray-500">
                <span className="font-semibold text-black">
                    CAD {goal.currAmount.toLocaleString()}
                    <span className="text-gray-400"> saved so far</span>
                </span>
                <span>{((goal.currAmount / goal.goalAmount) * 100).toFixed(2)}%</span>
            </div>

            {/* Divider Line */}
            <div className="border-t border-gray-300 my-6"></div>

            {/* Goal Details */}
            <div className="text-sm mt-5 text-gray-500">
                <div className="flex justify-between">
                    <span>Target</span>
                    <span className="font-medium text-black">
                        {new Date(goal.date).toLocaleDateString("en-US", { month: "short", year: "numeric" })}
                    </span>
                </div>
                <div className="flex justify-between mt-2">
                    <span>Remaining</span>
                    <span className="font-medium text-black">CAD {(goal.goalAmount - goal.currAmount).toLocaleString()}</span>
                </div>
            </div>

        </div>
    );
}
