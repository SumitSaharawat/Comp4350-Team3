"use client";

/**
 * Dashboard page
 *
 * Display the basic data of current user
 */
import React, { useState, useEffect } from "react";
import Layout from "@/components/ui/Layout";
import { useTransactions } from "../contexts/TransactionsContext";
import { useAuth } from "../contexts/AuthContext";
import DashboardHeader from "@/components/ui/Dashboard/DashboardHeader";
import {BarChart2, DollarSign} from "lucide-react"
import SavingSpendingChart from "@/components/ui/Dashboard/SavingSpendingChart";
import TransactionListCard from "@/components/ui/Dashboard/TransactionListCard";
import DashboardReminderCard from "@/components/ui/Dashboard/DashboardReminderCard";
import DashboardGoalCard from "@/components/ui/Dashboard/DashboardGoalCard";

// used for calculating the time difference
const SEC_PER_DAY = 86400;

export default function DashboardPage() {
    const { transactions, getTransactions } = useTransactions();
    const { user, getUser } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [spendings, setSpendings] = useState(0);
    const [savings, setSavings] = useState(0);
    const [timePeriod, setTimePeriod] = useState("");
    const [dataFetched, setDataFetched] = useState(false);

    // return the start and end date in month, day format for the past 30 days
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

    // calculate the total spending of the user in the past 30 days from transactions
    const calculateSpending = (startDate: Date) => {
        // only include the transactions that happend in the past 30 days and are spendings
        const spendTransactions = transactions.filter(
            (t) =>
                Math.abs(startDate.getTime() - new Date(t.date).getTime()) /
                    1000 <
                    SEC_PER_DAY * 30 && t.type === "Spending"
        );
        // sum the result
        return spendTransactions.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.amount;
        }, 0);
    };

    // calculate the total saving of the user in the past 30 days from transactions
    const calculateSavings = (startDate: Date) => {
        // only include the transactions that happend in the past 30 days and are savings
        const spendTransactions = transactions.filter(
            (t) =>
                Math.abs(startDate.getTime() - new Date(t.date).getTime()) /
                    1000 <
                    SEC_PER_DAY * 30 && t.type === "Saving"
        );
        // sum the result
        return spendTransactions.reduce((accumulator, currentValue) => {
            return accumulator + currentValue.amount;
        }, 0);
    };

    useEffect(() => {
        getUser();
        // get transactions when they have not been requested by other page
        if (transactions.length <= 0 && !dataFetched) {
            getTransactions(
                user?.id || (localStorage.getItem("userid") as string)
            );
            setDataFetched(true);
        }
        // recalculate all the data when there are changes in the transactions
        setSpendings(calculateSpending(new Date()));
        setSavings(calculateSavings(new Date()));
        setTimePeriod(calculateTimePeriod(new Date()));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [transactions]);

    function Price({ amount }: { amount?: number }) {
        if (typeof amount !== "number") {
            return <span className="text-2xl font-bold text-gray-400">--</span>;
        }
        return (
            <span className="ml-3 mt-1 text-4xl font-bold inline-flex items-start">
                {amount.toFixed(2)}
                <DollarSign className="w-5 h-5 text-gray-300 ml-1 align-super" />
            </span>
        );
    }

    return (
        // <div className="flex h-screen">
        //     {/* Sidebar */}
        //     <div
        //         className={`bg-gray-900 transition-all duration-300 ${
        //             isSidebarOpen ? "w-64" : "w-16"
        //         }`}
        //     >
        //         <Sidebar
        //             isOpen={isSidebarOpen}
        //             toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        //         />
        //     </div>
        //
        //     {/* Main content */}
        //     <div className="flex-grow h-screen flex justify-center items-center">
        //         <div className="stats stats-vertical lg:stats-horizontal shadow">
        //             <div className="stat w-64">
        //                 <div className="stat-title">
        //                     Spendings of the past month
        //                 </div>
        //                 <div className="stat-value">{spendings}</div>
        //                 <div className="stat-desc">{timePeriod}</div>
        //             </div>
        //
        //             <div className="stat w-64">
        //                 <div className="stat-title">
        //                     Savings of the past month
        //                 </div>
        //                 <div className="stat-value">{savings}</div>
        //                 <div className="stat-desc">{timePeriod}</div>
        //             </div>
        //
        //             <div className="stat w-64">
        //                 <div className="stat-title">Current Balance</div>
        //                 <div className="stat-value">{user?.balance}</div>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <Layout title="Dashboard">
            <div className="min-h-screen flex">
                <div className="flex-1 flex flex-col space-y-4 p-6">
                    <DashboardHeader username={user?.username}/>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Savings */}
                        <div className="bg-black/50 border p-4 rounded-xl shadow flex flex-col gap-2 hover:bg-blue-600 transition">
                            <div className="flex items-center gap-2">
                                <BarChart2 className="w-10 h-6 text-green-400"/>
                                <p className="text-l text-green-400">Saving</p>
                            </div>
                            <Price amount={savings}/>
                        </div>

                        {/* My Balance */}
                        <div
                            className="bg-black/50 border p-4 rounded-xl shadow flex flex-col gap-2 hover:bg-blue-600 transition">
                            <div className="flex items-center gap-2">
                                <BarChart2 className="w-10 h-6 text-foreground"/>
                                <p className="text-l text-foreground">My Balance</p>
                            </div>
                            <Price amount={user?.balance}/>
                        </div>

                        {/* Spending */}
                        <div
                            className="bg-black/50 border p-4 rounded-xl shadow flex flex-col gap-2 hover:bg-blue-600 transition">
                            <div className="flex items-center gap-2">
                                <BarChart2 className="w-10 h-6 text-red-400"/>
                                <p className="text-l text-red-400">Spending</p>
                            </div>
                            <Price amount={spendings}/>
                        </div>
                    </div>

                    {/* === Charts / Invoices Section === */}
                    <div className="grid grid-cols-1 md:grid-cols-[2fr,1fr] gap-4">
                        <div className="bg-black p-4 rounded-xl h-80 shadow">
                            <div className="h-full">
                                <SavingSpendingChart/>
                            </div>
                        </div>

                        <div className="bg-black p-4 rounded-xl h-80 shadow">
                            <TransactionListCard/>
                        </div>
                    </div>

                    {/* === Transaction & Savings Section === */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Reminder card - 1 col */}
                        <div className="col-span-1">
                            <DashboardReminderCard />
                        </div>

                        {/* Goal card - 1 col*/}
                        <div className="col-span-1">
                            <DashboardGoalCard/>
                        </div>

                    </div>
                </div>
            </div>
        </Layout>
    );
}
