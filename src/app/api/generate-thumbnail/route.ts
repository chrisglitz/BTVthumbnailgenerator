import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { extractVideoId, fetchVideoInfo } from "@/lib/youtube";

export async function POST(request: NextRequest) {
  try {
    const { youtubeUrl } = await request.json();

    if (!youtubeUrl) {
      return NextResponse.json(
        { error: "YouTube URL is required" },
        { status: 400 }
      );
    }

    const videoId = extractVideoId(youtubeUrl);
    if (!videoId) {
      return NextResponse.json(
        { error: "Invalid YouTube URL" },
        { status: 400 }
      );
    }

    const videoInfo = await fetchVideoInfo(videoId);

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const prompt = `Create a bold, eye-catching YouTube thumbnail image. The video title is: "${videoInfo.title}".

Design requirements:
- YouTube thumbnail dimensions (16:9 aspect ratio, 1792x1024 will be used)
- Bold, vibrant colors with high contrast
- The text "Ben The Villager" should be prominently displayed in a large, bold font at the top or center
- The text "@benhive" should appear smaller but clearly readable, positioned near the bottom or corner
- Include dynamic, engaging visual elements related to the video topic
- Use dramatic lighting and shadows for depth
- Make it look professional and click-worthy
- The overall style should be energetic and exciting, typical of popular YouTube thumbnails
- DO NOT include any other text besides "Ben The Villager" and "@benhive"`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1792x1024",
      quality: "hd",
    });

    const imageUrl = response.data?.[0]?.url;

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Failed to generate thumbnail" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      imageUrl,
      videoTitle: videoInfo.title,
      videoId: videoInfo.videoId,
      originalThumbnail: videoInfo.thumbnailUrl,
    });
  } catch (error: unknown) {
    console.error("Thumbnail generation error:", error);
    const message =
      error instanceof Error ? error.message : "Failed to generate thumbnail";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
