import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Suspense } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HOTEL & SPA RESORTS - BOOKING",
  description: "Book a stay at luxury locations all around the global",
};


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="desktop-zoom"
  
    // style={{
    //   // zoom: 0.7,
    //   transformOrigin: "top left",
    //   transform: "scale(0.7)",
    //   width: "142.857%", // compensate for scaling so layout space stays correct
    //   overflowX:'hidden'
    // }}
  >
    <head>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
    
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        className="font-sans antialiased bg-[#f7f7f7] "
      >
        <div className="app-wrapper">
          <Header />

          <Suspense fallback={<div>Loading...</div>}>
            {children}
          </Suspense>
        </div>
        
        <Footer />
      </body>
    </html>
  );
}
