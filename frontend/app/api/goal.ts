export interface Goal {
    id: string,
    name: string,
    time: Date,
    currAmount: number,
    goalAmount: number,
    category: string
}

// API hook for get goals from server
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

// API hook for add new goal to server
export async function addGoalToServer(
    userId: string,
    name: string,
    time: string,
    currAmount: number,
    goalAmount: number,
    category: string): Promise<{message: string}> {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/goal/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, name, time, currAmount, goalAmount, category}),
        credentials: "include"
    });

    if (!res.ok) {
        throw new Error((await res.json()).message || "Failed to add goal");
    }
    return res.json();
}

// API hook for edit goal to server
export async function editGoalToServer(
    goalId: string,
    name: string,
    time: string,
    currAmount: number,
    goalAmount: number,
    category: string): Promise<{message: string}> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/goal/${goalId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({name, time, currAmount, goalAmount, category}),
        credentials: "include"
    });

    if (!res.ok) {
        throw new Error((await res.json()).message || "Failed to edit goal");
    }
    return res.json();
}

//API hook for delete specific goal to server
export async function deleteGoalToServer(goalId: string): Promise<{message: string}> {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/goal/${goalId}`, {
        method: "DELETE",
        credentials: "include"
    });

    if (!res.ok) {
        throw new Error((await res.json()).message || "Failed to delete goal");
    }
    return res.json();
}
