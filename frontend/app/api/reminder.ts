
export interface Reminder {
    id: string,
    userId: string,
    name: string,
    time: Date,
    text: string,
    viewed: boolean
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

export async function editReminderFromServer(reminder: Reminder): Promise<Reminder> {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...sentReminder } = reminder;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reminder/${reminder.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ ...sentReminder }),
    });

    if (!res.ok) {
        throw new Error((await res.json()).message || "Failed to edit reminder");
    }

    const data = await res.json();
    return data.reminder || reminder;
}
