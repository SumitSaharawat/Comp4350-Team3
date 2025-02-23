"use client";

import { useState, useEffect } from "react";
import { useTransactions } from "@/app/contexts/TransactionsContext";
import { Transaction } from "../api/transac";
import { useAuth } from "@/app/contexts/AuthContext";

// components
import Navbar from "@/components/ui/navbar";
import TransactionList from "@/components/ui/TransactionList";

export default function TransactionsPage() {
    const { transactions, getTransactions } = useTransactions();
    const { user } = useAuth();
    const [data, setData] = useState<Transaction[]>([]);

    const currencies = ["CAD", "USD"];

    useEffect(() => {
        const getDataOnRender = async () => {
            console.log(`User is ${JSON.stringify(user)}`);
            try {
                const success = await getTransactions(user?.id || "");
                if (success) {
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

        if (user) {
            getDataOnRender();
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        setData(transactions);
    }, [transactions]);

    return (
        <>
            <Navbar
                title="Transactions"
                searchHint="Search Transactions"
                dropDownName="Currency"
                dropDownList={currencies}
            />
            <TransactionList transactions={data} />
        </>
    );
}
