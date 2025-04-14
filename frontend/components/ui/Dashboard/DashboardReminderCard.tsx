"use client";

/**
 * Dashboard Reminder Card
 *
 * This component shows the latest 3–4 upcoming reminders for the user.
 * Includes due date and optional description, styled for quick dashboard viewing.
 */

import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { useReminders } from "@/app/contexts/ReminderContext";
import { useEffect } from "react";
import { useAuth } from "@/app/contexts/AuthContext";

export default function DashboardReminderCard() {
    const router = useRouter();
    const { user } = useAuth();
    const { reminders, getReminders } = useReminders();

    /**
     * Fetch reminders for the current user when component mounts
     */
    useEffect(() => {
        const userId = user?.id || localStorage.getItem("userid");
        if (userId) getReminders(userId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Select the next 4 upcoming reminders based on time
     */
    const upcoming = [...reminders]
        .sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime())
        .slice(0, 4);

    return (
        <div className="bg-black p-4 rounded-xl shadow flex flex-col h-full">
            {/* Header with title and navigation button */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-white font-semibold text-lg">Reminders</h2>
                <button
                    className="text-blue-400 text-sm hover:underline"
                    onClick={() => router.push("/reminder")}
                >
                    See More
                </button>
            </div>

            {/* List of upcoming reminders */}
            <div className="flex flex-col gap-3 overflow-y-auto text-sm text-white">
                {upcoming.map((reminder) => (
                    <div
                        key={reminder.id}
                        className="border border-gray-600 rounded-lg px-3 py-2 bg-black"
                    >
                        {/* Reminder title */}
                        <p className="text-yellow-400 text-lg font-semibold italic">{reminder.name}</p>

                        {/* Reminder time and optional note */}
                        <div className="flex justify-between items-center mt-1 text-sm">
                            <span className="text-yellow-300">
                                {format(new Date(reminder.time), "MMM d, yyyy, h:mm a")}
                            </span>
                            {reminder.text && (
                                <span className="italic text-gray-400 text-right">
                                    Note: {reminder.text}
                                </span>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
