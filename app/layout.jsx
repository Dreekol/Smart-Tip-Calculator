import "./globals.css";

export const metadata = {
  title: "Smart Tip Calculator",
  description: "A simple tip calculator built with Next.js and Tailwind CSS.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
