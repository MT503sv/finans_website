import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { ClerkProvider } from '@clerk/nextjs';
import { auth } from '@clerk/nextjs/server';
import NavbarWrapper from "@/components/NavbarWrapper";
import LoggedLayout from "@/components/loggedLayout"
import { headers } from "next/headers";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Finans - Financial Management",
  description: "Digital financial management solution tailored for MYPEs in El Salvador.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { userId } = await auth();
  const isLogged = !!userId;
  const headersList = await headers();
  const pathname = headersList.get("x-invoke-path") || headersList.get("x-pathname") || "";
  const isAuthPage = pathname.includes("/sign-in") || pathname.includes("/sign-up");

  return (
    <ClerkProvider afterSignOutUrl="/">
      <html
        lang="en"
        className={cn(
          "h-full antialiased",
          geistSans.variable,
          geistMono.variable,
          inter.variable,
          "font-sans"
        )}
      >
        <body className="min-h-full">
          {!isLogged ? (
            <div className="flex flex-col min-h-screen">
              {!isAuthPage && <NavbarWrapper userId={userId} />}
              <main className="flex-1">{children}</main>
            </div>
          ) : (
            <LoggedLayout>{children}</LoggedLayout>
          )}
        </body>
      </html>
    </ClerkProvider>
  );
}