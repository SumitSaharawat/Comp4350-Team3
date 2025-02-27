"use client";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { X } from "lucide-react";
import { addTransactionsToServer } from "@/app/api/transac";

interface TransactionFormModalProps {
    isOpen: boolean;
    toggle: () => void;
    refreshTransactions: () => void;
}

export default function TransactionFormModal({ isOpen, toggle, refreshTransactions}: TransactionFormModalProps) {
    const [name, setName] = useState<string>("");
    const [amount, setAmount] = useState<number | "">("");
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
    const [currency, setCurrency] = useState<string>("CAD"); // Default CAD
    const currencies = ["CAD", "USD"];
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState<{ text: string; type: "error" | "success" } | null>(null);

    const handleSubmit = async () => {
        setMessage(null);

        if (!name || !amount || !currency || !selectedDate) {
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
            // Format date to `yyyy-MM-dd`
            const formattedDate = selectedDate.toISOString().split("T")[0];

            await addTransactionsToServer(userid, name, formattedDate, Number(amount), currency);
            setMessage({ text: "Transaction added successfully!", type: "success" });

            setTimeout(() => {
                setMessage(null);
                setName("");
                setAmount("");
                toggle(); // Close modal
                refreshTransactions(); // Refresh transaction list
            }, 1500);
        } catch (error) {
            setMessage({ text: error instanceof Error ? error.message : "Failed to add transaction", type: "error" });
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
                <h2 className="text-xl font-bold mb-4 text-center">Add Transaction</h2>

                {/* Transaction name */}
                <input
                    type="text"
                    placeholder="Transaction Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full border border-gray-300 p-2 rounded mb-2"
                />

                {/* Amount Input */}
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value ? Number(e.target.value) : "")}
                    className="w-full border border-gray-300 p-2 rounded mb-2"
                />

                {/* Currency Dropdown */}
                <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
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
                    selected={selectedDate}
                    onChange={(date: Date | null) => setSelectedDate(date)}
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
