"use client";

/**
 * Reset password page
 *
 * Allows the user to reset the password, no secondary authentication needed
 */
import { useState } from "react";
import { useAuth } from "@/app/contexts/AuthContext";
import { AuthInput } from "@/components/ui/Input";
import { AuthButton } from "@/components/ui/Button";
import Image from "next/image";
import Link from "next/link";

export default function ResetPasswordPage() {
    const { resetPassword } = useAuth();
    const [username, setUserName] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState<{
        text: string;
        type: "error" | "success";
    } | null>(null);
    const [loading, setLoading] = useState(false);

    const handleResetPassword = async () => {
        setMessage(null);

        if (!username || !password || !confirmPassword) {
            setMessage({ text: "All fields are required.", type: "error" });
            return;
        }

        if (password !== confirmPassword) {
            setMessage({ text: "Passwords do not match.", type: "error" });
            return;
        }

        try {
            setLoading(true);
            const response = await resetPassword(username, password);
            setMessage({ text: response.message, type: "success" });
        } catch (err: unknown) {
            if (err instanceof Error) {
                setMessage({ text: err.message, type: "error" });
            } else {
                setMessage({
                    text: "Failed to reset new password.",
                    type: "error",
                });
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
                <div className="p-8 flex flex-col justify-center space-y-6">
                    <h1 className="text-4xl font-bold text-black text-left">
                        Reset Password
                    </h1>

                    {/* Form */}
                    <div className="space-y-4 text-black">
                        <AuthInput
                            type="text"
                            placeholder="Name"
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                        />
                        <AuthInput
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <AuthInput
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    {/* Submit Button */}
                    <AuthButton onClick={handleResetPassword} loading={loading}>
                        Submit
                    </AuthButton>

                    {/* Already have an account */}
                    <p className="text-sm text-gray-500 text-center">
                        Go to login?{" "}
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
