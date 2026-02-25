import "./globals.css";
import { Inter, Playfair_Display } from "next/font/google";

export const metadata = {
  title: "Smile Guru",
  description: "Premium dental care and appointments in Surat.",
  icons: {
    icon: "/images/logo.png",
  },
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${playfair.variable} font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
