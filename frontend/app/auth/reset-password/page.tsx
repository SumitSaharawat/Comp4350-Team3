"use client";

import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
// @ts-ignore
import Image from "next/image";
// @ts-ignore
import Link from "next/link";

export default function ResetPasswordPage() {
    const {resetPassword} = useAuth();
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleResetPassword = async () => {
        try {
            const response = await resetPassword(username, password);
            setMessage(response.message);

        } catch (err: unknown) {
            if (err instanceof Error) {
                setMessage(err.message);
            } else {
                setMessage("Failed to reset new password");
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
                        alt="Signup Illustration"
                        className="object-contain"
                        width={350}
                        height={350}
                    />
                </div>

                {/* Right Panel: Form */}
                <div className="p-8 flex flex-col justify-center space-y-8">
                    <h1 className="text-4xl font-bold text-black text-left">
                        Reset Password
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
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-purple-500"
                        />
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-purple-500"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleResetPassword}
                        className="w-full bg-customMirage hover:bg-gray-700 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring focus:ring-purple-300"
                    >
                        Submit
                    </button>

                    {/* Go back to Sign up / log in Page */}
                    <p className="text-sm text-gray-500 text-center flex justify-between">
                        <Link href="/auth/login" className="text-gray-900 hover:underline">
                            Log in
                        </Link>
                        <Link href="/auth/signup" className="text-gray-900 hover:underline">
                            Sign up
                        </Link>
                    </p>

                    {/* Warning message block */}
                    <div className="space-y-0">
                        <p className="text-customDarkRed mb-0">{message}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
