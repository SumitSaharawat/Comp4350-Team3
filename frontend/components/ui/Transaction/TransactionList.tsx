"use client";

/**
 * Transaction List
 *
 * Displays a table of transactions with expandable rows for edit/delete actions.
 */

import React, { useState } from "react";
import { MoreHorizontal, Trash2, Edit2 } from "lucide-react";
import { Transaction } from "@/app/api/transac";
import { useTransactions } from "@/app/contexts/TransactionsContext";

interface TransactionListProps {
    transactions: Transaction[];
    onEdit: (transaction: Transaction) => void;
}

export default function TransactionList({
    transactions,
    onEdit,
}: TransactionListProps) {
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
        <div className="w-full h-full overflow-y-auto border border-gray-300 rounded-lg shadow-sm">
            <table className="w-full border-collapse table-fixed">
                <thead className="sticky top-0 bg-customSecondDark text-foreground">
                <tr>
                    <th className="border-b border-gray-400 pl-4 pr-2 py-2 font-bold text-left">
                        Name
                    </th>
                    <th className="border-b border-gray-400 px-3 py-2 font-bold text-left">
                        Amount
                    </th>
                    <th className="border-b border-gray-400 px-3 py-2 font-bold text-left">
                        Type
                    </th>
                    <th className="border-b border-gray-400 px-3 py-2 font-bold text-left">
                        Date
                    </th>
                    <th className="border-b border-gray-400 py-2 font-bold text-center">
                        Tags
                    </th>
                    <th className="border-b border-gray-400 pl-8 py-2 font-bold text-center">
                        Actions
                    </th>
                </tr>
                </thead>

                <tbody className="text-foreground">
                {transactions.length > 0 ? (
                    transactions.map((tx) => (
                        <React.Fragment key={tx.id}>
                            {/* Transaction Row */}
                            <tr className="hover:bg-gray-800 h-12">
                                <td className="border-b border-gray-400 pl-4 pr-2 py-2 text-left">
                                    {tx.name || ""}
                                </td>
                                <td className="border-b border-gray-400 px-3 py-2 text-left">
                                    {tx.amount.toFixed(2)}
                                </td>
                                <td className="border-b border-gray-400 px-3 py-2 text-left">
                                    <span
                                        className={`font-semibold px-2 py-1 rounded-full text-sm
                                                    ${tx.type === "Saving" ? "text-green-700 bg-green-200" :
                                            tx.type === "Spending" ? "text-red-600 bg-red-100" : "text-gray-700 bg-gray-100"}`}
                                    >
                                        {tx.type}
                                    </span>
                                </td>
                                <td className="border-b border-gray-400 px-3 py-2 text-left">
                                    {new Date(tx.date).toLocaleDateString()}
                                </td>
                                <td className="border-b border-gray-400 py-2">
                                    <div className="flex items-center gap-2 flex-wrap ml-5">
                                        {tx.tags.map((tag: { id: string; name: string; color: string }) => (
                                            <div key={tag.id} className="flex items-center gap-1">
                                               <span
                                                   className="px-3 py-1 text-white rounded-full text-sm font-medium inline-block"
                                                   style={{backgroundColor: tag.color}}
                                               >
                                                    {tag.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                {/* Toggle Actions Button */}
                                <td className="border-b border-gray-400 pr-2 pl-8 py-2 text-center">
                                    <button
                                        onClick={() => toggleRow(tx.id)}
                                        className="text-gray-500 hover:text-black"
                                    >
                                        <MoreHorizontal size={20}/>
                                    </button>
                                </td>
                            </tr>

                            {/* Hidden Action Row (Appears on Toggle) */}
                            {expandedRow === tx.id && (
                                <tr>
                                <td
                                        colSpan={6}
                                        className="border-b border-gray-400 p-2 text-center"
                                    >
                                        <div className="flex justify-center gap-4">
                                            <button
                                                onClick={() =>
                                                    handleDelete(tx.id)
                                                }
                                                className="text-red-600 hover:text-red-800 flex items-center gap-1"
                                            >
                                                <Trash2 size={18} />
                                                Delete
                                            </button>
                                            <button
                                                onClick={() => onEdit(tx)}
                                                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
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
                        <td
                            colSpan={6}
                            className="text-center text-gray-500 py-4"
                        >
                            No transactions found.
                        </td>
                    </tr>
                )}
                </tbody>
            </table>
        </div>
    );
}
