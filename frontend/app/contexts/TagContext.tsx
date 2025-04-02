"use client";

import { Tag, getTagsFromServer, deleteGoalToServer } from "@/app/api/tag";
import React, { createContext, useContext, useState } from "react";

interface TagContextType {
    tags: Tag[];
    getTags: (userId: string) => Promise<boolean>;
    deleteTag: (tagId: string) => Promise<boolean>;
    handleGetTagsNameList: () => string[];
}

const TagsContext = createContext<TagContextType | undefined>(undefined);

export function TagsProvider({ children }: { children: React.ReactNode }) {
    const [tags, setTags] = useState<Tag[]>([]);

    const handleGetTags = async (userId: string) => {
        try {
            const data = await getTagsFromServer(userId);

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

    // Getting all tag names and place on a list
    const handleGetTagsNameList = (): string[] => {
        if (tags && tags.length > 0) {
            return tags.map(tag => tag.name);
        }
        return [];
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
                getTags: handleGetTags,
                deleteTag: handleDeleteTag,
                handleGetTagsNameList: handleGetTagsNameList,
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
