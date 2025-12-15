import type { Metadata } from "next";
import { Red_Hat_Display } from "next/font/google";
import { ClientProviders } from "@/components/ClientProviders";
import "./globals.css";

const redHatDisplay = Red_Hat_Display({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-red-hat-display",
});

export const metadata: Metadata = {
  title: "TLDR - What to watch? Made simple.",
  description: "Discover the top movies and shows across major streaming platforms. Curated, rated, and ready to watch.",
  keywords: ["streaming", "movies", "tv shows", "Netflix", "Prime Video", "OTT", "what to watch"],
  openGraph: {
    title: "TLDR - What to watch? Made simple.",
    description: "Discover the top movies and shows across major streaming platforms.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${redHatDisplay.variable} font-sans antialiased`}>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  );
}
