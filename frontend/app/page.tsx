"use client";

import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
// @ts-ignore
import Image from "next/image";

export default function LoginPage() {
    const {login} = useAuth();
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async () => {
        try {
            const response = await login(username, password);
            setMessage(response.message);

        } catch (err: unknown) {
            if (err instanceof Error) {
                setMessage(err.message);
            } else {
                setMessage("Failed to log in");
            }
        }
    };

    return (
        <div className="relative w-screen h-screen bg-gradient-to-r from-gray-50 to-gray-400 flex items-center justify-center">
            {/* Floating Block */}
            <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl grid grid-cols-2">
                {/* Left Panel: Image */}
                <div className="rounded-l-lg overflow-hidden flex items-center justify-center bg-gray-100">
                    <Image
                        src="/Signup.png"
                        alt="login Illustration"
                        className="object-contain"
                        width={350}
                        height={350}
                    />
                </div>

                {/* Right Panel: Form */}
                <div className="p-8 flex flex-col justify-center space-y-8">
                    <h1 className="text-4xl font-bold text-black text-left">
                        Log in
                    </h1>

                    {/* Form */}
                    <div className="space-y-6 text-black">
                        <input
                            type="text"
                            placeholder="Name"
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full px-4 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-purple-500"
                        />
                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    {message && <p className="text-customDarkRed mt-4 ">{message}</p>}

                    {/* Submit Button */}
                    <button
                        onClick={handleLogin}
                        className="w-full bg-customMirage hover:bg-gray-700 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
                    >
                        Log In
                    </button>

                    {/* Already have an account */}
                    <p className="text-sm text-gray-500 text-center">
                        {"Don't have account? "}
                        <a href="/signup" className="text-gray-900 hover:underline">
                            Sign Up
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}
