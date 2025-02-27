"use client";

import { Transaction } from "@/app/api/transac";

interface TransactionListProps {
    transactions: Transaction[];
}

export default function TransactionList({
    transactions,
}: TransactionListProps) {
    return (
        <div className="w-full max-h-96 overflow-y-auto border border-gray-300 rounded-lg shadow-sm">
            <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-gray-200 dark:bg-gray-800 text-black dark:text-white">
                    <tr>
                        <th className="border-b border-gray-400 px-1 py-2 font-bold text-left">
                            Name
                        </th>
                        <th className="border-b border-gray-400 px-3 py-2 font-bold text-left">
                            Date
                        </th>
                        <th className="border-b border-gray-400 px-4 py-2 font-bold text-left">
                            Amount
                        </th>
                        <th className="border-b border-gray-400 px-4 py-2 font-bold text-left">
                            Currency
                        </th>
                    </tr>
                </thead>

                <tbody className="text-black dark:text-white">
                    {transactions.length > 0 ? (
                        transactions.map((tx) => (
                            <tr
                                key={tx.id}
                                className="hover:bg-gray-200 dark:hover:bg-gray-600"
                            >
                                <td className="border-b border-gray-400 px-1 py-2 text-left">
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
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={4}
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
