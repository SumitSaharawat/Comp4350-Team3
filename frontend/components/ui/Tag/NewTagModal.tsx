"use client";

/**
 * NewTagModal
 *
 * Modal component for creating a new custom tag/label.
 * Allows user to input tag name, optional description, and choose or generate a color.
 */

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { addTagToServer } from "@/app/api/tag";
import { useAuth } from "@/app/contexts/AuthContext";

interface NewTagModalProps {
    toggle: () => void;       // Function to close the modal
    refreshList: () => void;  // Function to refresh tag list after submission
}

export default function NewTagModal({ toggle, refreshList }: NewTagModalProps) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState("#434858"); // Default initial color
    const { user } = useAuth();

    /**
     * Generates a random hex color and updates the state
     */
    const generateRandomColor = () => {
        const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
        setColor(randomColor);
    };

    /**
     * Submits the new tag to the server
     * - Validates input
     * - Uses AuthContext to get the user ID
     * - Closes modal after submit
     */
    const handleSubmit = async () => {
        if (!name.trim()) return;

        const userId = user?.id || localStorage.getItem("userid");
        if (!userId) {
            console.log("User ID not found. Please log in again.");
            return;
        }

        try {
            await addTagToServer(userId, name, color, description);
            refreshList();
        } catch (error) {
            console.error(error);
        } finally {
            toggle();
        }
    };

    return (
        <div className="bg-customSecondDark p-4 mb-5 rounded-md border border-gray-500 shadow-sm">
            {/* Preview of the tag */}
            <div className="flex items-center gap-2 mb-5">
                <span
                    className="px-3 py-1 text-white rounded-full text-sm font-medium inline-block"
                    style={{ backgroundColor: color }}
                >
                    {name.trim() === "" ? "Label preview" : name.trim()}
                </span>
            </div>

            <div className="flex items-center gap-4">
                {/* Input: Label Name */}
                <div className="flex flex-col justify-center mr-4">
                    <label className="block font-semibold mb-1">Label name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-72 h-10 border border-gray-500 bg-transparent/30 p-2 rounded-md focus:ring focus:ring-blue-200"
                        placeholder="Label name"
                    />
                </div>

                {/* Input: Optional Description */}
                <div className="flex flex-col justify-center mr-4">
                    <label className="block font-semibold mb-1">Description</label>
                    <input
                        type="text"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className="w-80 h-10 border border-gray-500 bg-transparent/30 p-2 rounded-md focus:ring focus:ring-blue-200"
                        placeholder="Description (optional)"
                    />
                </div>

                {/* Color Picker: Random Generator + Input */}
                <div className="flex items-center gap-2 mt-7">
                    <button
                        onClick={generateRandomColor}
                        className="h-10 w-10 flex items-center justify-center rounded text-white"
                        style={{ backgroundColor: color }}
                    >
                        <RefreshCw size={16} />
                    </button>
                    <input
                        type="text"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        className="h-10 w-24 border border-gray-500 bg-transparent/30 p-2 rounded-md text-center"
                    />
                </div>

                {/* Action Buttons: Cancel / Submit */}
                <div className="flex items-center gap-2 mt-5 ml-auto">
                    <button
                        onClick={toggle}
                        className="px-4 py-2 border border-gray-500 rounded-md hover:bg-gray-700"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        className="px-4 py-2 rounded-md text-white bg-green-500 hover:bg-green-600"
                        disabled={!name.trim()}
                    >
                        Create label
                    </button>
                </div>
            </div>
        </div>
    );
}
