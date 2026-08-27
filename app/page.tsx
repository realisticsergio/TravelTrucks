import Link from "next/link";

export default function Home() {
  return (
    <main className="hero">
      <div className="heroOverlay" />
      <div className="heroContent">
        <h1>Campers of your dreams</h1>
        <p>You can find everything you want in our catalog</p>
        <Link href="/catalog" className="primaryButton">
          View Now
        </Link>
      </div>
    </main>
  );
}
