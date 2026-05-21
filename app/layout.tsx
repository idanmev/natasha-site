import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Наталья Сиголович — консультант по детско-родительским отношениям",
  description:
    "Консультации по детско-родительским отношениям в подходе эмоционального интеллекта.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className="h-full">
      <body className="min-h-full">{children}</body>
    </html>
  );
}
