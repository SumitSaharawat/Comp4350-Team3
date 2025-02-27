"use client";

import React, { createContext, useContext, useState } from "react";
import { Transaction, getTransactionsFromServer } from "@/app/api/transac";

interface TransactionsContextType {
    transactions: Transaction[];
    getTransactions: (userId: string) => Promise<boolean>;
}

const TransactionsContext = createContext<TransactionsContextType>({
    transactions: [],
    getTransactions: async () => false,
});

export function TransactionsProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    const [transactions, setTransactions] = useState<Transaction[]>([]);

    const handleGetTransactions = async (userId: string) => {
        const data = await getTransactionsFromServer(userId);
        if (Array.isArray(data)) {
            setTransactions(data);
            return true;
        } else {
            return false;
        }
    };

    return (
        <TransactionsContext.Provider
            value={{
                transactions,
                getTransactions: handleGetTransactions,
            }}
        >
            {children}
        </TransactionsContext.Provider>
    );
}

export function useTransactions() {
    const context = useContext(TransactionsContext);
    if (!context) {
        throw new Error(
            "useTransactions must be used within an TransactionsProvider"
        );
    }
    return context;
}
