import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "CGS ORIS Field Service Academy | Learn Systems, Diagnose Faults, Master Workflow",
  description:
    "Full-stack interactive technical training and interview preparation platform for CGS ORIS Americas Field Service Technicians. Industrial printing, METIS scanning, ORIS color management, safety, and diagnostics.",
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
