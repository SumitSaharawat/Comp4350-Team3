"use client";
import {useEffect, useState} from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { X } from "lucide-react";
import { addTransactionsToServer, editTransactionsOnServer, Transaction} from "@/app/api/transac";
const currencies = ["CAD", "USD"];

interface TransactionFormModalProps {
    isOpen: boolean;
    toggle: () => void;
    refreshTransactions: () => void;
    mode: "add" | "edit";
    existingTransaction?: Transaction | null;
}

export default function TransactionFormModal({
                                                 isOpen,
                                                 toggle,
                                                 refreshTransactions,
                                                 mode,
                                                 existingTransaction
}: TransactionFormModalProps) {

    const [transacData, setTransacData] = useState({
        name: "",
        amount: null as number | null,
        time: new Date(),
        currency: "CAD",
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{
        text: string;
        type: "error" | "success"
    } | null>(null);

    const [headLine, setHeadLine] = useState<string>("");

    const cleanTransacData = ()=>{
        transacData.name = "";
        transacData.amount = null;
        transacData.time = new Date();
        transacData.currency = "CAD"
    }

    const handleChange = (field: keyof typeof transacData, value: string | number | Date | null) => {
        setTransacData((prev) => ({
            ...prev,
            [field]: value === "" ? null : value,
        }));
    };

    useEffect(() => {
        if (mode === "edit" && existingTransaction) {
            transacData.name = existingTransaction.name;
            transacData.amount = existingTransaction.amount;
            transacData.time = new Date(existingTransaction.date);
            transacData.currency = existingTransaction.currency;
            setHeadLine("Edit Transaction");

        } else {
            cleanTransacData();
            setHeadLine("Add Transaction");
        }
    }, [mode, existingTransaction]);

    const handleSubmit = async () => {
        setMessage(null);

        if (!transacData.name || !transacData.amount || !transacData.currency) {
            setMessage({ text: "All fields are required.", type: "error" });
            return;
        }

        const userid = localStorage.getItem("userid");
        if (!userid) {
            setMessage({ text: "User ID not found, please log in again.", type: "error" });
            return;
        }

        try {
            setLoading(true);
            const formattedDate = transacData.time.toLocaleDateString(
                "en-US",
                {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                }
            );

            if (mode === "add") {
                await addTransactionsToServer(
                    userid,
                    transacData.name,
                    formattedDate,
                    transacData.amount,
                    transacData.currency
                );
                setMessage({ text: "Transaction added successfully!", type: "success" });

            } else if (mode === "edit" && existingTransaction) {
                await editTransactionsOnServer(
                    existingTransaction.id,
                    transacData.name,
                    formattedDate,
                    transacData.amount,
                    transacData.currency
                );
                setMessage({ text: "Transaction updated successfully!", type: "success" });
            }

            setTimeout(() => {
                setMessage(null);
                toggle();
                cleanTransacData();
                refreshTransactions();
            }, 500);

        } catch (error) {
            setMessage({ text: error instanceof Error ? error.message : "Failed to process transaction", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center transition-opacity ${
                isOpen ? "opacity-100 visible" : "opacity-0 invisible"
            }`}
        >
            <div className="relative bg-white p-6 rounded-lg shadow-xl w-96">
                {/* Close Button (X) */}
                <button
                    onClick={toggle}
                    className="absolute top-2 right-2 text-gray-600 hover:text-black"
                >
                    <X size={20}/>
                </button>

                {/* Title */}
                <h2 className="text-xl font-bold mb-4 text-center">{headLine}</h2>

                {/* Transaction name */}
                <input
                    type="text"
                    placeholder="Transaction Name"
                    value={transacData.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded mb-2"
                />

                {/* Amount Input */}
                <input
                    type="number"
                    placeholder="Amount"
                    value={transacData.amount ?? ""}
                    onChange={(e) =>
                        handleChange("amount", e.target.value === "" ? null : Number(e.target.value))}
                    className="w-full border border-gray-300 p-2 rounded mb-2"
                />

                {/* Currency Dropdown */}
                <select
                    value={transacData.currency}
                    onChange={(e) =>
                        handleChange("currency", e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded mb-4 bg-white"
                >
                    {currencies.map((cur) => (
                        <option key={cur} value={cur}>
                            {cur}
                        </option>
                    ))}
                </select>

                {/* Date Picker */}
                <DatePicker
                    selected={transacData.time}
                    onChange={(date: Date | null) =>
                        handleChange("time", date || new Date())}
                    dateFormat="yyyy-MM-dd"
                    className="w-full border border-gray-300 p-2 rounded mb-2"
                    showPopperArrow={false}
                />

                {/* Save Button */}
                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? "Processing..." : "Save"}
                </button>

                {/* Message Display */}
                {message && (
                    <p className={`text-sm text-center mt-2 ${message.type === "error" ? "text-red-600" : "text-green-600"}`}>
                        {message.text}
                    </p>
                )}
            </div>
        </div>
    );
}
