import { redirect } from "next/navigation";
import { CAMPAIGNS, LEGACY_CAMPAIGN_SLUGS } from "@/lib/campaigns";

export default async function CampaignLanding({ params }) {
  const { campaign } = await params;
  const raw = decodeURIComponent(campaign).toLowerCase();
  const id = LEGACY_CAMPAIGN_SLUGS[raw] || raw;
  const cfg = CAMPAIGNS[id];
  if (!cfg) redirect("/");

  const base =
    cfg.destino_tipo === "categoria"
      ? `/categoria/${encodeURIComponent(cfg.destino)}`
      : cfg.destino_tipo === "produto"
        ? `/produto/${cfg.destino}`
        : "/";

  const qs = new URLSearchParams({
    utm_source: cfg.source,
    utm_medium: cfg.medium,
    utm_campaign: id,
    ...(cfg.content ? { utm_content: cfg.content } : {}),
    ...(cfg.utm_term ? { utm_term: cfg.utm_term } : {}),
  });

  redirect(`${base}?${qs.toString()}`);
}
