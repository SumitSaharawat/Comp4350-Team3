/**
 * Notification List
 *
 * A top-right fixed component displaying upcoming unviewed reminders (within ±2 days).
 * Toggled via a NotificationButton. Uses a popover-like layout.
 */

import { Reminder } from "@/app/api/reminder";
import { MiniReminderList } from "./ReminderList";
import { useReminders } from "@/app/contexts/ReminderContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { useState, useEffect } from "react";
import { NotificationButton } from "../Button";

// Constant: number of seconds in a day
const SEC_PER_DAY = 86400;

export default function NotificationList() {
    const { reminders, getReminders } = useReminders();
    const { user } = useAuth();

    // UI state: whether the popover is open
    const [open, setOpen] = useState(false);

    // Local state: selected reminders to show in notification panel
    const [data, setData] = useState<Reminder[]>([]);

    // Flag to prevent repeated fetching
    const [dataFetched, setDataFetched] = useState(false);

    /**
     * Filters reminders to:
     * - Only those unviewed
     * - Within ±2 days of the current time
     */
    const selectUpcomingReminders = (rawReminders: Reminder[]) => {
        const now = new Date();
        return rawReminders.filter(
            (r) =>
                Math.abs(now.getTime() - new Date(r.time).getTime()) / 1000 <
                SEC_PER_DAY * 2 && !r.viewed
        );
    };

    /**
     * Fetch reminders from server on first render if needed
     */
    const getDataOnRender = async () => {
        try {
            const success = await getReminders(
                user?.id || (localStorage.getItem("userid") as string)
            );

            if (success) {
                setDataFetched(true);
                setData(selectUpcomingReminders(reminders));
            }
        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            } else {
                console.error("Reminders fetch failed!");
            }
        }
    };

    /**
     * useEffect to load or update data on mount or reminders change
     */
    useEffect(() => {
        // Avoid fetching again if already fetched
        if (reminders.length <= 0 && !dataFetched) {
            getDataOnRender();
        } else {
            setData(selectUpcomingReminders(reminders));
        }

        setDataFetched(true);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reminders]);

    return (
        <div className="absolute fixed top-0 right-0 p-4">
            {/* Bell or icon toggle */}
            <NotificationButton
                onClickFunc={() => setOpen(!open)}
                empty={data.length <= 0}
            />

            {/* Popover notification panel */}
            {open && data.length > 0 ? (
                <div className="absolute top-12 right-0 bg-black border border-gray-500 rounded-lg shadow-lg w-60 p-4 pt-2">
                    <MiniReminderList
                        reminders={data}
                        refreshReminders={() => {}} // currently unused, placeholder
                    />
                </div>
            ) : null}
        </div>
    );
}
