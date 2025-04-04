"use client";

/**
 * Sidebar
 *
 * Display for every page
 */
import Link from "next/link";
import { usePathname } from "next/navigation";
import UserCard from "@/components/ui/UserCard";
import {
    LayoutDashboard,
    Receipt,
    LogOut,
    Tag,
    ChevronLeft,
    ChevronRight,
    Trophy,
    AlarmClock,
} from "lucide-react";
import { useAuth } from "@/app/contexts/AuthContext";
import {useEffect, useState} from "react";
import Image from "next/image";
import {isPair} from "yaml";

interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
    const pathname = usePathname();
    const { logout } = useAuth();
    const [isHovered, setIsHovered] = useState(false);
    const [username, setUsername] = useState<string>("User");

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedUsername = localStorage.getItem("username");
            if (storedUsername) {
                setUsername(storedUsername);
            }
        }
    }, []);

    const menuItems = [
        {
            name: "Dashboard",
            path: "/dashboard",
            icon: <LayoutDashboard className="w-6 h-6" />,
        },
        {
            name: "Transactions",
            path: "/transactions",
            icon: <Receipt className="w-6 h-6" />,
        },
        {
            name: "Tags",
            path: "/tag",
            icon: <Tag className="w-6 h-6" />,
        },
        {
            name: "Goals",
            path: "/goal",
            icon: <Trophy className="w-6 h-6" />,
        },
        {
            name: "Reminders",
            path: "/reminder",
            icon: <AlarmClock className="w-6 h-6" />,
        },
    ];

    return (
        <div
            className={`fixed top-0 left-0 pt-4 h-full bg-black text-foreground transition-all duration-300 ease-in-out ${
                isOpen ? "w-64" : "w-16"
            }`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {isOpen && (
                <div className="flex items-center gap-2 mb-6 ml-5">
                    <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                        <Image
                            src="/product_icon.jpeg"
                            alt="Product Icon"
                            width={36}
                            height={36}
                            className="object-cover"
                        />
                    </div>
                    <span className="text-xl font-semibold">Savi</span>
                </div>
            )}

            {/* Display Username */}
            {isOpen && (
                <div className="pb-4 px-2 border-t">
                    <UserCard username={username}/>
                </div>
            )}


            {/* Sidebar Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute top-8 -right-3 transform -translate-y-1/2 bg-transparent text-foreground
                p-1 rounded-lg shadow-md hover:text-gray-700 transition-all flex
                items-center justify-center w-8 h-8"
            >
                {isOpen ? (
                    <ChevronLeft className="w-6 h-6"/>
                ) : (
                    <ChevronRight className="w-6 h-6"/>
                )}
            </button>

            {!isOpen && (
                <div className="w-8 h-8 ml-3 rounded-full overflow-hidden flex-shrink-0 bg-gray-100">
                    <Image
                        src="/user_icon.png"
                        alt="User Avatar"
                        width={35}
                        height={35}
                        className="object-cover"
                    />
                </div>
            )}

            {/* Menu List */}
            <ul className="mt-6 space-y-4">
                {menuItems.map((item) => (
                    <li key={item.path} className="relative">
                        <Link
                            href={item.path}
                            className={`flex items-center gap-3 p-3 w-full transition-colors ${
                                pathname === item.path
                                    ? "bg-transparent text-customSkyBlue border-l-4 border-customSkyBlue"
                                    : "hover:bg-gray-900"
                            }`}
                        >
                            {item.icon}
                            {isOpen && (
                                <span className="transition-all duration-200">
                                    {item.name}
                                </span>
                            )}
                        </Link>
                    </li>
                ))}
            </ul>

            {/* Logout Button */}
            <div className="absolute bottom-4 left-0 w-full">
                <button
                    onClick={logout}
                    className="flex items-center gap-3 p-3 rounded-md text-gray-300 transition-colors hover:bg-gray-800 hover:text-white w-full"
                >
                    <LogOut className="w-6 h-6"/>
                    {isOpen && (
                        <span className="transition-all duration-200">
                            Sign Out
                        </span>
                    )}
                </button>
            </div>
        </div>
    );
}
