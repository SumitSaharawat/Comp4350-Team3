"use client";

import React, { createContext, useContext, useState } from "react";
import {
    Reminder,
    getRemindersFromServer,
    addReminderFromServer,
    editReminderFromServer,
} from "@/app/api/reminder";

class ReminderClass implements Reminder {
    id: string;
    userId: string;
    name: string;
    time: Date;
    text: string;
    viewed: boolean;

    constructor(
        id: string,
        userId: string,
        name: string,
        time: string,
        text: string
    ) {
        this.id = id;
        this.name = name;
        this.time = new Date(time);
        this.text = text;
        this.userId = userId;
        this.viewed = false;
    }
}

interface RemindersContextType {
    reminders: Reminder[];
    getReminders: (userId: string) => Promise<boolean>;
    addReminder: (
        userId: string,
        name: string,
        time: string,
        text: string
    ) => Promise<{ message: string }>;
    editReminder: (
        userId: string,
        id: string,
        name: string,
        time: string,
        text: string
    ) => Promise<{ message: string }>;
}

const RemindersContext = createContext<RemindersContextType>({
    reminders: [],
    getReminders: async () => false,
    addReminder: async (
        userId: string,
        name: string,
        time: string,
        text: string
    ) => ({
        message: `not initialized with paras ${userId}, ${name}, ${time}, ${text}`,
    }),
    editReminder: async (
        userId: string,
        id: string,
        name: string,
        time: string,
        text: string
    ) => ({
        message: `not initialized with paras ${id}, ${name}, ${time}, ${text}`,
    }),
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

    const handleAddReminder = async (
        userId: string,
        name: string,
        time: string,
        text: string
    ) => {
        try {
            return await addReminderFromServer(userId, name, time, text);
        } catch (error) {
            throw new Error(
                error instanceof Error ? error.message : "Add reminder failed"
            );
        }
    };

    const handleEditReminder = async (
        userId: string,
        id: string,
        name: string,
        time: string,
        text: string
    ) => {
        try {
            const tempReminderInstance = new ReminderClass(
                userId,
                id,
                name,
                time,
                text
            );
            await editReminderFromServer(tempReminderInstance);
            return { message: "Edit reminder success!" };
        } catch (error) {
            throw new Error(
                error instanceof Error ? error.message : "Add reminder failed"
            );
        }
    };

    return (
        <RemindersContext.Provider
            value={{
                reminders,
                getReminders: handleGetReminders,
                addReminder: handleAddReminder,
                editReminder: handleEditReminder,
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
