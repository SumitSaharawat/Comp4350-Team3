"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Receipt, LogOut, Tag } from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";

interface SidebarProps {
    isOpen: boolean;
}

export default function Sidebar({ isOpen }: SidebarProps) {
    const pathname = usePathname();
    const { logout } = useAuth();
    const menuItems = [
        {
            name: "Dashboard",
            path: "",
            icon: <LayoutDashboard className="w-5 h-5" />,
        },
        {
            name: "Transactions",
            path: "/transactions",
            icon: <Receipt className="w-5 h-5" />,
        },
        {
            name: "Tags",
            path: "/tag",
            icon: <Tag className="w-5 h-5" />,
        },
    ];

    return (
        <div
            className={`fixed top-0 left-0 h-full w-64 bg-gray-900 text-white transition-transform duration-300 ${
                isOpen ? "translate-x-0" : "-translate-x-64"
            }`}
        >
            <ul className="mt-10 space-y-4 px-4">
                {menuItems.map((item) => (
                    <li key={item.path} className="flex justify-between">
                        <Link
                            href={item.path}
                            className={`flex items-center gap-2 p-2 rounded w-full transition-colors ${
                                pathname === item.path
                                    ? "bg-purple-600 text-white"
                                    : "hover:bg-gray-700"
                            }`}
                        >
                            {item.icon}
                            <span>{item.name}</span>
                        </Link>
                    </li>
                ))}
            </ul>


            <div className="absolute bottom-4 left-4 right-4">
                <button
                    onClick={logout}
                    className="flex items-center gap-2 p-2 rounded text-gray-300 transition-colors hover:bg-gray-800 hover:text-white w-full"
                >
                    <LogOut className="w-5 h-5"/>
                    <span>Sign Out</span>
                </button>
            </div>
        </div>
    );
}
