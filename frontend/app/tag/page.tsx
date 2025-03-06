"use client";
import { useState } from "react";
import Sidebar from "@/components/ui/Sidebar";

export default function TagPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}/>

        </div>
    );
}
