export function youtubeEmbedUrl(url: string | null): string | null {
  if (!url) return null;

  try {
    const u = new URL(url);
    let id: string | null = null;

    if (u.hostname === "youtu.be") {
      id = u.pathname.slice(1);
    } else if (u.hostname.endsWith("youtube.com")) {
      if (u.pathname === "/watch") {
        id = u.searchParams.get("v");
      } else if (u.pathname.startsWith("/embed/")) {
        id = u.pathname.split("/")[2];
      }
    }

    if (!id || !/^[A-Za-z0-9_-]{6,20}$/.test(id)) return null;
    return `https://www.youtube-nocookie.com/embed/${id}`;
  } catch {
    return null;
  }
}