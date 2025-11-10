import type { Metadata } from "next";
import "./globals.css";

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
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
