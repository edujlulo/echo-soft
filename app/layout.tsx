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
      <body className="flex flex-col min-h-screen">
        {/* Main container that allows scrolling when the viewport is smaller */}
        <main className="flex-1 flex overflow-auto">
          {/* Wrapper that centers the content only if there is enough space */}
          <div className="m-auto">{children}</div>
        </main>
      </body>
    </html>
  );
}
