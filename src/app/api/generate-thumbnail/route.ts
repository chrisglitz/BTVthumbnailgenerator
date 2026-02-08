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

    // Use the COMPLETE video title - NOT shortened, NOT modified
    const fullTitle = videoInfo.title;

    const prompt = `Create a ULTRA HIGH QUALITY Minecraft YouTube thumbnail exactly like popular Hive server and Minecraft content creator thumbnails.

=== MANDATORY TEXT - DISPLAY EXACTLY ===
FULL VIDEO TITLE: "${fullTitle}"
This COMPLETE title MUST appear in the image EXACTLY as written above. Do NOT shorten, paraphrase, or change ANY words. Include EVERY word.
Also include "@benhive" in the bottom corner.

=== 3D RENDER STYLE (CRITICAL) ===
- Style: Cinema 4D / Blender high-quality 3D render of Minecraft
- NOT pixel art, NOT 2D - must be smooth 3D rendered Minecraft characters
- Characters have that iconic "Minecraft animation" look - blocky but smoothly rendered
- Dramatic dynamic pose (running, jumping, sword raised, dramatic stance)
- Character wearing distinctive skin (cyan/teal hair, cool armor, or unique outfit)
- Professional Minecraft YouTuber thumbnail quality

=== VISUALS MUST MATCH VIDEO CONTENT ===
Based on the title "${fullTitle}":
- Create a scene that DIRECTLY depicts what the video is about
- If it mentions a game mode (SkyWars, BedWars, PvP, etc.) - show that environment
- If it mentions items/mobs/builds - feature them prominently
- The thumbnail should instantly communicate the video topic

=== TEXT STYLING ===
- Title text: BOLD, CHUNKY, BLOCKY Minecraft-style font
- Thick black outline (3-4px) around each letter
- White or bright colored fill (yellow, cyan, or white)
- Drop shadow for depth
- Text at TOP of image, large and highly readable
- "@benhive" smaller in bottom right corner, same blocky style

=== ENVIRONMENT & LIGHTING ===
- Bright vibrant BLUE SKY with white fluffy clouds
- Minecraft world background relevant to video topic
- DEPTH OF FIELD blur on background (character sharp, background slightly blurred)
- Golden hour warm lighting OR dramatic rim lighting
- High saturation, vibrant colors

=== COMPOSITION ===
- 16:9 YouTube thumbnail format
- Character prominently featured (40-60% of frame)
- Low angle camera looking slightly up at character (heroic feel)
- Text does NOT cover character's face
- Clean, uncluttered, professional look

=== ABSOLUTE REQUIREMENTS ===
1. The FULL title "${fullTitle}" must appear EXACTLY - every single word, spelled correctly
2. 3D rendered Minecraft style (like Cinema 4D renders), NOT pixel art
3. Visuals relevant to video content
4. Bright, colorful, eye-catching
5. "@benhive" watermark in corner

DO NOT: Use realistic humans, dark colors, 2D pixel art style, shortened/modified title text, or generic unrelated imagery.`;

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt,
      n: 1,
      size: "1792x1024",
      quality: "hd",
      style: "vivid",
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
