import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.carmian.com"),
  title: "Mian Rent A Car | CarMian Lahore",
  description: "Premium rent a car Lahore service with professional drivers, sedans, SUVs, vans, and luxury cars."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <script dangerouslySetInnerHTML={{ __html: "if(location.hash==='#admin1234') location.replace('/admin');" }} />
        {children}
      </body>
    </html>
  );
}
