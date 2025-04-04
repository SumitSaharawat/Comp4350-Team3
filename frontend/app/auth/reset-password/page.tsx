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
        <div className="relative w-screen h-screen flex items-center justify-center"
             style={{
                 backgroundImage: `linear-gradient(to right, black 20%, #21222d 100%)`,
             }}
        >
            {/* Floating Block */}
            <div className="rounded-lg shadow-xl w-full max-w-3xl grid grid-cols-2"
             style={{
                 backgroundImage: `linear-gradient(to right, black 25%, #21222d 100%)`,
             }}
            >
                {/* Left Panel: Image */}
                <div
                    className="relative w-[300px] h-[450px] rounded-l-lg overflow-hidden flex items-center justify-center bg-gray-100">
                    <Image
                        src="/reset_password_image.jpg"
                        alt="Signup Illustration"
                        fill
                        className="object-cover"
                    />
                </div>

                {/* Right Panel: Form */}
                <div className="p-8 flex flex-col justify-center space-y-6">
                    <h1 className="text-4xl font-bold text-foreground text-left">
                        Reset Password
                    </h1>

                    {/* Form */}
                    <div className="space-y-4">
                        <AuthInput
                            type="text"
                            placeholder="Name"
                            value={username}
                            onChange={(e) => setUserName(e.target.value)}
                            className="focus:outline-none focus:border-customSkyBlue"
                        />
                        <AuthInput
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="focus:outline-none focus:border-customSkyBlue"
                        />
                        <AuthInput
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="focus:outline-none focus:border-customSkyBlue"
                        />
                    </div>

                    {/* Submit Button */}
                    <AuthButton onClick={handleResetPassword} loading={loading}>
                        Submit
                    </AuthButton>

                    {/* Already have an account */}
                    <p className="text-sm text-gray-400 text-center">
                        Go to login?{" "}
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
