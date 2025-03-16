"use client";

import React from "react";
import { Reminder, editReminderFromServer } from "@/app/api/reminder";
import { CheckButton } from "./Button";
import { MoreHorizontal } from "lucide-react";
import { formatTimeDifference } from "@/lib/utils";
import { useReminders } from "@/app/contexts/ReminderContext";

interface ReminderCardProps {
    reminder: Reminder;
    mini?: boolean;
}

export default function ReminderCard({ reminder, mini }: ReminderCardProps) {
    const [viewed, setViewed] = React.useState(reminder.viewed);
    const { reminders } = useReminders();

    const flipViewed = async () => {
        const tempViewed = viewed;
        setViewed(!tempViewed);
        // a quick modification call to the server, no response expected
        const updatedReminder = await editReminderFromServer({
            ...reminder,
            viewed: !tempViewed,
        });
        const indexToUpdate = reminders.findIndex(
            (r) => r.id === updatedReminder.id
        );
        reminders[indexToUpdate] = { ...updatedReminder };
    };

    if (!mini) {
        return (
            <div className="bg-white p-4 rounded-lg shadow-md relative border border-gray-200">
                {/* Reminder Name */}
                <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center gap-2">
                        <CheckButton
                            checked={viewed}
                            onClickFunc={flipViewed}
                        />
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
                            {new Date(reminder.time).toLocaleTimeString(
                                "en-US",
                                {
                                    minute: "2-digit",
                                    hour: "2-digit",
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                }
                            )}
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
    } else {
        return (
            <div className="bg-white p-3 rounded-md shadow-sm relative border border-gray-200 w-48">
                {/* Reminder Name */}
                <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-1.5">
                        <CheckButton
                            checked={viewed}
                            onClickFunc={flipViewed}
                        />
                        <h2 className="text-base font-semibold italic">
                            {reminder.name}
                        </h2>
                    </div>
                </div>

                {/* Divider Line */}
                <div className="border-t border-gray-300 my-3"></div>

                {/* Reminder Details */}
                <div className="text-sm text-gray-500">
                    <div className="flex justify-between">
                        <span className="font-mono text-black">
                            {formatTimeDifference(new Date(reminder.time))}
                        </span>
                    </div>
                </div>
            </div>
        );
    }
}
