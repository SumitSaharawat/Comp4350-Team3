"use client";

import { useState, useEffect } from "react";
import { useTransactions } from "@/app/contexts/TransactionsContext";
import { Transaction } from "../api/transac";

// components
import Navbar from "@/components/ui/navbar";

export default function TransactionsPage() {
    const { transactions, getTransactions } = useTransactions();
    const [data, setData] = useState<Transaction[]>([]);

    const currencies = ["CAD", "USD"];

    useEffect(() => {
        const getDataOnRender = async () => {
            try {
                const success = await getTransactions();
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

        getDataOnRender();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
        </>
    );
}
