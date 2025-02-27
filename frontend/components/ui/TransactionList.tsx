"use client";

import { Transaction } from "@/app/api/transac";
import { useTransactions } from "@/app/contexts/TransactionsContext";
import { Trash2 } from "lucide-react";

interface TransactionListProps {
    transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
    const { deleteTransaction } = useTransactions();

    const handleDelete = async (transactionId: string) => {
        if (confirm("Are you sure you want to delete this transaction?")) {
            await deleteTransaction(transactionId);
        }
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
                        <tr key={tx.id} className="hover:bg-gray-200 dark:hover:bg-gray-600">
                            <td className="border-b border-gray-400 px-2 py-2 text-left">{tx.name || ""}</td>
                            <td className="border-b border-gray-400 px-3 py-2 text-left">
                                {new Date(tx.date).toLocaleDateString()}
                            </td>
                            <td className="border-b border-gray-400 px-4 py-2 text-left">
                                {tx.amount.toFixed(2)}
                            </td>
                            <td className="border-b border-gray-400 px-4 py-2 text-left">{tx.currency}</td>
                            {/* Delete Button Column */}
                            <td className="border-b border-gray-400 px-4 py-2 text-center">
                                <button
                                    onClick={() => handleDelete(tx.id)}
                                    className="text-red-600 hover:text-red-800"
                                >
                                    <Trash2 size={20} />
                                </button>
                            </td>
                        </tr>
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
