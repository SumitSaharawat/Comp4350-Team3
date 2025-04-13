/**
 * Dashboard Header
 *
 * Displays a greeting with the user's name and a reminder about the next bill.
 */

interface DashboardHeaderProps {
    username?: string; // Optional user name to personalize the greeting
}

export default function DashboardHeader({ username }: DashboardHeaderProps) {
    return (
        <div className="flex justify-between items-center">
            {/* Greeting Section */}
            <div>
                {/* Personalized or default greeting */}
                <span className="text-3xl font-semibold">
                    Hi, {username || "Guest"}! Welcome Back
                </span>

                {/* Bill reminder message */}
                <p className="text-sm text-gray-400">
                    Your next Bill of $103.58 is due on{" "}
                    <span className="text-red-400">April 3rd, 2024</span>
                </p>
            </div>
        </div>
    );
}
