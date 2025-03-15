"use client";

import React, { createContext, useContext, useState } from "react";
import { Reminder, getRemindersFromServer } from "@/app/api/reminder";

interface RemindersContextType {
    reminders: Reminder[];
    getReminders: (userId: string) => Promise<boolean>;
}

const RemindersContext = createContext<RemindersContextType>({
    reminders: [],
    getReminders: async () => false,
});

export function RemindersProvider({ children }: { children: React.ReactNode }) {
    const [reminders, setReminders] = useState<Reminder[]>([]);

    const handleGetReminders = async (userId: string) => {
        const data = await getRemindersFromServer(userId);
        if (Array.isArray(data)) {
            setReminders(data);
            return true;
        }
        return false;
    };

    return (
        <RemindersContext.Provider
            value={{
                reminders,
                getReminders: handleGetReminders,
            }}
        >
            {children}
        </RemindersContext.Provider>
    );
}

export function useReminders() {
    const context = useContext(RemindersContext);
    if (!context) {
        throw new Error("use Goal must be used within a RemindersProvider");
    }
    return context;
}
