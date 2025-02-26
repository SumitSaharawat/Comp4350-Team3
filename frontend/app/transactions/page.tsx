"use client";

import { useState, useEffect } from "react";
import { useTransactions } from "@/app/contexts/TransactionsContext";
import { Transaction } from "../api/transac";
import { useAuth } from "@/app/contexts/AuthContext";

// components
import Navbar from "@/components/ui/Navbar";
import TransactionList from "@/components/ui/TransactionList";
import Sidebar from "@/components/ui/Sidebar";

export default function TransactionsPage() {
    const { transactions, getTransactions } = useTransactions();
    const { user, getUser } = useAuth();
    const [data, setData] = useState<Transaction[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const currencies = ["CAD", "USD"];

    const onSearchTermChange = (searchTerm: string) => {
        console.log(searchTerm);
    };

    useEffect(() => {
        const getDataOnRender = async () => {
            try {
                const success = await getTransactions(user?.id || "");
                if (success) {
                    console.log(`Get from backend: ${transactions}`);
                    setData(transactions);
                }
            } catch (err) {
                if (err instanceof Error) {
                    console.log(err.message);
                } else {
                    console.log("Transactions fetch failed!");
                }
            }
        };

        if (!user) {
            getUser();
        }
        getDataOnRender();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        setData(transactions);
    }, [transactions]);

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} />

            <div
                className={`flex-1 transition-all duration-300 ${
                    isSidebarOpen ? "ml-64" : "ml-0"
                }`}
            >
                <Navbar
                    title="Transactions"
                    searchHint="Search Transactions"
                    dropDownName="Currency"
                    dropDownList={currencies}
                    onSearchTermChange={onSearchTermChange}
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />

                {/* Transactions List */}
                <TransactionList transactions={data} />
            </div>
        </div>
    );
}
