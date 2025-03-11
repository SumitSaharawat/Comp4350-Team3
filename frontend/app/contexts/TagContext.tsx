"use client";

import { Tag, getAllTagsFromServer } from "@/app/api/tag";
import React, { createContext, useContext, useState, useEffect } from "react";

interface TagContextType {
    tags: Tag[];
    getAllTags: () => Promise<boolean>;
}

const TagsContext = createContext<TagContextType | undefined>(undefined);

export function TagsProvider({ children }: { children: React.ReactNode }) {
    const [tags, setTags] = useState<Tag[]>([]);

    const handleGetAllTags = async () => {
        try {
            const data = await getAllTagsFromServer();
            console.log("API response:", data); // Debug log

            // Check if data is already an array
            if (Array.isArray(data)) {
                setTags(data); // Directly use data
                return true;
            }

            console.error("Unexpected API response format:", data);
            return false;
        } catch (error) {
            console.error("Error fetching tags:", error);
            return false;
        }
    };

    // Auto-fetch tags when component mounts
    useEffect(() => {
        handleGetAllTags();
    }, []);

    return (
        <TagsContext.Provider value={{ tags, getAllTags: handleGetAllTags }}>
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
