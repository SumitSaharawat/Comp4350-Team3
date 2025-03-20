export interface Tag {
    id: string,
    name: string,
    color: string,
    message: string,
}

export async function getAllTagsFromServer(): Promise<Tag[]> {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tag`, {
        method: "GET",
        credentials: "include"
    });

    if (!res.ok) {
        throw new Error((await res.json()).message || "Failed to fetch tags");
    }

    const data = await res.json();
    return data || [];
}

export async function addTagToServer(
    name: string,
    color: string ): Promise<{message: string}> {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tag/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({name, color}),
        credentials: "include"
    });

    if (!res.ok) {
        throw new Error((await res.json()).message || "Failed to add tag");
    }
    return res.json();
}

export async function deleteGoalToServer(tagId: string): Promise<{message: string}> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tag/${tagId}`, {
        method: "DELETE",
        credentials: "include"
    });

    if (!res.ok) {
        throw new Error((await res.json()).message || "Failed to delete tag");
    }
    return res.json();
}
