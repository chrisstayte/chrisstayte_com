import type { Metadata } from "next";
import "./globals.css";

const siteUrl = new URL("https://chrisstayte.com");
const title = "Chris Stayte | Things I've Shipped";
const description =
  "A compact manifest of apps, sites, videos, and tools shipped by Chris Stayte.";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  applicationName: "Chris Stayte",
  title: {
    default: title,
    template: "%s | Chris Stayte",
  },
  description,
  alternates: {
    canonical: "/",
  },
  authors: [{ name: "Chris Stayte", url: siteUrl }],
  creator: "Chris Stayte",
  publisher: "Chris Stayte",
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Chris Stayte",
    title,
    description,
    images: [
      {
        url: "/manifest-texture.png",
        width: 1672,
        height: 941,
        alt: "Textured shipping manifest background for Chris Stayte's portfolio.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
    images: ["/manifest-texture.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
