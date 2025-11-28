export const metadata = {
  title: "XPic",
  description: "Upload and view pictures online",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
