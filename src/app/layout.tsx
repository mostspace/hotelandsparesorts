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
    {/* Google Tag Manager */}
    <script dangerouslySetInnerHTML={{__html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-M5JFHRM4');`}} />
    {/* End Google Tag Manager */}
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
    
      <body
        // className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        className="font-sans antialiased bg-[#f7f7f7] "
      >
        {/* Google Tag Manager (noscript) */}
        <noscript>
          <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-M5JFHRM4"
          height="0" width="0" style={{display:"none",visibility:"hidden"}}></iframe>
        </noscript>
        {/* End Google Tag Manager (noscript) */}
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
