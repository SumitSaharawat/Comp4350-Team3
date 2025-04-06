"use client";

import {
    ResponsiveContainer,
    ComposedChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";
import {ChartDataPoint, useTransactions} from "@/app/contexts/TransactionsContext";
import {useAuth} from "@/app/contexts/AuthContext";
import {useEffect, useState} from "react";

export default function SavingSpendingChart() {
    const [data, setData] = useState<ChartDataPoint[]>([]);
    const {transactions, prepareDiagramData, getTransactions} = useTransactions();
    const { user } = useAuth();

    useEffect(() => {
        getTransactions(user?.id || localStorage.getItem("userid")!);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (transactions.length > 0) {
            setData(prepareDiagramData(transactions));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactions]);

    return (
        <div className="w-full h-full flex flex-col">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-4 text-sm text-white">
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                        Saving
                    </div>
                    <div className="flex items-center gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full" />
                        Spending
                    </div>
                </div>
            </div>

            {/* Chart */}
            <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={data}>
                    <XAxis dataKey="label" stroke="#ccc" />
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
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#1f2937',
                            borderColor: '#374151',
                            borderRadius: 8,
                            color: "white",
                        }}
                    />
                    <Bar dataKey="saving" fill="#10B981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="spending" fill="#6B7280" radius={[0, 0, 4, 4]} />
                </ComposedChart>
            </ResponsiveContainer>
        </div>
    );
}
