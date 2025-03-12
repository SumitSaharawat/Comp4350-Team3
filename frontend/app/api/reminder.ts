
export interface Reminder {
    id: string,
    userId: string,
    name: string,
    time: Date,
    text: string
}

export async function getRemindersFromServer(userId: string): Promise<Reminder[]> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reminder/${userId}`, {
        method: "GET",
        credentials: "include"
    });

    if (!res.ok) {
        throw new Error((await res.json()).message || "Failed to fetch reminder");
    }

    const data = await res.json();
    return data || [];
}
