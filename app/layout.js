import "./globals.css";
import Header from "@/components/Header";

export const metadata = {
  title: "XPic",
  description: "Photo sharing app for everyone",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-gray-100">
        <Header />
        <main className="mt-4">{children}</main>
      </body>
    </html>
  );
}
