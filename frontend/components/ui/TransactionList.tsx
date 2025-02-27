"use client";

import React, { useState } from "react";
import { Transaction } from "@/app/api/transac";
import { useTransactions } from "@/app/contexts/TransactionsContext";
import { Trash2, Edit2, MoreHorizontal } from "lucide-react";

interface TransactionListProps {
    transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
    const { deleteTransaction } = useTransactions();
    const [expandedRow, setExpandedRow] = useState<string | null>(null);

    const handleDelete = async (transactionId: string) => {
        if (confirm("Are you sure you want to delete this transaction?")) {
            await deleteTransaction(transactionId);
        }
    };

    const toggleRow = (transactionId: string) => {
        setExpandedRow(expandedRow === transactionId ? null : transactionId);
    };

    return (
        <div className="w-full max-h-96 overflow-y-auto border border-gray-300 rounded-lg shadow-sm">
            <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-gray-200 dark:bg-gray-800 text-black dark:text-white">
                <tr>
                    <th className="border-b border-gray-400 px-2 py-2 font-bold text-left">Name</th>
                    <th className="border-b border-gray-400 px-3 py-2 font-bold text-left">Date</th>
                    <th className="border-b border-gray-400 px-4 py-2 font-bold text-left">Amount</th>
                    <th className="border-b border-gray-400 px-4 py-2 font-bold text-left">Currency</th>
                    <th className="border-b border-gray-400 px-4 py-2 font-bold text-center">Actions</th>
                </tr>
                </thead>

                <tbody className="text-black dark:text-white">
                {transactions.length > 0 ? (
                    transactions.map((tx) => (
                        <React.Fragment key={tx.id}>
                            {/* Transaction Row */}
                            <tr className="hover:bg-gray-200 dark:hover:bg-gray-600">
                                <td className="border-b border-gray-400 px-2 py-2 text-left">
                                    {tx.name || ""}
                                </td>
                                <td className="border-b border-gray-400 px-3 py-2 text-left">
                                    {new Date(tx.date).toLocaleDateString()}
                                </td>
                                <td className="border-b border-gray-400 px-4 py-2 text-left">
                                    {tx.amount.toFixed(2)}
                                </td>
                                <td className="border-b border-gray-400 px-4 py-2 text-left">
                                    {tx.currency}
                                </td>
                                {/* Toggle Action Button */}
                                <td className="border-b border-gray-400 px-4 py-2 text-center">
                                    <button
                                        onClick={() => toggleRow(tx.id)}
                                        className="text-gray-600 hover:text-black"
                                    >
                                        <MoreHorizontal size={20} />
                                    </button>
                                </td>
                            </tr>

                            {/* Hidden Action Row */}
                            {expandedRow === tx.id && (
                                <tr>
                                    <td colSpan={5} className="border-b border-gray-400 p-2 text-center">
                                        <div className="flex justify-center gap-4">
                                            <button
                                                onClick={() => handleDelete(tx.id)}
                                                className="text-red-600 hover:text-red-800 flex items-center gap-1"
                                            >
                                                <Trash2 size={18} />
                                                Delete
                                            </button>
                                            <button
                                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                                                onClick={() => console.log("Edit Transaction", tx.id)}
                                            >
                                                <Edit2 size={18} />
                                                Edit
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))
                ) : (
                    <tr>
                        <td colSpan={5} className="text-center text-gray-500 py-4">
                            No transactions found.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
