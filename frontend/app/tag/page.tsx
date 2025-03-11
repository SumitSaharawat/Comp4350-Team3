"use client";

import Layout from "@/components/ui/Layout";
import { useTags } from "@/app/contexts/TagContext";
import { useEffect, useState } from "react";
import { Tag } from "@/app/api/tag";
import TagList from "@/components/ui/TagList";

export default function TagPage() {
    const { tags, getAllTags } = useTags();
    const [data, setData] = useState<Tag[]>([]);


    const getDataOnRender = async () => {
        try {
            const success = await getAllTags();
            if (success) {
                setData(tags);
            }
        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            } else {
                console.error("tags fetch failed!");
            }
        }
    };

    useEffect(() => {
        getDataOnRender();
    }, []);

    useEffect(() => {
        if (tags.length > 0) {
            setData(tags);
        }
    }, [tags]);

    return (
        <Layout title="Tags">
            <TagList tags={data} />
        </Layout>
    );
}
