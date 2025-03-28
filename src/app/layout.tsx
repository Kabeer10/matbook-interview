import "~/styles/globals.css";

import { type Metadata } from "next";
import { Poppins, Zen_Kaku_Gothic_Antique } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { Toaster } from "~/components/ui/sonner";

export const metadata: Metadata = {
  title: "MatBook Interview App",
  description: "MatBook Interview App",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

const zen = Zen_Kaku_Gothic_Antique({
  variable: "--font-zen",
  weight: ["300", "400", "500", "700", "900"],
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${poppins.variable} ${zen.variable}`}>
      <body>
        <TRPCReactProvider>{children}</TRPCReactProvider>
        <Toaster richColors position="top-center" />
      </body>
    </html>
  );
}
