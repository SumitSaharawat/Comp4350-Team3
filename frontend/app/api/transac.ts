
export interface Transaction {
    id: string,
    date: Date,
    amount: number,
    currency: string,
    name: string,
}

export async function getTransactionsFromServer(userId: string): Promise<Transaction[]> {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/transaction/${userId}`, {
        method: "GET",
        credentials: "include"
    });

    if (!res.ok) {
        throw new Error((await res.json()).message || "Failed to fetch transactions");
    }

    const data = await res.json();
    return data || [];
}

