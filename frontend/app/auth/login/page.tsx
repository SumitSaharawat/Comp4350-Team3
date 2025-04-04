"use client";

/**
 * Login page
 * The page that user would see when first enter the website
 */
import { useState } from "react";
import { AuthInput } from "@/components/ui/Input";
import { AuthButton } from "@/components/ui/Button";
import { useAuth } from "@/app/contexts/AuthContext";

import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
    const { login } = useAuth();
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState<{
        text: string;
        type: "error" | "success";
    } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!username || !password) {
            setMessage({ text: "All fields are required.", type: "error" });
            return;
        }

        // call the login function from auth context, if error occurs display the error
        try {
            setLoading(true);
            const response = await login(username, password);
            setMessage({ text: response.message, type: "success" });
        } catch (err: unknown) {
            if (err instanceof Error) {
                setMessage({ text: err.message, type: "error" });
            } else {
                setMessage({ text: "Failed to login", type: "error" });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative w-screen h-screen flex items-center justify-center"
             style={{
                 backgroundImage: `linear-gradient(to right, black 30%, #21222d 100%)`,
             }}
        >
            {/* Floating Block */}
            <div
                className="rounded-lg shadow-xl w-full max-w-3xl grid grid-cols-2"
                style={{
                    backgroundImage: `linear-gradient(to right, black 40%, #21222d 100%)`,
                }}
            >
                {/* Left Panel: Image */}
                <div
                    className="relative w-[390px] h-[400px] rounded-l-lg overflow-hidden flex items-center justify-center">
                    <Image
                        src="/black_sky.jpg"
                        alt="login Illustration"
                        fill
                        className="object-contain"
                    />
                </div>

                {/* Right Panel: Form */}
                <div className="p-8 flex flex-col justify-center space-y-8">
                    <h1 className="text-4xl font-bold text-foreground text-left">
                        Log In
                    </h1>

                    {/* Form */}
                    <div className="space-y-6">
                        <AuthInput
                            type="text"
                            placeholder="Name"
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full px-4 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-customSkyBlue"
                        />
                        <AuthInput
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border-b border-gray-300 bg-transparent focus:outline-none focus:border-customSkyBlue"
                        />
                    </div>

                    {/* Submit Button */}
                    <AuthButton onClick={handleLogin} loading={loading}>
                        Log In
                    </AuthButton>

                    <div className="relative space-y-5">
                        <p className="text-sm text-gray-500 text-center">
                            {"Don't have an account? "}
                            <Link
                                href="/auth/signup"
                                className="text-yellow-700 hover:underline"
                            >
                                Sign Up
                            </Link>
                        </p>

                        {/* Forgot Password */}
                        <p className="text-sm text-gray-500 text-center">
                            <Link
                                href="/auth/reset-password"
                                className=" hover:underline"
                            >
                                Forgot password?
                            </Link>
                        </p>
                    </div>

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
