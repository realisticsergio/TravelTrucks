import Image from "next/image";
import {
  Fuel,
  Heart,
  MapPin,
  Settings2,
  Star,
  Truck,
  Wind,
} from "lucide-react";
import type { Camper } from "@/lib/types";

const titleCase = (value: string) =>
  value.replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());

export function CamperCard({ camper }: { camper: Camper }) {
  const amenities = Array.isArray(camper.amenities)
    ? camper.amenities
    : [camper.amenities];
  return (
    <article className="camperCard">
      <div className="cardImage">
        <Image
          src={camper.coverImage || camper.gallery?.[0]?.original || ""}
          alt={camper.name}
          fill
          sizes="292px"
        />
      </div>
      <div className="cardBody">
        <div className="cardHeading">
          <h2>{camper.name}</h2>
          <div>
            <strong>€{camper.price.toFixed(2)}</strong>
            <Heart aria-label="Add to favorites" />
          </div>
        </div>
        <div className="meta">
          <span className="rating">
            <Star size={16} fill="currentColor" />
            {camper.rating} ({camper.totalReviews} Reviews)
          </span>
          <span>
            <MapPin size={16} />
            {camper.location}
          </span>
        </div>
        <p className="description">{camper.description}</p>
        <div className="badges">
          <Badge icon={<Settings2 />} text={titleCase(camper.transmission)} />
          <Badge icon={<Fuel />} text={titleCase(camper.engine)} />
          <Badge icon={<Truck />} text={titleCase(camper.form)} />
          {amenities.slice(0, 3).map((a) => (
            <Badge
              key={a}
              icon={a === "ac" ? <Wind /> : undefined}
              text={titleCase(a)}
            />
          ))}
        </div>
        <a
          className="primaryButton showMore"
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

function Badge({ icon, text }: { icon?: React.ReactNode; text: string }) {
  return (
    <span className="badge">
      {icon}
      {text}
    </span>
  );
}
