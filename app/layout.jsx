import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import StoreProvider from "@/app/StoreProvider";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
    title: "Binary computers",
    description: "Binary computers",
    verification: {
        google: "hPWEykL9cMQH-NSdr9xB2W-OXVfaKjj3ge29c6YbSkg",
    },
};

export default function RootLayout({ children }) {
    return (
        <ClerkProvider>
            <html lang="en">
                <head>
                    <meta name="google-site-verification" content="hPWEykL9cMQH-NSdr9xB2W-OXVfaKjj3ge29c6YbSkg" />
                </head>
                <body className={`${outfit.className} antialiased`}>
                    <StoreProvider>
                        <Toaster />
                        {children}
                    </StoreProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
