"use client";

/**
 * Reminder List
 *
 * Shared UI component for rendering reminders in both full and compact formats:
 * - `ReminderList` is used on the full Reminders page (with editing and deletion)
 * - `MiniReminderList` is used in dropdown notifications (read-only, compact)
 */

import React from "react";
import ReminderCard from "./ReminderCard";
import { Reminder } from "@/app/api/reminder";

// Props for both list types
interface ReminderListProps {
    reminders: Reminder[];
    refreshReminders: () => void;
}

/**
 * Full-size Reminder Grid
 * - 1 column on small, 2 on medium, 3 on large screens
 * - Displays ReminderCards in non-mini mode
 * - Includes full edit/delete/check interactions
 */
export function ReminderList({
                                 reminders,
                                 refreshReminders,
                             }: ReminderListProps) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {reminders.length > 0 ? (
                reminders.map((reminder) => (
                    <ReminderCard
                        key={reminder.id}
                        reminder={reminder}
                        mini={false}
                        refreshReminders={refreshReminders}
                    />
                ))
            ) : (
                <p className="col-span-full text-center text-gray-500">
                    No reminders found.
                </p>
            )}
        </div>
    );
}

/**
 * Compact Reminder List (for notifications dropdown)
 * - Uses mini version of ReminderCard
 * - No refresh or mutation logic
 * - Styled in a simple stacked layout
 */
export function MiniReminderList({ reminders }: ReminderListProps) {
    return (
        <>
            {reminders.length > 0 && (
                <div className="list">
                    {reminders.map((reminder) => (
                        <ReminderCard
                            key={reminder.id}
                            reminder={reminder}
                            mini={true}
                            refreshReminders={() => {}} // Intentionally disabled
                        />
                    ))}
                </div>
            )}
        </>
    );
}
