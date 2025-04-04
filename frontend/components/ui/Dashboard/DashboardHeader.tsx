interface DashboardHeaderProps {
    username?: string;
}

export default function DashboardHeader({ username }: DashboardHeaderProps) {
    return (
        <div className="flex justify-between items-center">
            <div>
                <span className="text-3xl font-semibold">
                    Hi, {username || "Guest"}! Welcome Back
                </span>
                <p className="text-sm text-gray-400">
                    Your next Bill of $103.58 is due on{" "}
                    <span className="text-red-400">April 3rd, 2024</span>
                </p>
            </div>
        </div>
    );
}
