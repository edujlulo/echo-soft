import type { ReactNode } from "react";
import "@/styles/globals.css";

export const metadata = {
  title: "EcoSoft",
  description: "Aplicación Web de Gestión de Ecografías Veterinarias",
};

// export const metadata = {
//   title: "EcoSoft",
//   description: "Veterinary ultrasound management web app",
// };

export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
