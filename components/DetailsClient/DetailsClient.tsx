"use client";

import Image from "next/image";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  CalendarDays,
  Check,
  Fuel,
  MapPin,
  Settings2,
  Star,
  Truck,
} from "lucide-react";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/common/Button/Button";
import { createBooking, getCamper, getReviews } from "@/lib/api";
import styles from "./DetailsClient.module.css";

export function DetailsClient({ camperId }: { camperId: string }) {
  const [tab, setTab] = useState<"features" | "reviews">("features");
  const [toast, setToast] = useState("");

  const camperQuery = useQuery({
    queryKey: ["camper", camperId],
    queryFn: () => getCamper(camperId),
  });

  const reviewsQuery = useQuery({
    queryKey: ["reviews", camperId],
    queryFn: () => getReviews(camperId),
  });

  const booking = useMutation({
    mutationFn: (data: { name: string; email: string }) =>
      createBooking(camperId, data),

    onSuccess: (data) => {
      setToast(data.message || "Booking request sent successfully!");

      window.setTimeout(() => {
        setToast("");
      }, 5000);
    },
  });

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const data = new FormData(form);

    booking.mutate(
      {
        name: String(data.get("name")),
        email: String(data.get("email")),
      },
      {
        onSuccess: () => form.reset(),
      },
    );
  }

  if (camperQuery.isLoading) {
    return (
      <main className={styles.page}>
        <div className={styles.status}>Loading camper…</div>
      </main>
    );
  }

  if (camperQuery.isError || !camperQuery.data) {
    return (
      <main className={styles.page}>
        <div className={`${styles.status} ${styles.error}`}>
          Camper not found.
        </div>
      </main>
    );
  }

  const camper = camperQuery.data;

  const images = camper.gallery?.length
    ? camper.gallery
    : camper.coverImage
      ? [
          {
            id: "cover",
            original: camper.coverImage,
            thumb: camper.coverImage,
            order: 0,
          },
        ]
      : [];

  const amenities = Array.isArray(camper.amenities)
    ? camper.amenities
    : [camper.amenities];

  return (
    <main className={styles.page}>
      <h1>{camper.name}</h1>

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

      <p className={styles.price}>
        €
        {camper.price.toLocaleString("en-US", {
          maximumFractionDigits: 2,
        })}
      </p>

      <div className={styles.gallery}>
        {images.map((image) => (
          <button
            type="button"
            className={styles.galleryButton}
            key={image.id}
            aria-label={`Open ${camper.name} image`}
            onClick={() =>
              window.open(image.original, "_blank", "noopener,noreferrer")
            }
          >
            <Image
              src={image.original}
              alt={`${camper.name} gallery`}
              fill
              sizes="calc(33vw - 40px)"
            />
          </button>
        ))}
      </div>

      <p className={styles.description}>{camper.description}</p>

      <div className={styles.tabs}>
        <button
          type="button"
          className={`${styles.tab} ${
            tab === "features" ? styles.activeTab : ""
          }`}
          onClick={() => setTab("features")}
        >
          Features
        </button>

        <button
          type="button"
          className={`${styles.tab} ${
            tab === "reviews" ? styles.activeTab : ""
          }`}
          onClick={() => setTab("reviews")}
        >
          Reviews
        </button>
      </div>

      <div className={styles.columns}>
        <section className={styles.tabContent}>
          {tab === "features" ? (
            <>
              <div className={`${styles.badges} ${styles.featureBadges}`}>
                <span className={styles.badge}>
                  <Settings2 />
                  {camper.transmission}
                </span>

                <span className={styles.badge}>
                  <Fuel />
                  {camper.engine}
                </span>

                <span className={styles.badge}>
                  <Truck />
                  {camper.form.replaceAll("_", " ")}
                </span>

                {amenities.map((amenity) => (
                  <span className={styles.badge} key={amenity}>
                    <Check />
                    {amenity}
                  </span>
                ))}
              </div>

              <h2>Vehicle details</h2>

              <dl className={styles.detailsList}>
                <div>
                  <dt>Form</dt>
                  <dd>{camper.form.replaceAll("_", " ")}</dd>
                </div>

                <div>
                  <dt>Length</dt>
                  <dd>{camper.length}</dd>
                </div>

                <div>
                  <dt>Width</dt>
                  <dd>{camper.width}</dd>
                </div>

                <div>
                  <dt>Height</dt>
                  <dd>{camper.height}</dd>
                </div>

                <div>
                  <dt>Tank</dt>
                  <dd>{camper.tank}</dd>
                </div>

                <div>
                  <dt>Consumption</dt>
                  <dd>{camper.consumption}</dd>
                </div>
              </dl>
            </>
          ) : (
            <div className={styles.reviews}>
              {reviewsQuery.isLoading && <p>Loading reviews…</p>}

              {reviewsQuery.isError && (
                <p className={styles.error}>Could not load reviews.</p>
              )}

              {reviewsQuery.data?.map((review) => (
                <article key={review.id}>
                  <div className={styles.avatar}>{review.reviewer_name[0]}</div>

                  <div>
                    <h3>{review.reviewer_name}</h3>

                    <div
                      className={styles.stars}
                      aria-label={`${review.reviewer_rating} out of 5 stars`}
                    >
                      {[1, 2, 3, 4, 5].map((number) => (
                        <Star
                          key={number}
                          size={16}
                          fill={
                            number <= review.reviewer_rating
                              ? "currentColor"
                              : "none"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <p>{review.comment}</p>
                </article>
              ))}
            </div>
          )}
        </section>

        <form className={styles.booking} onSubmit={submit}>
          <h2>Book your campervan now</h2>
          <p>Stay connected! We are always ready to help you.</p>

          <input name="name" placeholder="Name*" required minLength={2} />

          <input name="email" type="email" placeholder="Email*" required />

          <div className={styles.dateField}>
            <CalendarDays />

            <input name="bookingDate" type="date" aria-label="Booking date" />
          </div>

          <textarea name="comment" placeholder="Comment" rows={4} />

          {booking.isError && (
            <p className={styles.formError}>
              Could not send booking. Please try again.
            </p>
          )}

          <Button
            type="submit"
            className={styles.submitButton}
            disabled={booking.isPending}
          >
            {booking.isPending ? "Sending…" : "Send"}
          </Button>
        </form>
      </div>

      {toast && (
        <div className={styles.toast} role="status">
          <Check />
          {toast}
        </div>
      )}
    </main>
  );
}
