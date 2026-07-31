import type { Metadata } from "next";
import "./globals.css";
import "./workspace.css";
import "./auth.css";
import "./interactions.css";
import { AuthProvider } from "@/providers/auth-provider";

export const metadata: Metadata = {
  title: "PravoHelper Office — юридична CRM",
  description: "Робочий простір для юридичної практики",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="uk"><body><AuthProvider>{children}</AuthProvider></body></html>;
}
