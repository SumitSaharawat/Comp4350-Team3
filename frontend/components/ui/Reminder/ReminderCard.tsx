"use client";

/**
 * Reminder Card
 *
 * A flexible card component for displaying a reminder.
 * Supports full and mini modes:
 * - Full mode shows all details and allows edit/delete
 * - Mini mode shows name + time difference (used in notifications)
 */

import React, { useEffect, useRef, useState } from "react";
import { Reminder, editReminderFromServer } from "@/app/api/reminder";
import { CheckButton } from "../Button";
import { MoreHorizontal, Edit, Trash2 } from "lucide-react";
import { formatTimeDifference } from "@/lib/utils";
import { useReminders } from "@/app/contexts/ReminderContext";
import ReminderEditModal from "@/components/ui/Reminder/ReminderEditModal";

interface ReminderCardProps {
    reminder: Reminder;               // The reminder to render
    mini?: boolean;                   // Whether this is a compact (mini) version
    refreshReminders: () => void;     // Refresh function to re-fetch reminders after changes
}

export default function ReminderCard({
                                         reminder,
                                         mini,
                                         refreshReminders,
                                     }: ReminderCardProps) {
    const [viewed, setViewed] = useState(reminder.viewed);  // Local state to toggle viewed checkbox
    const { reminders } = useReminders();                   // Global reminder context
    const [showMenu, setShowMenu] = useState(false);        // Controls visibility of context menu
    const menuRef = useRef<HTMLDivElement>(null);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const { deleteReminder } = useReminders();              // Delete function from context
    const [triggerRect, setTriggerRect] = useState<DOMRect | null>(null); // For animating the edit modal
    const [isEditing, setIsEditing] = useState(false);      // Whether the edit modal is open
    const cardRef = useRef<HTMLDivElement>(null);

    /**
     * Click-outside handler to close menu dropdown
     */
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

    /**
     * Handle reminder deletion with confirmation
     */
    const handleDelete = async () => {
        if (confirm(`Are you sure you want to delete "${reminder.name}"?`)) {
            await deleteReminder(reminder.id);
            refreshReminders();
            setShowMenu(false);
        }
    };

    /**
     * Open edit modal and get element position for animation
     */
    const handleEdit = () => {
        if (cardRef.current) {
            setTriggerRect(cardRef.current.getBoundingClientRect());
            setIsEditing(true);
        }
    };

    /**
     * Flip the 'viewed' status for the reminder and update the server
     */
    const flipViewed = async () => {
        const tempViewed = viewed;
        setViewed(!tempViewed);

        const updatedReminder = await editReminderFromServer({
            ...reminder,
            viewed: !tempViewed,
        });

        const indexToUpdate = reminders.findIndex(
            (r) => r.id === updatedReminder.id
        );
        reminders[indexToUpdate] = { ...updatedReminder };
    };

    // ----------- FULL MODE DISPLAY (used on main page) -----------
    if (!mini) {
        return (
            <div
                ref={cardRef}
                className="bg-customReminderGray p-4 rounded-lg shadow-md relative border border-gray-200"
            >
                <div className="bg-customReminderBlack p-4 rounded-lg shadow-md relative border border-gray-200">
                    {/* Top: Reminder name + checkbox + options menu */}
                    <div className="flex justify-between items-center mb-3">
                        <div className="flex items-center gap-2">
                            <CheckButton checked={viewed} onClickFunc={flipViewed} />
                            <h2 className="text-lg text-customReminderGold font-semibold italic">
                                {reminder.name}
                            </h2>
                        </div>

                        {/* Options dropdown button */}
                        <button
                            ref={buttonRef}
                            onClick={() => setShowMenu(!showMenu)}
                            className="cursor-pointer text-gray-400 hover:text-gray-700"
                        >
                            <MoreHorizontal />
                        </button>

                        {/* Options dropdown menu */}
                        {showMenu && (
                            <div
                                ref={menuRef}
                                className="absolute bg-black/50 right-0 top-8 border border-gray-200
                                           rounded-lg shadow-lg w-32 z-50 mt-2"
                            >
                                <button
                                    onClick={() => {
                                        handleEdit();
                                        setShowMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-500/70 flex items-center gap-2"
                                >
                                    <Edit size={16} />
                                    Edit
                                </button>
                                <button
                                    onClick={() => {
                                        handleDelete();
                                        setShowMenu(false);
                                    }}
                                    className="w-full px-4 py-2 text-left hover:bg-gray-500/70 flex items-center gap-2 text-red-600"
                                >
                                    <Trash2 size={16} />
                                    Delete
                                </button>
                            </div>
                        )}

                        {/* Edit Modal */}
                        {isEditing && (
                            <ReminderEditModal
                                reminder={reminder}
                                onClose={() => setIsEditing(false)}
                                triggerRect={triggerRect}
                                refreshReminders={refreshReminders}
                            />
                        )}
                    </div>

                    {/* Divider Line */}
                    <div className="border-t border-gray-600 my-6"></div>

                    {/* Reminder details: Date + Text */}
                    <div className="text-base mt-7">
                        <div className="flex justify-between text-customReminderGold">
                            <span className="font-normal font-mono">
                                {new Date(reminder.time).toLocaleTimeString("en-US", {
                                    minute: "2-digit",
                                    hour: "2-digit",
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                })}
                            </span>
                        </div>
                        <div className="text-sm italic">
                            <div className="flex justify-between mt-2">
                                <span className="font-light font-serif">
                                    Note: {reminder.text}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ----------- MINI MODE DISPLAY (used in notifications) -----------
    return (
        <div className="bg-customReminderGray p-3 rounded-md shadow-sm relative border border-gray-400 w-48 mt-2">
            {/* Reminder name with check */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-1.5">
                    <CheckButton checked={viewed} onClickFunc={flipViewed} />
                    <h2 className="text-customReminderGold font-semibold italic">
                        {reminder.name}
                    </h2>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-300 my-3"></div>

            {/* Relative time display */}
            <div className="text-sm text-gray-500">
                <div className="flex justify-between">
                    <span className="font-mono text-customReminderGold">
                        {formatTimeDifference(new Date(reminder.time))}
                    </span>
                </div>
            </div>
        </div>
    );
}
