import Image from "next/image";
import { Fuel, MapPin, Settings2, Star, Truck } from "lucide-react";
import type { ReactNode } from "react";
import type { Camper } from "@/lib/types";
import styles from "./CamperCard.module.css";

const titleCase = (value: string) =>
  value.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());

export function CamperCard({ camper }: { camper: Camper }) {
  return (
    <article className={styles.card}>
      <div className={styles.image}>
        <Image
          src={camper.coverImage || camper.gallery?.[0]?.original || ""}
          alt={camper.name}
          fill
          sizes="219px"
        />
      </div>

      <div className={styles.body}>
        <div className={styles.heading}>
          <h2>{camper.name}</h2>
          <strong>
            €
            {camper.price.toLocaleString("en-US", {
              maximumFractionDigits: 2,
            })}
          </strong>
        </div>

        <div className={styles.meta}>
          <span className={styles.rating}>
            <Star size={16} fill="currentColor" />
            {camper.rating} ({camper.totalReviews} Reviews)
          </span>
          <span>
            <MapPin size={16} />
            {camper.location}
          </span>
        </div>

        <p className={styles.description}>{camper.description}</p>

        <div className={styles.badges}>
          <Badge icon={<Fuel />} text={titleCase(camper.engine)} />
          <Badge icon={<Settings2 />} text={titleCase(camper.transmission)} />
          <Badge icon={<Truck />} text={titleCase(camper.form)} />
        </div>

        <a
          className={styles.showMore}
          href={`/catalog/${camper.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Show more
        </a>
      </div>
    </article>
  );
}

function Badge({ icon, text }: { icon?: ReactNode; text: string }) {
  return (
    <span className={styles.badge}>
      {icon}
      {text}
    </span>
  );
}
