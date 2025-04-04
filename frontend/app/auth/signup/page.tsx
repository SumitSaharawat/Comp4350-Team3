"use client";

/**
 * Signup page
 *
 * The page user sees when they click sign up on login page
 */
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

        // all fields are required by the backend server
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
        <div className="relative w-screen h-screen bg-gradient-to-r from-gray-50 to-gray-400 flex items-center justify-center"
             style={{
                 backgroundImage: `linear-gradient(to right, black 30%, #21222d 100%)`,
             }}
        >
            {/* Floating Block */}
            <div className="rounded-lg shadow-xl w-full max-w-3xl grid grid-cols-2"
                 style={{
                     backgroundImage: `linear-gradient(to right, black 30%, #21222d 100%)`,
                 }}
            >
                {/* Left Panel: Image */}
                <div className="relative w-[400px] h-[450px] rounded-l-lg overflow-hidden flex items-center justify-center">
                    <Image
                        src="/signup_image.jpeg"
                        alt="Signup Illustration"
                        fill
                        className="object-contain"
                    />
                </div>

                {/* Right Panel: Form */}
                <div className="p-8 flex flex-col justify-center space-y-8">
                    <h1 className="text-4xl font-bold text-left">
                        Sign Up
                    </h1>

                    {/* Form */}
                    <div className="space-y-6 ">
                        <AuthInput
                            type="text"
                            placeholder="Name"
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                            className="focus:outline-none focus:border-customSkyBlue"
                        />
                        <AuthInput
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="focus:outline-none focus:border-customSkyBlue"
                        />
                        <AuthInput
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="focus:outline-none focus:border-customSkyBlue"
                        />
                        <AuthInput
                            type="balance"
                            placeholder="Starting Balance"
                            value={balance}
                            onChange={(e) => setBalance(e.target.value)}
                            className="focus:outline-none focus:border-customSkyBlue"
                        />
                    </div>

                    {/* Terms Checkbox */}
                    <div className="flex items-center">
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={(e) => setAgreed(e.target.checked)}
                            className="w-4 h-4 text-purple-600 border-gray-300 focus:ring-purple-500"
                        />
                        <label className="ml-2 text-sm">
                            I agree to the{" "}
                            <a href="" className="hover:underline">
                                Terms & Conditions
                            </a>
                        </label>
                    </div>

                    {/* Submit Button */}
                    <AuthButton onClick={handleSignup} loading={loading}>
                        Create Account
                    </AuthButton>

                    {/* Already have an account */}
                    <p className="text-sm text-gray-500 text-center">
                        Already have an account?{" "}
                        <Link
                            href="/auth/login"
                            className="text-green-600 hover:underline"
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
