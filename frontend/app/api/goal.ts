
export interface Goal {
    id: string,
    name: string,
    date: Date,
    currAmount: number,
    goalAmount: number,
    category: string
}

export async function getGoalsFromServer(userId: string): Promise<Goal[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/goal/${userId}`, {
        method: "GET",
        credentials: "include"
    });

    if (!res.ok) {
        throw new Error((await res.json()).message || "Failed to fetch goal");
    }

    const data = await res.json();
    return data || [];
}
