"use client";

import { useState, useEffect } from "react";
import { useTransactions } from "@/app/contexts/TransactionsContext";
import { Transaction } from "../api/transac";

export default function TransactionsPage() {
    const { transactions, getTransactions } = useTransactions();
    const [data, setData] = useState<Transaction[]>([]);

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
        <div>
          <h2>Transactions</h2>
          <ul>
            {data.map((d) => (
              <li key={d.id}>
                {d.currency}: ${d.amount}
              </li>
            ))}
          </ul>
        </div>
      );
}
