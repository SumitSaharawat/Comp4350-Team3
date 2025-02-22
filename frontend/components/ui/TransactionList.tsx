"use client";

import { Transaction } from "@/app/api/transac";

interface TransactionListProps {
    transactions: Transaction[];
}

export default function TransactionList({ transactions }: TransactionListProps) {
    return (
        <div className="w-full max-h-96 overflow-y-auto border border-gray-300 rounded-lg shadow-sm">
            <table className="w-full border-collapse">
                <thead className="sticky top-0 bg-gray-200 text-black">
                    <tr>
                        <th className="border border-gray-400 px-4 py-2 font-bold">Date</th>
                        <th className="border border-gray-400 px-4 py-2 font-bold">Amount</th>
                        <th className="border border-gray-400 px-4 py-2 font-bold">Currency</th>
                    </tr>
                </thead>

                <tbody className="text-black">
                    {transactions.length > 0 ? (
                        transactions.map((tx) => (
                            <tr key={tx.id} className="hover:bg-gray-100">
                                <td className="border border-gray-400 px-4 py-2">
                                    {new Date(tx.date).toLocaleDateString()}
                                </td>
                                <td className="border border-gray-400 px-4 py-2">
                                    {tx.amount.toFixed(2)}
                                </td>
                                <td className="border border-gray-400 px-4 py-2">{tx.currency}</td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3} className="text-center text-gray-500 py-4">
                                No transactions found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
