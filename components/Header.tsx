"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Header() {
  const pathname = usePathname();
  return (
    <header className="header">
      <div className="headerInner">
        <Link href="/" className="logo" aria-label="TravelTrucks home">
          Travel<span>Trucks</span>
        </Link>
        <nav aria-label="Main navigation">
          <Link className={pathname === "/" ? "active" : ""} href="/">
            Home
          </Link>
          <Link
            className={pathname.startsWith("/catalog") ? "active" : ""}
            href="/catalog"
          >
            Catalog
          </Link>
        </nav>
      </div>
    </header>
  );
}
