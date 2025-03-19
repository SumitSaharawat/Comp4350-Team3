"use client";

import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { AuthInput } from "@/components/ui/Input";
import { AuthButton } from "@/components/ui/Button";

import Image from "next/image";
import Link from "next/link";

export default function SignupPage() {
    const { signup } = useAuth();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUserName] = useState("");
    const [balance, setBalance] = useState("");
    const [agreed, setAgreed] = useState(false);
    const [message, setMessage] = useState<{
        text: string;
        type: "error" | "success";
    } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!agreed) {
            setMessage({
                text: "You must agree to the Terms & Conditions.",
                type: "error",
            });
            return;
        }
        if (!username || !password || !confirmPassword || balance === null) {
            setMessage({ text: "All fields are required.", type: "error" });
            return;
        }

        if (password !== confirmPassword) {
            setMessage({ text: "Passwords do not match.", type: "error" });
            return;
        }

        if (Number(balance) < 0) {
            setMessage({
                text: "Start balance must be positive",
                type: "error",
            });
            return;
        }

        try {
            setLoading(true);
            const response = await signup(username, password, balance);
            setMessage({ text: response.message, type: "success" });
        } catch (err: unknown) {
            if (err instanceof Error) {
                setMessage({ text: err.message, type: "error" });
            } else {
                setMessage({ text: "Failed to sign up", type: "error" });
            }
        } finally {
            setLoading(false);
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
                        Create an account
                    </h1>

                    {/* Form */}
                    <div className="space-y-6 ">
                        <AuthInput
                            type="text"
                            placeholder="Name"
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                        <AuthInput
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <AuthInput
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                        <AuthInput
                            type="balance"
                            placeholder="Starting Balance"
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                        />
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-center text-black">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <label className="ml-2 text-sm">
                            I agree to the{" "}
                            <a href="/terms" className="hover:underline">
                                Terms & Conditions
                            </a>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <AuthButton onClick={handleSignup} loading={loading}>
                        Create account
                    </AuthButton>

                    {/* Already have an account */}
                    <p className="text-sm text-gray-500 text-center">
                        Already have an account?{" "}
                        <Link
                            href="/auth/login"
                            className="text-gray-900 hover:underline"
                        >
                            Log in
                        </Link>
                    </p>

                    {/* Message Block */}
                    {message && (
                        <p
                            className={`text-sm text-center ${
                                message.type === "error"
                                    ? "text-red-600"
                                    : "text-green-600"
                            }`}
                        >
                            {message.text}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
}
