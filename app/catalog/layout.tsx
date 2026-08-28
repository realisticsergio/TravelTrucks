import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Camper Catalog | TravelTrucks",
  description:
    "Browse and filter available campers by location, body type, engine and transmission.",
};

export default function CatalogLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
