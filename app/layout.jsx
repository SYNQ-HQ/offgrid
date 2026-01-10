import "./globals.css";
import MainLayout from "@/components/layout/MainLayout";
import Providers from "@/components/providers";

export const metadata = {
  title: "Off-Grid",
  description: "Disconnect to Reconnect",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-black text-[#F5EDE4]">
        <Providers>
          <MainLayout>{children}</MainLayout>
        </Providers>
      </body>
    </html>
  );
}