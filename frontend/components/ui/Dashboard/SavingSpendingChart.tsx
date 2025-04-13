"use client";

/**
 * SavingSpendingChart
 *
 * A responsive bar chart visualizing user's savings vs spending using Recharts.
 * Data is fetched from transactions and preprocessed into chart-friendly format.
 */

import {
    ResponsiveContainer,
    ComposedChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import { ChartDataPoint, useTransactions } from "@/app/contexts/TransactionsContext";
import { useAuth } from "@/app/contexts/AuthContext";
import { useEffect, useState } from "react";

export default function SavingSpendingChart() {
    const [data, setData] = useState<ChartDataPoint[]>([]);
    const { transactions, prepareDiagramData, getTransactions } = useTransactions();
    const { user } = useAuth();

    /**
     * Fetch transactions for the current user on mount
     */
    useEffect(() => {
        getTransactions(user?.id || localStorage.getItem("userid")!);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Once transactions are loaded, prepare and set chart data
     */
    useEffect(() => {
        if (transactions.length > 0) {
            setData(prepareDiagramData(transactions));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactions]);

    return (
        <div className="w-full h-full flex flex-col">
            {/* Chart header legend */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-4 text-sm text-white">
                    {/* Legend: Saving */}
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        Saving
                    </div>
                    {/* Legend: Spending */}
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full" />
                        Spending
                    </div>
                </div>
            </div>

            {/* Bar Chart */}
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data}>
                    {/* Horizontal axis using label (e.g., month) */}
                    <XAxis dataKey="label" stroke="#ccc" />

                    {/* Vertical axis with currency formatting */}
                    <YAxis
                        stroke="#ccc"
                        tickFormatter={(value) =>
                            new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: "USD",
                                notation: "compact",
                                maximumFractionDigits: 1,
                            }).format(value)
                        }
                    />

                    {/* Tooltip on hover */}
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1f2937',
                            borderColor: '#374151',
                            borderRadius: 8,
                            color: "white",
                        }}
                    />

                    {/* Savings bar (green) */}
                    <Bar dataKey="saving" fill="#10B981" radius={[4, 4, 0, 0]} />

                    {/* Spending bar (gray) */}
                    <Bar dataKey="spending" fill="#6B7280" radius={[0, 0, 4, 4]} />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
