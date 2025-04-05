"use client";

/**
 * Transactions Context
 *
 * Context for transactions related data
 * Toolbox for get/add/edit/delete transactions data
 */
import React, { createContext, useContext, useState } from "react";
import {
    Transaction,
    getTransactionsFromServer,
    deleteTransactionFromServer,
} from "@/app/api/transac";

export interface ChartDataPoint {
    label: string;
    saving: number;
    spending: number;
}

interface TransactionsContextType {
    transactions: Transaction[];
    getTransactions: (userId: string) => Promise<boolean>;
    deleteTransaction: (transactionId: string) => Promise<boolean>;
    prepareDiagramData: (transactions: Transaction[]) => ChartDataPoint[];
}

const TransactionsContext = createContext<TransactionsContextType>({
    transactions: [],
    getTransactions: async () => false,
    deleteTransaction: async () => false,
    prepareDiagramData: () =>[],
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

    const handleDeleteTransaction = async (transactionId: string) => {
        try {
            await deleteTransactionFromServer(transactionId);
            // only keep the transactions that are not deleted
            setTransactions((prevTransactions) =>
                prevTransactions.filter(
                    (transaction) => transaction.id !== transactionId
                )
            );
            return true;
        } catch (error) {
            console.error("Failed to delete transaction", error);
            return false;
        }
    };

    function prepareChartData(transactions: Transaction[]) {
        const grouped: Record<string, { saving: number; spending: number }> = {};

        transactions.forEach((tx) => {
            const dateKey = new Date(tx.date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
            }); // format like "Apr 10"

            if (!grouped[dateKey]) {
                grouped[dateKey] = { saving: 0, spending: 0 };
            }

            if (tx.type.toLowerCase() === "saving") {
                grouped[dateKey].saving += tx.amount;
            } else {
                grouped[dateKey].spending += tx.amount;
            }
        });

        return Object.entries(grouped).map(([label, values]) => ({
            label,
            saving: values.saving,
            spending: -values.spending,
        }));
    }

    return (
        <TransactionsContext.Provider
            value={{
                transactions,
                getTransactions: handleGetTransactions,
                deleteTransaction: handleDeleteTransaction,
                prepareDiagramData: prepareChartData,
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
            "useTransactions must be used within a TransactionsProvider"
        );
    }
    return context;
}
