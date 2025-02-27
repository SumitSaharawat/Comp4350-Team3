"use client";

import { useState, useEffect } from "react";
import { useTransactions } from "@/app/contexts/TransactionsContext";
import { Transaction } from "../api/transac";
import { useAuth } from "@/app/contexts/AuthContext";

// components
import Navbar from "@/components/ui/Navbar";
import TransactionList from "@/components/ui/TransactionList";
import Sidebar from "@/components/ui/Sidebar";
import { DropDownButton } from "@/components/ui/Button";
import { SearchBar } from "@/components/ui/Input";

export default function TransactionsPage() {
    const { transactions, getTransactions } = useTransactions();
    const { user } = useAuth();
    const [data, setData] = useState<Transaction[]>([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const onSearchTermChange = (searchTerm: string) => {
        const searchedData = transactions.filter((transaction) =>
            transaction.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setData(searchedData);
    };

    useEffect(() => {
        const getDataOnRender = async () => {
            try {
                const success = await getTransactions(
                    user?.id || (localStorage.getItem("userid") as string)
                );
                if (success) {
                    setData(transactions);
                }
            } catch (err) {
                if (err instanceof Error) {
                    console.error(err.message);
                } else {
                    console.error("Transactions fetch failed!");
                }
            }
        };

        getDataOnRender();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        setData(transactions);
    }, [transactions]);

    const searchHint = "Search Transaction";
    const CategoryList = ["Cat 1", "Cat 3"];
    const onSelectCategory = (item: string) => {
        console.log(item);
        const filtereddData = transactions.filter((transaction) =>
            transaction.name.toLowerCase().includes(item.toLowerCase())
        );
        setData(filtereddData);
    };
    const middleComponent = () => {
        return (
            <div className="flex-1 flex justify-center">
                <SearchBar
                    searchHint={searchHint || ""}
                    onTextChange={onSearchTermChange}
                />
                <DropDownButton
                    dropDownName="Category"
                    dropDownList={CategoryList}
                    onSelectDropdown={onSelectCategory}
                />
            </div>
        );
    };

    const currencyList = ["CAD", "USD"];
    const onSelectCurrency = (item: string) => {
        console.log(item);
    };

    const rightComponent = () => {
        return (
            <details className="dropdown">
                <summary className="btn m-1">{"Currency"}</summary>
                <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                    {currencyList.map((d) => {
                        return (
                            <li key={d}>
                                <a onClick={() => onSelectCurrency(d)}>{d}</a>
                            </li>
                        );
                    })}
                </ul>
            </details>
        );
    };

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
                    middleComponent={middleComponent()}
                    rightComponent={rightComponent()}
                    toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                />

                {/* Transactions List */}
                <TransactionList transactions={data} />
            </div>
        </div>
    );
}
