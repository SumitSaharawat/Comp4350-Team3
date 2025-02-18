
export interface Transaction {
    id: number,
    date: Date,
    amount: number,
    currency: string
}

export async function getTransactionsFromServer(): Promise<Transaction[]> {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transactions`, {
        method: "GET",
        credentials: "include"
    });

    if (!res.ok) {
        throw new Error((await res.json()).message || "Failed to log in");
    }

    const data = await res.json();
    return data.transactions || [];
}

