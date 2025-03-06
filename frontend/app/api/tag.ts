export interface Tag {
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
