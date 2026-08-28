import { DetailsClient } from "@/components/DetailsClient/DetailsClient";

export default async function CamperPage({
  params,
}: {
  params: Promise<{ camperId: string }>;
}) {
  const { camperId } = await params;
  return <DetailsClient camperId={camperId} />;
}
