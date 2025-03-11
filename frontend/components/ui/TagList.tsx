"use client";

import React from "react";
import { Tag } from "@/app/api/tag";

interface TagListProps {
    tags: Tag[];
}

export default function TagList({ tags }: TagListProps) {
    return (
        <div className="w-full max-h-96 overflow-y-auto border border-gray-300 rounded-lg shadow-sm">
            <table className="w-full border-collapse">
                {/* Table Header */}
                <thead className="sticky top-0 bg-gray-200 text-black">
                <tr>
                    <th className="border-b border-gray-400 px-2 py-2 font-bold text-left">{tags.length} Labels</th>
                    <th className="border-b border-gray-400 px-4 py-2 font-bold text-left">Color</th>
                    <th className="border-b border-gray-400 px-4 py-2 font-bold text-left">Message</th>
                </tr>
                </thead>

                {/* Table Body */}
                <tbody className="text-black">
                {tags.length > 0 ? (
                    tags.map((tx) => (
                        <tr key={tx.id} className="hover:bg-gray-200">
                            <td className="border-b border-gray-400 px-2 py-2 text-left">{tx.name || ""}</td>
                            <td className="border-b border-gray-400 px-4 py-2 text-left">{tx.color}</td>
                            <td className="border-b border-gray-400 px-4 py-2 text-left">{tx.message}</td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={3} className="text-center text-gray-500 py-4">No tags found.</td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}