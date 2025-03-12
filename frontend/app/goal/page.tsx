"use client";

import { useState, useEffect } from "react";
import { useGoals } from "@/app/contexts/GoalContext";
import { Goal } from "../api/goal";
import { useAuth } from "@/app/contexts/AuthContext";

// components
import Layout from "@/components/ui/Layout";
import GoalList from "@/components/ui/GoalList";

export default function GoalsPage() {
    const { goals, getGoals } = useGoals();
    const { user } = useAuth();
    const [data, setData] = useState<Goal[]>([]);


    const getDataOnRender = async () => {
        try {
            const success = await getGoals(
                user?.id || (localStorage.getItem("userid") as string)
            );
            if (success) {
                setData(goals);
            }
        } catch (err) {
            if (err instanceof Error) {
                console.error(err.message);
            } else {
                console.error("Goals fetch failed!");
            }
        }
    };

    useEffect(() => {
        getDataOnRender();
    }, [user]);

    useEffect(() => {
        setData(goals);
    }, [goals]);


    return (
        <Layout title="Goals">
            <div className="flex items-center mb-6">
                <button className="bg-black text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-gray-800 ml-auto">
                    + Create Goal
                </button>
            </div>

            <GoalList goals={data} />
        </Layout>
    );
};
