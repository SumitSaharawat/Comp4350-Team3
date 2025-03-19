"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/ui/Sidebar";
import { useTransactions } from "../contexts/TransactionsContext";
import { useAuth } from "../contexts/AuthContext";

const SEC_PER_DAY = 86400;

export default function DashboardPage() {
    const { transactions, getTransactions } = useTransactions();
    const { user, getUser } = useAuth();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [spendings, setSpendings] = useState(0);
    const [savings, setSavings] = useState(0);
    const [timePeriod, setTimePeriod] = useState("");
    const [dataFetched, setDataFetched] = useState(false);

    const calculateTimePeriod = (startDate: Date) => {
        const prev = new Date(new Date().setDate(startDate.getDate() - 30));

        return `${startDate.toLocaleString("en-US", {
            day: "numeric",
            month: "short",
        })} - ${prev.toLocaleString("en-US", {
            day: "numeric",
            month: "short",
        })}`;
    };

    const calculateSpending = (startDate: Date) => {
        const spendTransactions = transactions.filter(
            (t) =>
                Math.abs(startDate.getTime() - new Date(t.date).getTime()) /
                    1000 <
                    SEC_PER_DAY * 30 && t.type === "Spending"
        );
        return spendTransactions.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.amount;
        }, 0);
    };

    const calculateSavings = (startDate: Date) => {
        const spendTransactions = transactions.filter(
            (t) =>
                Math.abs(startDate.getTime() - new Date(t.date).getTime()) /
                    1000 <
                    SEC_PER_DAY * 30 && t.type === "Saving"
        );
        return spendTransactions.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.amount;
        }, 0);
    };

    useEffect(() => {
        getUser();
        if (transactions.length <= 0 && !dataFetched) {
            getTransactions(
                user?.id || (localStorage.getItem("userid") as string)
            );
            setDataFetched(true);
        }
        setSpendings(calculateSpending(new Date()));
        setSavings(calculateSavings(new Date()));
        setTimePeriod(calculateTimePeriod(new Date()));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactions]);

    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div
                className={`bg-gray-900 transition-all duration-300 ${
                    isSidebarOpen ? "w-64" : "w-16"
                }`}
            >
                <Sidebar
                    isOpen={isSidebarOpen}
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />
            </div>

            {/* Main content */}
            <div className="flex-grow h-screen flex justify-center items-center">
                <div className="stats stats-vertical lg:stats-horizontal shadow">
                    <div className="stat w-64">
                        <div className="stat-title">
                            Spendings of the past month
                        </div>
                        <div className="stat-value">{spendings}</div>
                        <div className="stat-desc">{timePeriod}</div>
                    </div>

                    <div className="stat w-64">
                        <div className="stat-title">
                            Savings of the past month
                        </div>
                        <div className="stat-value">{savings}</div>
                        <div className="stat-desc">{timePeriod}</div>
                    </div>

                    <div className="stat w-64">
                        <div className="stat-title">Current Balance</div>
                        <div className="stat-value">{user?.balance}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
