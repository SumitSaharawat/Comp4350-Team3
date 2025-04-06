"use client";

import {useTransactions} from "@/app/contexts/TransactionsContext";
import {useAuth} from "@/app/contexts/AuthContext";
import {useEffect, useState} from "react";
import {Transaction} from "@/app/api/transac";
import {useRouter} from "next/navigation";

export default function TransactionListCard() {
    const [data, setData] = useState<Transaction[]>([]);
    const {transactions, getTransactions} = useTransactions();
    const { user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        getTransactions(user?.id || localStorage.getItem("userid")!);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (transactions.length > 0) {
            setData(transactions);
        }
    }, [transactions]);

    return (
        <div className="bg-transparent p-2 rounded-xl shadow flex flex-col h-full">
            {/* Title row */}
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-white font-semibold text-lg">Transaction</h2>
                <button
                    className="text-blue-400 text-sm hover:underline"
                    onClick={() => router.push("/transactions")}
                >See More</button>

            </div>

            {/* List */}
            <div className="flex flex-col gap-3 overflow-y-auto">
                {data.map((tx, index) => (
                    <div key={index} className="flex justify-between items-center">
                        {/* Left: icon + text */}
                        <div className="flex items-start gap-2">
                            <div className="w-6 h-6 rounded-full bg-gray-800 flex items-center justify-center text-xs text-white">
                                💰
                            </div>
                            <div>
                                <p className="text-white text-lg font-medium">{tx.name}</p>
                            </div>
                        </div>

                        {/* Right: amount + date */}
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
