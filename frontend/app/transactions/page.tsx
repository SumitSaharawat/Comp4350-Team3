"use client";

import { useState, useEffect } from "react";
import { useTransactions } from "@/app/contexts/TransactionsContext";
import { Transaction } from "../api/transac";
import { useAuth } from "@/app/contexts/AuthContext";

// components
import Navbar from "@/components/ui/Navbar";
import TransactionList from "@/components/ui/TransactionList";
import Sidebar from "@/components/ui/Sidebar";
import {FloatingButton} from "@/components/ui/Button";
import TransactionFormModal from "@/components/ui/TransactionFormModal";

export default function TransactionsPage() {
    const { transactions, getTransactions } = useTransactions();
    const { user, getUser } = useAuth();
    const [data, setData] = useState<Transaction[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);

    const currencies = ["CAD", "USD"];

    const onSearchTermChange = (searchTerm: string) => {
        console.log(searchTerm);
    };

    useEffect(() => {
        const getDataOnRender = async () => {
            try {
                console.log(`User is : ${JSON.stringify(user)}`);
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

                {/* Floating + button */}
                <FloatingButton toggle={() => setIsFormOpen(!isFormOpen)} />

                {/* transaction window */}
                <TransactionFormModal isOpen={isFormOpen} toggle={() => setIsFormOpen(!isFormOpen)} />
            </div>
        </div>
    );
}
