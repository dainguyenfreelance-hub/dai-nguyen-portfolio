import { createClient } from "@supabase/supabase-js";
import { ASSET_BASE } from "./data";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || "https://ibszoogzmzttnrgjnsrw.supabase.co";
const supabaseKey =
  import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "sb_publishable_JTW1uNSxFnCMQ44F4C4BUA_XbRaXOH_";

export const isCloudConfigured = Boolean(supabaseUrl && supabaseKey);
export const PROJECT_IMAGES_BUCKET = "project-images";

export const supabase = isCloudConfigured
  ? createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    })
  : null;

const fallbackImages = {
  "Case Study": `${ASSET_BASE}/case-study.webp`,
  TVC: `${ASSET_BASE}/tvc.webp`,
  Social: `${ASSET_BASE}/social.webp`,
  "Social Post": `${ASSET_BASE}/social.webp`,
  Animatic: `${ASSET_BASE}/animatic.webp`,
  "AI Video": `${ASSET_BASE}/ai-video.webp`,
};

export function youtubeVideoId(value) {
  if (!value) return "";
  try {
    const url = new URL(value);
    if (url.hostname.replace(/^www\./, "") === "youtu.be") {
      return url.pathname.split("/").filter(Boolean)[0] || "";
    }
    if (url.pathname.startsWith("/shorts/") || url.pathname.startsWith("/embed/")) {
      return url.pathname.split("/").filter(Boolean)[1] || "";
    }
    return url.searchParams.get("v") || "";
  } catch {
    return "";
  }
}

export function youtubeThumbnail(value) {
  const id = youtubeVideoId(value);
  return id ? `https://i.ytimg.com/vi/${id}/hqdefault.jpg` : "";
}

export function projectFromRow(row) {
  const generatedThumbnail = youtubeThumbnail(row.youtube_url);
  const storedThumbnail = row.thumbnail_url || "";
  const usesPlaceholder =
    !storedThumbnail ||
    storedThumbnail.includes("dainguyen.lovable.app/assets/") ||
    storedThumbnail.startsWith(`${ASSET_BASE}/`);

  return {
    databaseId: row.id,
    id: row.slug,
    title: row.title,
    category: row.category,
    client: row.client,
    agency: row.agency,
    year: String(row.year),
    role: row.role,
    image:
      !row.thumbnail_path && usesPlaceholder && generatedThumbnail
        ? generatedThumbnail
        : storedThumbnail || fallbackImages[row.category] || fallbackImages["Case Study"],
    thumbnailPath: row.thumbnail_path,
    videoUrl: row.youtube_url,
    featured: row.featured,
    published: row.published,
    description: row.description,
    brief: row.brief,
    challenge: row.challenge,
    approach: row.approach,
    result: row.result,
    credits: row.credits,
    sortOrder: row.sort_order,
  };
}

export function projectToRow(project) {
  return {
    slug: project.id.trim(),
    title: project.title.trim(),
    category: project.category,
    client: project.client.trim(),
    agency: project.agency.trim(),
    year: Number(project.year) || new Date().getFullYear(),
    role: project.role.trim(),
    thumbnail_url: project.image.trim(),
    thumbnail_path: project.thumbnailPath.trim(),
    youtube_url: project.videoUrl.trim(),
    description: project.description.trim(),
    brief: project.brief.trim(),
    challenge: project.challenge.trim(),
    approach: project.approach.trim(),
    result: project.result.trim(),
    credits: project.credits.trim(),
    featured: project.featured,
    published: project.published,
    sort_order: Number(project.sortOrder) || 0,
  };
}

export async function fetchPublishedProjects() {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .eq("published", true)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data.map(projectFromRow);
}

export async function fetchSiteSettings() {
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("site_settings")
    .select("showreel_url, showreel_caption")
    .eq("id", "default")
    .maybeSingle();

  if (error) throw error;
  return {
    showreelUrl: data?.showreel_url || "",
    showreelCaption: data?.showreel_caption || "",
  };
}

export function notifyPortfolioUpdated() {
  window.dispatchEvent(new Event("portfolio-content-updated"));
}
