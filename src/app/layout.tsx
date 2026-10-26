import type { Metadata } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "ZeroWaste AI 3D | Autonomous Grocery Perishable Management",
  description:
    "Photorealistic 3D grocery shelves, Bayesian perishable demand forecasting, autonomous multi-agent pricing, and circular food rescue operating system.",
  keywords: [
    "ZeroWaste AI",
    "3D Grocery Shelves",
    "WebGL",
    "Three.js",
    "Perishable Management",
    "Dynamic Markdown",
    "Agentic AI",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${jakarta.variable} ${jetbrainsMono.variable} dark antialiased`}>
      <body className="min-h-screen text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
        {children}
      </body>
    </html>
  );
}
