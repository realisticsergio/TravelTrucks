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
import { FormEvent, useState } from "react";
import { createBooking, getCamper, getReviews } from "@/lib/api";

export function DetailsClient({ camperId }: { camperId: string }) {
  const camperQuery = useQuery({
    queryKey: ["camper", camperId],
    queryFn: () => getCamper(camperId),
  });
  const reviewsQuery = useQuery({
    queryKey: ["reviews", camperId],
    queryFn: () => getReviews(camperId),
  });
  const [tab, setTab] = useState<"features" | "reviews">("features");
  const [toast, setToast] = useState("");
  const booking = useMutation({
    mutationFn: (data: { name: string; email: string }) =>
      createBooking(camperId, data),
    onSuccess: (data) => {
      setToast(data.message || "Booking request sent successfully!");
      setTimeout(() => setToast(""), 5000);
    },
  });
  if (camperQuery.isLoading)
    return (
      <main className="detailPage container">
        <div className="status">Loading camper…</div>
      </main>
    );
  if (camperQuery.isError || !camperQuery.data)
    return (
      <main className="detailPage container">
        <div className="status error">Camper not found.</div>
      </main>
    );
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

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    booking.mutate(
      { name: String(data.get("name")), email: String(data.get("email")) },
      { onSuccess: () => event.currentTarget.reset() },
    );
  }
  return (
    <main className="detailPage container">
      <h1>{camper.name}</h1>
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
      <p className="detailPrice">€{camper.price.toFixed(2)}</p>
      <div className="gallery">
        {images.map((image) => (
          <button
            key={image.id}
            onClick={() => window.open(image.original, "_blank")}
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
      <p className="detailDescription">{camper.description}</p>
      <div className="tabs">
        <button
          className={tab === "features" ? "active" : ""}
          onClick={() => setTab("features")}
        >
          Features
        </button>
        <button
          className={tab === "reviews" ? "active" : ""}
          onClick={() => setTab("reviews")}
        >
          Reviews
        </button>
      </div>
      <div className="detailColumns">
        <section className="tabContent">
          {tab === "features" ? (
            <>
              <div className="badges featureBadges">
                <span className="badge">
                  <Settings2 />
                  {camper.transmission}
                </span>
                <span className="badge">
                  <Fuel />
                  {camper.engine}
                </span>
                <span className="badge">
                  <Truck />
                  {camper.form.replaceAll("_", " ")}
                </span>
                {amenities.map((a) => (
                  <span className="badge" key={a}>
                    <Check />
                    {a}
                  </span>
                ))}
              </div>
              <h2>Vehicle details</h2>
              <dl className="detailsList">
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
            <div className="reviews">
              {reviewsQuery.isLoading && <p>Loading reviews…</p>}
              {reviewsQuery.data?.map((review) => (
                <article key={review.id}>
                  <div className="avatar">{review.reviewer_name[0]}</div>
                  <div>
                    <h3>{review.reviewer_name}</h3>
                    <div className="stars">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star
                          key={n}
                          size={16}
                          fill={
                            n <= review.reviewer_rating
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
        <form className="booking" onSubmit={submit}>
          <h2>Book your campervan now</h2>
          <p>Stay connected! We are always ready to help you.</p>
          <input name="name" placeholder="Name*" required minLength={2} />
          <input name="email" type="email" placeholder="Email*" required />
          <div className="dateField">
            <CalendarDays />
            <input type="date" aria-label="Booking date" />
          </div>
          <textarea placeholder="Comment" rows={4} />
          {booking.isError && (
            <p className="formError">
              Could not send booking. Please try again.
            </p>
          )}
          <button className="primaryButton" disabled={booking.isPending}>
            {booking.isPending ? "Sending…" : "Send"}
          </button>
        </form>
      </div>
      {toast && (
        <div className="toast">
          <Check />
          {toast}
        </div>
      )}
    </main>
  );
}
