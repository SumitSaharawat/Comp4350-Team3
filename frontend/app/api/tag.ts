export interface Tag {
    id: string,
    name: string,
    color: string,
    message: string,
}

export async function getTagsFromServer(userId: string): Promise<Tag[]> {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tag/${userId}`, {
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
    userId:string,
    name: string,
    color: string,
    message: string): Promise<{message: string}> {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tag/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({userId, name, color, message}),
        credentials: "include"
    });

    if (!res.ok) {
        throw new Error((await res.json()).message || "Failed to add tag");
    }
    return res.json();
}

export async function editTagToServer(
    tagId: string,
    name: string,
    color: string,
    message: string): Promise<{message: string}> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tag/${tagId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({name, color, message}),
        credentials: "include"
    });

    if (!res.ok) {
        throw new Error((await res.json()).message || "Failed to edit tag");
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
