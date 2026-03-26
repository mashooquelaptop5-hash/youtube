import { Hono } from "npm:hono";
import ytdl from "npm:ytdl-core";

const app = new Hono();

app.get("/info", async (c) => {
  const url = c.req.query("url");
  if (!url) return c.json({ error: "No URL provided" }, 400);

  try {
    const info = await ytdl.getInfo(url);
    
    // Filter and map the qualities you want to show the user
    const formats = info.formats.map(f => ({
      itag: f.itag,
      quality: f.qualityLabel || "audio only",
      container: f.container,
      hasVideo: f.hasVideo,
      hasAudio: f.hasAudio,
      url: f.url // This is the direct download link
    }));

    return c.json({
      title: info.videoDetails.title,
      description: info.videoDetails.description,
      thumbnail: info.videoDetails.thumbnails[0].url,
      formats: formats
    });
  } catch (err) {
    return c.json({ error: "Failed to fetch info" }, 500);
  }
});
