import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ToastContainer } from "../components/ui/Toast";
import { AuthProvider } from "../contexts/AuthContext";
import { NutritionProvider } from "../contexts/NutritionContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "YAZIO Food Intake Viewer",
  description: "View your YAZIO nutrition data with beautiful charts and insights",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* Background gradient for glassmorphism effect */}
        <div
          className="fixed inset-0 -z-10"
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 25%, #f093fb 50%, #4facfe 75%, #00f2fe 100%)',
            backgroundSize: '400% 400%',
            animation: 'gradient 15s ease infinite',
          }}
        />
        <ToastContainer />
        <AuthProvider>
          <NutritionProvider>
            {children}
          </NutritionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
