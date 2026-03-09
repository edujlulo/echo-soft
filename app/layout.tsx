import "../styles/globals.css";
import { ReactNode } from "react";

export const metadata = {
  title: "EcoSoft",
  // description: "Veterinary Ultrasound Management App",
  description: "Aplicación Web de Gestión de Ecografías Veterinarias",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="flex flex-col min-h-screen">
        {/* Main container that allows scrolling when the viewport is smaller */}
        <main className="flex-1 flex justify-center items-center">
          {/* Wrapper that centers the content only if there is enough space */}
          <div>{children}</div>
        </main>
      </body>
    </html>
  );
}
