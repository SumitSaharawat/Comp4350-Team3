export interface Reminder {
    id: string,
    userId: string,
    name: string,
    time: Date,
    text: string,
    viewed: boolean
}

//API hook for get reminders from server
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

//API hook for edit existing reminder
export async function editReminderFromServer(reminder: Reminder): Promise<Reminder> {
    const { id, ...sentReminder } = reminder;
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reminder/${id}`, {
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

//API hook for add new reminder to server
export async function addReminderFromServer(
    userId: string,
    name: string,
    time: string,
    text: string): Promise<{message: string}>{
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reminder/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, name, time, text, viewed: false}),
        credentials: "include"
    });

    if (!res.ok) {
        throw new Error((await res.json()).message || "Failed to edit reminder");
    }

    return { message: "Create reminder success!"};
}

//API hook for delete specific reminder
export async function deleteReminderToServer(id: string): Promise<{message: string}> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reminder/${id}`, {
        method: "DELETE",
        credentials: "include"
    });

    if (!res.ok) {
        throw new Error((await res.json()).message || "Failed to delete reminder");
    }

    return { message: "Delete reminder success!"};
}
