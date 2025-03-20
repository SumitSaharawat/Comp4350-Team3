"use client";

import Layout from "@/components/ui/Layout";
import { useTags } from "@/app/contexts/TagContext";
import { useEffect, useState } from "react";
import { Tag } from "@/app/api/tag";
import TagList from "@/components/ui/TagList";
import NewTagModal from "@/components/ui/NewTagModal";

export default function TagPage() {
    const { tags, getAllTags } = useTags();
    const [data, setData] = useState<Tag[]>([]);
    const [isAdding, setIsAdding] = useState(false);

    const fetchTags = async () => {
        try {
            const success = await getAllTags();
            if (success) {
                setData(tags);
            }
        } catch (err) {
            console.error(err instanceof Error ? err.message : "tags fetch failed!");
        }
    };

    useEffect(() => {
        fetchTags();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (tags.length > 0) {
            setData(tags);
        }
    }, [tags]);

    const toggleForm = () => {
        setIsAdding((prev) => !prev);
    };


    return (
        <Layout title="Tags">
            {/* New Label Button */}
            <div className="flex justify-end mb-6">
                <button
                    onClick={toggleForm}
                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-grey-700 transition-all"
                >
                    + New label
                </button>
            </div>

            {isAdding && <NewTagModal toggle={toggleForm} refreshList={fetchTags}/>}

            <TagList tags={data}/>
        </Layout>
    );
}