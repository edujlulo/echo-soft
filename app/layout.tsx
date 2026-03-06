import "../styles/globals.css";
import { ReactNode } from "react";
import Navbar from "../components/Navbar";

export const metadata = {
  title: "EcoSoft",
  description: "Veterinary Ultrasound Management App",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 flex flex-col min-h-screen">
        {/* Contenido centrado verticalmente */}
        <main className="flex-1 flex justify-center items-center">
          {children}
        </main>
      </body>
    </html>
  );
}
