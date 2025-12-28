import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ShareDataProvider } from "@/context/ShareDataContext";
import { NotificationProvider } from "@/context/NotificationContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

/* =========================
   GLOBAL SEO METADATA
========================= */
export const metadata: Metadata = {
  title: {
    default: "DAWA | Doctor Appointment Management System",
    template: "%s | DAWA",
  },
  description:
    "DAWA is an internal clinic management system for handling doctor appointments, patients, reception workflow, and administrative operations.",
  applicationName: "DAWA",
  keywords: [
    "DAWA",
    "Doctor Appointment System",
    "Clinic Management",
    "Hospital Admin Dashboard",
    "Medical Appointment Software",
    "Healthcare Management System",
  ],
  authors: [{ name: "DAWA Team" }],
  creator: "DAWA",
  publisher: "DAWA",

  robots: {
    index: false, // internal system
    follow: false,
  },

  openGraph: {
    title: "DAWA | Doctor Appointment Management System",
    description:
      "Internal clinic management platform for doctors, receptionists, and administrators.",
    siteName: "DAWA",
    type: "website",
    locale: "en_IN",
  },

  twitter: {
    card: "summary_large_image",
    title: "DAWA | Clinic Management System",
    description:
      "Manage doctors, patients, appointments, and clinic workflow using DAWA.",
  },

  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`
          ${geistSans.variable}
          ${geistMono.variable}
          antialiased
          bg-slate-100
          text-gray-900
        `}
      >
        <AuthProvider>
          <ShareDataProvider><NotificationProvider>{children}</NotificationProvider></ShareDataProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
