"use client";
import { useState } from "react";
import Sidebar from "@/components/ui/Sidebar";

export default function DashboardPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen}/>

        </div>
    );
}
