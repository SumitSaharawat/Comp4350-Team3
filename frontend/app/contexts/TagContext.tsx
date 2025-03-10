"use client";

import {Tag, getAllTagsFromServer} from "@/app/api/tag";
import React, { createContext, useContext, useState } from "react";

interface TagContextType {
    tags: Tag[];
    getAllTags(): Promise<boolean>;
}

const TagsContext = createContext<TagContextType>({
    tags: [],
    getAllTags: async () => false,
});

export function TagsProvider({ children }: { children: React.ReactNode }) {
    const [tags, setTags] = useState<Tag[]>([]);

    const handleGetAllTags = async () => {
        const data = await getAllTagsFromServer();
        if (Array.isArray(data)) {
            setTags(data);
            return true;
        } else {
            return false;
        }
    };


    return (
        <TagsContext.Provider value={
            {
                tags,
                getAllTags: handleGetAllTags,
            }}
        >
            {children}
        </TagsContext.Provider>
    );
}

export function useTags() {
    const context = useContext(TagsContext);
    if (!context) {
        throw new Error("user Tags must be used within a TagsProvider");
    }
    return context;
}
