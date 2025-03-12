"use client";

import React from "react";
import { Reminder } from "@/app/api/reminder";
import { MoreHorizontal, CheckCheck } from "lucide-react";

interface ReminderCardProps {
    reminder: Reminder;
}

export default function ReminderCard({ reminder }: ReminderCardProps) {
    return (
        <div className="bg-white p-4 rounded-lg shadow-md relative border border-gray-200">
            {/* Reminder Name */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2">
                    <CheckCheck className="w-8 h-8 text-gray-600 border border-gray-200 shadow" />
                    <h2 className="text-lg font-semibold italic">
                        {reminder.name}
                    </h2>
                </div>
                <MoreHorizontal className="cursor-pointer text-gray-500 hover:text-black" />
            </div>

            {/* Divider Line */}
            <div className="border-t border-gray-300 my-6"></div>

            {/* Reminder Details */}
            <div className="text-base mt-7 text-gray-500">
                <div className="flex justify-between">
                    <span className="font-normal font-mono text-black">
                        {new Date(reminder.time).toLocaleTimeString("en-US", {
                            month: "short",
                            year: "numeric",
                        })}
                    </span>
                </div>
                <div className="text-sm">
                    <div className="flex justify-between mt-2">
                        <span className="font-light font-serif">
                            Note: {reminder.text}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
