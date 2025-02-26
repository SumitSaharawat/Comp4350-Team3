"use client";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { X } from "lucide-react";

interface TransactionFormModalProps {
    isOpen: boolean;
    toggle: () => void;
}

export default function TransactionFormModal({ isOpen, toggle }: TransactionFormModalProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(new Date()); // State for date
    const [currency, setCurrency] = useState<string>("CAD"); // default CAD
    const currencies = ["CAD", "USD"];

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
                    <X size={20} />
                </button>

                {/* Title */}
                <h2 className="text-xl font-bold mb-4 text-center">Add Transaction</h2>

                {/* Form */}
                <input
                    type="text"
                    placeholder="Transaction Name"
                    className="w-full border border-gray-300 p-2 rounded mb-2"
                />
                <input
                    type="number"
                    placeholder="Amount"
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

                <DatePicker
                    selected={selectedDate}
                    onChange={(date: Date | null) => setSelectedDate(date)}
                    dateFormat="yyyy-MM-dd"
                    className="w-full border border-gray-300 p-2 rounded mb-2"
                    showPopperArrow={false}
                />

                <button className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700">
                    Save
                </button>
            </div>
        </div>
    );
}