"use client";

import Image from "next/image";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Check,
  CircleAlert,
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
  const [toast, setToast] = useState("");
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
  });

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

    const name = String(data.get("name")).trim();
    const email = String(data.get("email")).trim();

    const isValidName = name.length >= 2 && /^[\p{L}\s'-]+$/u.test(name);

    const errors = {
      name: isValidName ? "" : "Please enter your name.",
      email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? ""
        : "Please enter your email.",
    };

    setFormErrors(errors);

    if (errors.name || errors.email) {
      return;
    }

    booking.mutate(
      { name, email },
      {
        onSuccess: () => {
          form.reset();
          setFormErrors({ name: "", email: "" });
        },
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

  const activeImage = images[activeImageIndex] ?? images[0];

  const amenities = Array.isArray(camper.amenities)
    ? camper.amenities
    : [camper.amenities];

  return (
    <main className={styles.page}>
      <div className={styles.topSection}>
        <div className={styles.galleryColumn}>
          <div className={styles.gallery}>
            {activeImage && (
              <div className={styles.mainImage}>
                <Image
                  src={activeImage.original}
                  alt={`${camper.name} — image ${activeImageIndex + 1}`}
                  fill
                  priority
                  sizes="632px"
                />
              </div>
            )}

            {images.length > 1 && (
              <div className={styles.thumbnails}>
                {images.map((image, index) => (
                  <button
                    type="button"
                    key={image.id}
                    className={`${styles.thumbnail} ${
                      index === activeImageIndex ? styles.activeThumbnail : ""
                    }`}
                    aria-label={`Show image ${index + 1}`}
                    aria-pressed={index === activeImageIndex}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <Image
                      src={image.thumb || image.original}
                      alt=""
                      fill
                      sizes="136px"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className={styles.infoColumn}>
          <section className={styles.camperInfo}>
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

            <p className={styles.description}>{camper.description}</p>
          </section>
          <section className={styles.vehicleDetails}>
            <h2>Vehicle details</h2>

            <div className={styles.badges}>
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
          </section>
        </div>
      </div>

      <div className={styles.columns}>
        <section className={styles.reviewsColumn}>
          <h2>Reviews</h2>

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
        </section>
        <form className={styles.booking} onSubmit={submit} noValidate>
          <h2>Book your campervan now</h2>
          <p>Stay connected! We are always ready to help you.</p>

          <div className={styles.formField}>
            <input
              id="booking-name"
              className={formErrors.name ? styles.invalidField : ""}
              name="name"
              placeholder="Name*"
              aria-invalid={Boolean(formErrors.name)}
              aria-describedby={formErrors.name ? "name-error" : undefined}
              onChange={() =>
                setFormErrors((current) => ({
                  ...current,
                  name: "",
                }))
              }
            />

            {formErrors.name && (
              <>
                <label htmlFor="booking-name" className={styles.errorLabel}>
                  Name*
                </label>

                <CircleAlert className={styles.errorIcon} aria-hidden="true" />

                <span id="name-error" className={styles.fieldError}>
                  {formErrors.name}
                </span>
              </>
            )}
          </div>
          <div className={styles.formField}>
            <input
              id="booking-email"
              className={formErrors.email ? styles.invalidField : ""}
              name="email"
              type="email"
              placeholder="Email*"
              aria-invalid={Boolean(formErrors.email)}
              aria-describedby={formErrors.email ? "email-error" : undefined}
              onChange={() =>
                setFormErrors((current) => ({
                  ...current,
                  email: "",
                }))
              }
            />

            {formErrors.email && (
              <>
                <label htmlFor="booking-email" className={styles.errorLabel}>
                  Email*
                </label>

                <CircleAlert className={styles.errorIcon} aria-hidden="true" />

                <span id="email-error" className={styles.fieldError}>
                  {formErrors.email}
                </span>
              </>
            )}
          </div>

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
