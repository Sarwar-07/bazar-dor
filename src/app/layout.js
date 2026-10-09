import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/Navbar";
import PriceTicker from "@/components/PriceTicker";
import Footer from "@/components/Footer";

export const metadata = {
  title: "বাজার দর — BazarDor",
  description: "নিত্যপ্রয়োজনীয় পণ্যের বাজার দর পর্যবেক্ষণ ও তুলনা",
};

export default function RootLayout({ children }) {
  return (
    <html lang="bn">
      <body className="min-h-screen flex flex-col bg-[#fbfbfa] text-gray-900 antialiased">
        <Toaster position="top-right" />
        <Navbar />
        <PriceTicker />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}