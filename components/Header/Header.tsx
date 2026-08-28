"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import ThemeToggle from "@/components/common/ThemeToggle/ThemeToggle";
import styles from "./Header.module.css";

export function Header() {
  const pathname = usePathname();

  const homeClassName = [styles.link, pathname === "/" ? styles.active : ""]
    .filter(Boolean)
    .join(" ");

  const catalogClassName = [
    styles.link,
    pathname.startsWith("/catalog") ? styles.active : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo} aria-label="TravelTrucks home">
          Travel<span className={styles.logoAccent}>Trucks</span>
        </Link>

        <nav className={styles.navigation} aria-label="Main navigation">
          <Link className={homeClassName} href="/">
            Home
          </Link>

          <Link className={catalogClassName} href="/catalog">
            Catalog
          </Link>
        </nav>

        <ThemeToggle />
      </div>
    </header>
  );
}
