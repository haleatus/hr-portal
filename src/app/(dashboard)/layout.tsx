import type React from "react";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="md:pl-[16rem]">{children}</div>;
}
