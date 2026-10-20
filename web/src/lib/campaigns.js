import { CAMPAIGNS } from "./campaigns.generated";

export { CAMPAIGNS };

// Slugs antigos (hífen) redirecionam para os ids snake_case — links já usados não quebram.
export const LEGACY_CAMPAIGN_SLUGS = {
  "ig-reels-dopamina": "ig_reels_dopamina",
  "tiktok-da-madrugada": "tt_madrugada",
  "gsearch-marca": "gsearch_marca",
  "gsearch-generico": "gsearch_generico",
  "email-blackout": "email_blackout",
  "whatsapp-meme": "wa_meme",
  "yt-shorts-fake": "yt_shorts_fake",
  "reddit-br": "reddit_br",
};
