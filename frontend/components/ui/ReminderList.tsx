"use client";

import React from "react";
import ReminderCard from "./ReminderCard";
import { Reminder } from "@/app/api/reminder";

interface ReminderListProps {
    reminders: Reminder[];
}

export default function ReminderList({ reminders }: ReminderListProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reminders.length > 0 ? (
                reminders.map((reminder) => (
                    <ReminderCard key={reminder.id} reminder={reminder} />
                ))
            ) : (
                <p className="col-span-full text-center text-gray-500">
                    No reminders found.
                </p>
            )}
        </div>
    );
}
