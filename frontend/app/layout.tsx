import { AuthProvider } from "@/app/contexts/AuthContext";
import { TransactionsProvider } from "./contexts/TransactionsContext";
import { TagsProvider } from "@/app/contexts/TagContext";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TagsProvider>
            <TransactionsProvider>
                <AuthProvider>{children}</AuthProvider>
            </TransactionsProvider>
        </TagsProvider>
      </body>
    </html>
  );
}
