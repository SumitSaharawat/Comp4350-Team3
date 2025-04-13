"use client";

/**
 * TagList
 *
 * Renders a table of existing tags, allowing users to:
 * - View tag color, name, and message
 * - Edit tags inline
 * - Delete tags
 */

import React, { useState } from "react";
import { editTagToServer, Tag } from "@/app/api/tag";
import { Edit2, Trash2, Save, RefreshCw } from "lucide-react";
import { useTags } from "@/app/contexts/TagContext";

interface TagListProps {
    tags: Tag[];
    refreshList: () => void; // Used to reload tags after update/delete
}

export default function TagList({ tags, refreshList }: TagListProps) {
    const { deleteTag } = useTags();

    // Track which row is being edited
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    // Local state for edit inputs
    const [editData, setEditData] = useState<{
        name: string;
        message: string;
        color: string;
    }>({
        name: "",
        message: "",
        color: "",
    });

    /**
     * Generates a random hex color for tag color
     */
    const generateRandomColor = () => {
        const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16);
        setEditData({ ...editData, color: randomColor });
    };

    /**
     * Handles deletion with confirmation prompt
     */
    const handleDelete = async (tagId: string) => {
        if (confirm("Are you sure you want to delete this tag?")) {
            await deleteTag(tagId);
            refreshList();
        }
    };

    /**
     * Switches row to editing mode and loads its values
     */
    const handleEdit = (tag: Tag) => {
        setExpandedRow(tag.id);
        setEditData({ name: tag.name, message: tag.message ?? "", color: tag.color });
    };

    /**
     * Sends update to server and resets editing state
     */
    const handleSave = async (tagId: string) => {
        try {
            await editTagToServer(tagId, editData.name, editData.color, editData.message);
            refreshList();
            setExpandedRow(null);
        } catch (error) {
            console.error("Failed to edit tag:", error);
        }
    };

    /**
     * Cancels editing mode
     */
    const handleCancel = () => {
        setExpandedRow(null);
    };

    return (
        <div className="w-full h-full overflow-y-auto border border-gray-300 rounded-lg shadow-sm">
            <table className="w-full border-collapse">
                {/* Table Header */}
                <thead className="sticky top-0 bg-customSecondDark">
                <tr className="h-12">
                    <th className="border-b border-gray-400 px-2 py-2 font-bold text-left">
                        {tags.length} Labels
                    </th>
                    <th className="border-b border-gray-400 px-4 py-2 font-bold text-left">
                        Message
                    </th>
                    <th className="border-b border-gray-400 px-4 py-2 font-bold text-center">
                        Actions
                    </th>
                </tr>
                </thead>

                {/* Table Body */}
                <tbody>
                {tags.length > 0 ? (
                    tags.map((tag) => (
                        <React.Fragment key={tag.id}>
                            {/* Static Display Row */}
                            <tr className="hover:bg-gray-800 h-16">
                                <td className="border-b border-gray-400 px-2 py-4 text-left">
                                        <span
                                            className="px-3 py-1 text-white rounded-full text-sm font-medium inline-block"
                                            style={{ backgroundColor: tag.color }}
                                        >
                                            {tag.name}
                                        </span>
                                </td>
                                <td className="border-b border-gray-400 text-gray-500 px-4 py-2 text-left">
                                    {tag.message}
                                </td>
                                <td className="border-b border-gray-400 px-4 py-2 text-center">
                                    {/* Edit Button */}
                                    <button
                                        onClick={() => handleEdit(tag)}
                                        className="text-blue-600 hover:text-blue-800 mx-1"
                                    >
                                        <Edit2 size={18} />
                                    </button>
                                    {/* Delete Button */}
                                    <button
                                        onClick={() => handleDelete(tag.id)}
                                        className="text-red-600 hover:text-red-800 mx-1"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>

                            {/* Expanded Editable Row */}
                            {expandedRow === tag.id && (
                                <tr>
                                    <td colSpan={3} className="border-b border-gray-400 p-4">
                                        <div className="flex items-center gap-4">
                                            {/* Name Input */}
                                            <input
                                                type="text"
                                                value={editData.name}
                                                onChange={(e) =>
                                                    setEditData({ ...editData, name: e.target.value })
                                                }
                                                className="w-72 h-10 mr-4 border border-gray-400 bg-transparent/30 p-2 rounded-md"
                                                placeholder="Label name"
                                            />

                                            {/* Message Input */}
                                            <input
                                                type="text"
                                                value={editData.message}
                                                onChange={(e) =>
                                                    setEditData({ ...editData, message: e.target.value })
                                                }
                                                className="w-80 h-10 mr-4 border border-gray-400 bg-transparent/30 p-2 rounded-md"
                                                placeholder="Description (optional)"
                                            />

                                            {/* Color Picker */}
                                            <div className="flex items-center gap-2">
                                                <button
                                                    onClick={generateRandomColor}
                                                    className="h-9 w-9 flex items-center justify-center rounded text-white"
                                                    style={{ backgroundColor: editData.color }}
                                                >
                                                    <RefreshCw size={16} />
                                                </button>
                                                <input
                                                    type="text"
                                                    value={editData.color}
                                                    onChange={(e) =>
                                                        setEditData({ ...editData, color: e.target.value })
                                                    }
                                                    className="w-24 h-10 border border-gray-400 bg-transparent/30 p-2 rounded-md text-center"
                                                />
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-2 ml-auto">
                                                <button
                                                    onClick={handleCancel}
                                                    className="px-2 py-2 w-20 h-10 border rounded-md hover:bg-gray-700 flex items-center gap-1"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={() => handleSave(tag.id)}
                                                    disabled={!editData.name.trim()}
                                                    className="px-2 py-2 w-20 h-10 rounded-md text-white bg-green-500 hover:bg-green-600 flex items-center gap-1"
                                                >
                                                    <Save size={16} />
                                                    Save
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))
                ) : (
                    // Fallback row for empty tag list
                    <tr>
                        <td colSpan={3} className="text-center text-gray-500 py-4">
                            No tags found.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
