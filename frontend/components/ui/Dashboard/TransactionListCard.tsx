"use client";

/**
 * TransactionListCard
 *
 * A compact dashboard widget that displays a scrollable list of recent transactions.
 * Transactions are color-coded based on type (Saving vs Spending).
 */

import { useTransactions } from "@/app/contexts/TransactionsContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { useEffect, useState } from "react";
import { Transaction } from "@/app/api/transac";
import { useRouter } from "next/navigation";

export default function TransactionListCard() {
    const [data, setData] = useState<Transaction[]>([]);
    const { transactions, getTransactions } = useTransactions();
    const { user } = useAuth();
    const router = useRouter();

    /**
     * Fetch transactions for current user on initial mount
     */
    useEffect(() => {
        getTransactions(user?.id || localStorage.getItem("userid")!);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * When transactions update in context, update local state
     */
    useEffect(() => {
        if (transactions.length > 0) {
            setData(transactions);
        }
    }, [transactions]);

    return (
        <div className="bg-transparent p-2 rounded-xl shadow flex flex-col h-full">
            {/* Title section with navigation */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-white font-semibold text-lg">Transaction</h2>
                <button
                    className="text-blue-400 text-sm hover:underline"
                    onClick={() => router.push("/transactions")}
                >
                    See More
                </button>
            </div>

            {/* Scrollable transaction list */}
            <div className="flex flex-col gap-3 overflow-y-auto">
                {data.map((tx, index) => (
                    <div key={index} className="flex justify-between items-center">
                        {/* Left: icon and transaction name */}
                        <div className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-xs text-white">
                                💰
                            </div>
                            <div>
                                <p className="text-white text-lg font-medium">{tx.name}</p>
                            </div>
                        </div>

                        {/* Right: amount (color-coded) and date */}
                        <div className="text-right">
                            <p
                                className={`font-semibold ${
                                    tx.type === "Saving" ? "text-green-400" : "text-red-400"
                                }`}
                            >
                                ${tx.amount.toFixed(2)}
                            </p>
                            <p className="text-sm text-gray-400">
                                {new Date(tx.date).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
