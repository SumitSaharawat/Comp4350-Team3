import { AuthProvider } from "@/app/contexts/AuthContext";
import { TransactionsProvider } from "./contexts/TransactionsContext";
import { TagsProvider } from "@/app/contexts/TagContext";
import { GoalsProvider } from "@/app/contexts/GoalContext";
import { RemindersProvider } from "./contexts/ReminderContext";
import "./globals.css";

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body>
                <RemindersProvider>
                    <GoalsProvider>
                        <TagsProvider>
                            <TransactionsProvider>
                                <AuthProvider>{children}</AuthProvider>
                            </TransactionsProvider>
                        </TagsProvider>
                    </GoalsProvider>
                </RemindersProvider>
            </body>
        </html>
    );
}
