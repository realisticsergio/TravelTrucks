import { DetailsClient } from "@/components/DetailsClient";

export default async function CamperPage({
  params,
}: {
  params: Promise<{ camperId: string }>;
}) {
  const { camperId } = await params;
  return <DetailsClient camperId={camperId} />;
}
