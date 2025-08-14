export const metadata = {
  title: "AI Tools Hub",
  description: "Discover and track the latest AI tools",
};

import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
