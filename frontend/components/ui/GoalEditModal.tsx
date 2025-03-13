"use client";

import React, {useEffect, useRef, useState} from "react";
import { createPortal } from "react-dom";
import { Goal } from "@/app/api/goal";
import DatePicker from "react-datepicker";

export default function GoalEditModal({ goal, onClose, triggerRect }: {
    goal: Goal;
    onClose: () => void;
    triggerRect: DOMRect | null;
}) {
    const contentRef = useRef<HTMLDivElement>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const categories = ["Saving", "Investment"];
    const [message, setMessage]
        = useState<{ text: string; type: "error" | "success" } | null>(null);

    const window_w = 400;
    const window_h = 400;


    useEffect(() => {
        if (!triggerRect || !contentRef.current) return;

        const content = contentRef.current;
        content.style.visibility = "hidden";

        // calculate destination position
        const finalX = (window.innerWidth - window_w) / 2;
        const finalY = (window.innerHeight - window_h) / 2;

        // initial status
        content.style.transform = `translate(${triggerRect.left}px, ${triggerRect.top}px) scale(0.5)`;
        content.style.width = `${triggerRect.width}px`;
        content.style.height = `${triggerRect.height}px`;
        content.style.opacity = "0";
        content.style.visibility = "visible";

        const animation = content.animate([
            {
                transform: `translate(${triggerRect.left}px, ${triggerRect.top}px) scale(0.5)`,
                width: `${triggerRect.width}px`,
                height: `${triggerRect.height}px`,
                opacity: "0"
            },
            {
                transform: `translate(${finalX}px, ${finalY}px)`,
                width: `${window_w}px`,
                height: `${window_h}px`,
                opacity: "1"
            }
        ], {
            duration: 450,
            easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
        });

        animation.onfinish = () => {
            content.style.transform = `translate(${finalX}px, ${finalY}px)`;
            content.style.width = `${window_w}px`;
            content.style.height = `${window_h}px`;
            content.style.opacity = "1";
        };

    }, [triggerRect]);

    return createPortal(
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
            <div
                ref={contentRef}
                className={`bg-white p-4 rounded-lg shadow-md absolute 
                max-w-[${window_w}px] 
                max-h-[${window_h}px] 
                origin-center`}

                style={{
                    width: triggerRect?.width + 'px',
                    height: triggerRect?.height + 'px'
                }}
            >
                <div className="p-2 w-full">
                    <h2 className="text-xl font-bold mb-2 text-center pt-1">Edit Goal</h2>

                    {/* Goal Name */}
                    <input
                        type="text"
                        placeholder="Goal Name"
                        // value={name}
                        // onChange={(e) => setName(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded mb-2"
                    />

                    {/* Current Amount */}
                    <input
                        type="number"
                        placeholder="Current Amount"
                        // value={currAmount}
                        // onChange={(e) => setCurrAmount(e.target.value ? Number(e.target.value) : "")}
                        className="w-full border border-gray-300 p-2 rounded mb-2"
                    />

                    {/* Goal Amount */}
                    <input
                        type="number"
                        placeholder="Goal Amount"
                        // value={goalAmount}
                        // onChange={(e) => setGoalAmount(e.target.value ? Number(e.target.value) : "")}
                        className="w-full border border-gray-300 p-2 rounded mb-2"
                    />

                    {/* Category Dropdown */}
                    <select
                        // value={category}
                        // onChange={(e) => setCategory(e.target.value)}
                        className="w-full border border-gray-300 p-2 rounded mb-4 bg-white"
                    >
                        {categories.map((cur) => (
                            <option key={cur} value={cur}>
                                {cur}
                            </option>
                        ))}
                    </select>

                    {/* Date Picker */}
                    <DatePicker
                        selected={selectedDate}
                        onChange={(date: Date | null) => setSelectedDate(date)}
                        dateFormat="yyyy-MM-dd"
                        className="w-full border border-gray-300 p-2 rounded mb-2"
                        showPopperArrow={false}
                    />

                    {/* Message Display */}
                    {message && (
                        <p className={`text-sm text-center mt-2 ${message.type === "error" ? "text-red-600" : "text-green-600"}`}>
                            {message.text}
                        </p>
                    )}

                    {/* Buttons */}
                    <div className="flex justify-end mt-4 gap-2">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-200"
                        >
                            Cancel
                        </button>
                        {/*<button*/}
                        {/*    onClick={handleSubmit}*/}
                        {/*    disabled={loading}*/}
                        {/*    className={`px-4 py-2 rounded-md text-white ${*/}
                        {/*        loading ? "bg-gray-500 cursor-not-allowed" : "bg-black hover:bg-gray-800"*/}
                        {/*    }`}*/}
                        {/*>*/}
                        {/*    {loading ? "Creating..." : "Create"}*/}
                        {/*</button>*/}
                    </div>
                    {/*<button*/}
                    {/*    onClick={onClose}*/}
                    {/*    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"*/}
                    {/*>*/}
                    {/*    Close*/}
                    {/*</button>*/}
                </div>
            </div>
        </div>,
        document.body
    );
}