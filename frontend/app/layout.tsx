import { AuthProvider } from "@/app/contexts/AuthContext";
import { TransactionsProvider } from "./contexts/TransactionsContext";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <TransactionsProvider>
          <AuthProvider>{children}</AuthProvider>
        </TransactionsProvider>
      </body>
    </html>
  );
}
