"use client";
import React from "react";
import { Tag } from "@/app/api/tag";
import { Edit2, Trash2 } from "lucide-react";

interface TagListProps {
    tags: Tag[];
    // onEdit: (tag: Tag) => void;
    // onDelete: (tagId: string) => void;
}

export default function TagList({ tags }: TagListProps) {
    return (
        <div className="w-full max-h-96 overflow-y-auto border border-gray-300 rounded-lg shadow-sm">
            <table className="w-full border-collapse">
                {/* Table Header */}
                <thead className="sticky top-0 bg-gray-100 text-black">
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
                <tbody className="text-black">
                {tags.length > 0 ? (
                    tags.map((tx) => (
                        <tr key={tx.id} className="hover:bg-gray-200 h-16">
                            <td className="border-b border-gray-400 px-2 py-4 text-left">
                                    <span
                                        className="px-3 py-1 text-white rounded-full text-sm font-medium inline-block"
                                        style={{ backgroundColor: tx.color }}
                                    >
                                        {tx.name}
                                    </span>
                            </td>
                            <td className="border-b border-gray-400 px-4 py-2 text-left">
                                {tx.message}
                            </td>
                            <td className="border-b border-gray-400 px-4 py-2 text-center">
                                <button
                                    // onClick={() => onEdit(tx)}
                                    className="text-blue-600 hover:text-blue-800 mx-1"
                                >
                                    <Edit2 size={18} />
                                </button>
                                <button
                                    // onClick={() => onDelete(tx.id)}
                                    className="text-red-600 hover:text-red-800 mx-1"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </td>
                        </tr>
                    ))
                ) : (
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
