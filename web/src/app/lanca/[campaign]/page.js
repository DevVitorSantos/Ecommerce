import { redirect } from "next/navigation";
import { CAMPAIGNS } from "@/lib/campaigns";

export default async function CampaignLanding({ params }) {
  const { campaign } = await params;
  const id = decodeURIComponent(campaign).toLowerCase();
  const cfg = CAMPAIGNS[id];

  if (!cfg) redirect("/");

  const qs = new URLSearchParams({
    utm_source: cfg.source,
    utm_medium: cfg.medium,
    utm_campaign: id,
    ...(cfg.content ? { utm_content: cfg.content } : {}),
  });

  redirect(`/?${qs.toString()}`);
}
