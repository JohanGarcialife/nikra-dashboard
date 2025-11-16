import { Montserrat } from "next/font/google";
import "../globals.css";
import { Toaster } from "sonner";
import { HeroUIProvider } from "@heroui/system";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
});

export const metadata = {
   title: "CCA Ceuta App - Dashboard",
  description: "CCA Ceuta App dashboard para comercios asociados",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${montserrat.variable} antialiased`}
      >
        <HeroUIProvider>
          <Toaster richColors position="top"/>
          <div
            className={
              // mobile-first: full-width, no radius, no shadow
              // desktop (lg): constrained max-width, rounded, shadow
              "bg-white min-h-screen"
            }
          >
            {children}
          </div>
        </HeroUIProvider>
      </body>
    </html>
  );
}