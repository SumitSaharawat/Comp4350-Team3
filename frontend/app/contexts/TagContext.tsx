"use client";

import { Tag, getAllTagsFromServer } from "@/app/api/tag";
import React, { createContext, useContext, useState, useEffect } from "react";
import {deleteGoalToServer} from "@/app/api/tag";

interface TagContextType {
    tags: Tag[];
    getAllTags: () => Promise<boolean>;
    deleteTag: (tagId: string) => Promise<boolean>;
}

const TagsContext = createContext<TagContextType | undefined>(undefined);

export function TagsProvider({ children }: { children: React.ReactNode }) {
    const [tags, setTags] = useState<Tag[]>([]);

    const handleGetAllTags = async () => {
        try {
            const data = await getAllTagsFromServer();

            // Check if data is already an array
            if (Array.isArray(data)) {
                setTags(data); // Directly use data
                return true;
            }

            return false;
        } catch (error) {
            console.error("Error fetching tags:", error);
            return false;
        }
    };

    const handleDeleteTag = async (tagId: string) => {
        try {
            await deleteGoalToServer(tagId);
            setTags((prevTags) =>
                prevTags.filter((tag) => tag.id !== tagId)
            );
            return true;
        } catch (error) {
            console.error("Failed to delete tag", error);
            return false;
        }
    };

    return (
        <TagsContext.Provider value={
            {
                tags,
                getAllTags: handleGetAllTags,
                deleteTag: handleDeleteTag,
            }
        }>
            {children}
        </TagsContext.Provider>
    );
}

export function useTags() {
    const context = useContext(TagsContext);
    if (!context) {
        throw new Error("useTags must be used within a TagsProvider");
    }
    return context;
}
