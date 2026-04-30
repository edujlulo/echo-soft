import { ReactNode } from "react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { UltrasoundUploadManagerProvider } from "@/components/providers/UltrasoundUploadManagerProvider";
import GlobalUltrasoundUploadOverlay from "@/components/uploads/GlobalUltrasoundUploadOverlay";
import AppScaleWrapper from "@/components/AppScaleWrapper";
import LanguageSwitcher from "@/components/LanguageSwitcher";

type LocaleLayoutProps = {
  children: ReactNode;
  params: Promise<{
    locale: string;
  }>;
};

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className="flex min-h-screen flex-col">
        <NextIntlClientProvider messages={messages}>
          <UltrasoundUploadManagerProvider>
            {/* Language buttons top-right */}
            <LanguageSwitcher />

            <AppScaleWrapper>
              {children}
              <GlobalUltrasoundUploadOverlay />
            </AppScaleWrapper>
          </UltrasoundUploadManagerProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

// import "../styles/globals.css";
// import { ReactNode } from "react";
// import { UltrasoundUploadManagerProvider } from "@/components/providers/UltrasoundUploadManagerProvider";
// import GlobalUltrasoundUploadOverlay from "@/components/uploads/GlobalUltrasoundUploadOverlay";
// import AppScaleWrapper from "@/components/AppScaleWrapper";

// export const metadata = {
//   title: "EcoSoft",
//   // description: "Veterinary Ultrasound Management App",
//   description: "Aplicación Web de Gestión de Ecografías Veterinarias",
// };

// export default function RootLayout({ children }: { children: ReactNode }) {
//   return (
//     <html lang="es">
//       <body className="flex flex-col min-h-screen">
//         <UltrasoundUploadManagerProvider>
//           <AppScaleWrapper>
//             {children}
//             <GlobalUltrasoundUploadOverlay />
//           </AppScaleWrapper>
//         </UltrasoundUploadManagerProvider>
//       </body>
//     </html>
//   );
// }
