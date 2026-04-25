import "../styles/globals.css";
import { ReactNode } from "react";
import { UltrasoundUploadManagerProvider } from "@/components/providers/UltrasoundUploadManagerProvider";
import GlobalUltrasoundUploadOverlay from "@/components/uploads/GlobalUltrasoundUploadOverlay";
import AppScaleWrapper from "@/components/AppScaleWrapper";

export const metadata = {
  title: "EcoSoft",
  // description: "Veterinary Ultrasound Management App",
  description: "Aplicación Web de Gestión de Ecografías Veterinarias",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es">
      <body className="flex flex-col min-h-screen">
        <UltrasoundUploadManagerProvider>
          <AppScaleWrapper>
            {children}
            <GlobalUltrasoundUploadOverlay />
          </AppScaleWrapper>
        </UltrasoundUploadManagerProvider>
      </body>
    </html>
  );
}
