import type { Metadata } from "next";
import "./globals.css";
import Nav from "@/components/base/nav";
import Footer from "@/components/base/footer";

export const metadata: Metadata = {
  title: "Songs for the Road",
  description: "Sonical travel diary",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="flex flex-col h-screen">
        <Nav />
        <main className="flex-grow flex flex-col -mt-4 -mb-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
