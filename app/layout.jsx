import { Outfit } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import StoreProvider from "@/app/StoreProvider";
import { CustomizeProvider } from "@/components/CustomizeProvider";
import "./globals.css";

const outfit = Outfit({ subsets: ["latin"], weight: ["400", "500", "600"] });

export const metadata = {
    title: "Binary Computers | Best Shop for Laptops, Phones, Cameras & All Electronics Online",
    description: "Welcome to Binary Computers. Your ultimate destination for buying top-tier computers, desktops, mobile phones, smartwatches, cameras, and all electronic equipment. We also offer expert online laptop services, hardware repairs, and technical support. Rank first in any search for computers and laptops.",
    keywords: [
        "Binary Computers",
        "computers",
        "laptops",
        "desktops",
        "mobile phones",
        "smartwatches",
        "electronic equipment",
        "cameras",
        "online laptop services",
        "computer repair",
        "laptop repair",
        "electronics store online",
        "buy tech gear",
        "pc builder",
        "shop technology",
        "phone",
        "every phone",
        "any online laptop services",
        "watches",
        "electronic every equipments",
        "any search computers and laptops",
        "best electronics online",
        "top computers"
    ],
    verification: {
        google: "hPWEykL9cMQH-NSdr9xB2W-OXVfaKjj3ge29c6YbSkg",
    },
    openGraph: {
        title: "Binary Computers | Best Shop for Laptops, Phones, Cameras & All Electronics Online",
        description: "Welcome to Binary Computers. Your ultimate destination for buying top-tier computers, desktops, mobile phones, smartwatches, cameras, and all electronic equipment.",
        url: "https://binarycomputers.shop",
        siteName: "Binary Computers",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "Binary Computers | Laptops, Phones, Electronics & Services",
        description: "Your ultimate destination for computers, desktops, mobile phones, smartwatches, cameras, and expert online laptop services.",
    }
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
                        <CustomizeProvider>
                            <Toaster />
                            {children}
                        </CustomizeProvider>
                    </StoreProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
