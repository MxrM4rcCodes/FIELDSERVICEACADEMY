import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Field Service Academy | Independent Technical Learning & Interview Practice",
  description:
    "Independent database-backed learning and interview practice for industrial printing, imaging, color workflows, safe diagnostic reasoning, and customer service. Not affiliated with or endorsed by CGS ORIS, METIS, or Platinum Technologies.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0B1320] text-slate-100 min-h-screen flex flex-col font-sans antialiased selection:bg-teal-500/30 selection:text-teal-200">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
