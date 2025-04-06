"use client";

/**
 * Goal Card
 *
 * Component to display individual goal
 */
import React, { useEffect, useRef, useState } from "react";
import { Goal } from "@/app/api/goal";
import { Edit, MoreHorizontal, PiggyBank, Trash2 } from "lucide-react";
import { useGoals } from "@/app/contexts/GoalContext";
import GoalEditModal from "@/components/ui/Goal/GoalEditModal";

// props: the goal object with information and the functions call when goal refresh is needed
interface GoalCardProps {
    goal: Goal;
    refreshGoals: () => void;
}

export default function GoalCard({ goal, refreshGoals }: GoalCardProps) {
    const [showMenu, setShowMenu] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { deleteGoal } = useGoals();
    const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const currentProgress = (goal.currAmount / goal.goalAmount) * 100;
    const lightness = 40 - 30 * (currentProgress / 100); // 0% → 40%，100% → 10%
    const bgColor = `hsl(0, 0%, ${lightness}%)`;

    const getProgressColor = (progress: number) => {
        if (progress === 100) return "bg-green-600";
        if (progress >= 66) return "bg-blue-600";
        if (progress >= 33) return "bg-yellow-500";
        return "bg-red-600";
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node) &&
                buttonRef.current &&
                !buttonRef.current.contains(event.target as Node)
            ) {
                setShowMenu(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDelete = async () => {
        if (confirm(`Are you sure you want to delete "${goal.name}"?`)) {
            await deleteGoal(goal.id);
            // refresh the goals so that the deleted goal is not displayed
            refreshGoals();
            setShowMenu(false);
        }
    };

    const handleEdit = () => {
        if (cardRef.current) {
            setTriggerRect(cardRef.current.getBoundingClientRect());
            setIsEditing(true);
        }
    };

    return (
        <div
            ref={cardRef}
            className="p-4 rounded-lg shadow-md relative border border-gray-200 backdrop-blur-md"
            style={{
                background: `linear-gradient(to right, black, ${bgColor})`,
            }}
        >
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <PiggyBank className="w-8 h-8 text-gray-400 border border-gray-500 shadow"/>
                    <h2 className="text-lg font-semibold">{goal.name}</h2>
                </div>

                <button
                    ref={buttonRef}
                    onClick={() => setShowMenu(!showMenu)}
                    className="cursor-pointer text-black hover:text-gray-700"
                >
                    <MoreHorizontal/>
                </button>

                {goal.currAmount < goal.goalAmount && showMenu && (
                    <div
                        ref={menuRef}
                        className="absolute right-0 top-8 bg-black/50 border border-gray-200
                        rounded-lg shadow-lg w-32 z-50 mt-2"
                    >
                        <button
                            onClick={() => {
                                handleEdit();
                                setShowMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left rounded-lg hover:bg-black/60 flex items-center gap-2"
                        >
                            <Edit size={16}/>
                            Edit
                        </button>
                        <button
                            onClick={() => {
                                handleDelete();
                                setShowMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left rounded-lg hover:bg-black/60
                                        flex items-center gap-2 text-red-600"
                        >
                            <Trash2 size={16}/>
                            Delete
                        </button>
                    </div>
                )}

                {isEditing && (
                    <GoalEditModal
                        goal={goal}
                        onClose={() => setIsEditing(false)}
                        triggerRect={triggerRect}
                        refreshGoals={refreshGoals}
                    />
                )}
            </div>

            {/* Goal Amounts */}
            <p className="text-2xl font-bold mt-6">
                CAD {goal.goalAmount.toLocaleString()}
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 h-1 rounded-full mt-2 relative">
                <div className={`h-full rounded-full transition-all duration-300 ${getProgressColor(currentProgress)}`}
                     style={{width: `${currentProgress}%`}}
                />
            </div>

            {/* Remind amount */}
            <div className="flex justify-between mt-3 text-sm">
                <span className="font-semibold">
                    CAD {goal.currAmount.toLocaleString()}
                    <span className="text-gray-400"> saved so far</span>
                </span>
                <span>
                    {((goal.currAmount / goal.goalAmount) * 100).toFixed(0)}%
                </span>
            </div>

            {/* Divider Line */}
            <div className="border-t border-gray-500 my-6"></div>

            {/* Goal Details */}
            <div className="text-sm mt-5 text-gray-500">
                <div className="flex justify-between">
                    <span>Target</span>
                    <span className="font-medium text-gray-300">
                        {new Date(goal.time).toLocaleDateString("en-US", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                        })}
                    </span>
                </div>
                <div className="flex justify-between mt-2">
                    <span>Remaining</span>
                    <span className="font-medium text-gray-300">
                        CAD{" "}
                        {(goal.goalAmount - goal.currAmount).toLocaleString()}
                    </span>
                </div>
            </div>
        </div>
    );
}
