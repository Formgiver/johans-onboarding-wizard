import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Onboarding Wizard",
  description: "Professional onboarding and wizard management system",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-white scheme-light">
      <head>
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
