import type { Metadata, Viewport } from "next";
import "./globals.css";
import "./stability.css";
import SidebarLayout from "@/components/SidebarLayout";
import RaymondI18nProvider from "@/components/raymond-i18n/RaymondI18nProvider";

export const metadata: Metadata = {
  title: { default: "Raymond Membership & Points", template: "%s | Raymond" },
  description: "Raymond multilingual membership, points, redemption and operations demo.",
  applicationName: "Raymond Membership",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0a0e27",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full">
        <RaymondI18nProvider>
          <SidebarLayout>{children}</SidebarLayout>
        </RaymondI18nProvider>
      </body>
    </html>
  );
}
