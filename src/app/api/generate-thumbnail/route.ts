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

    // Use the COMPLETE video title for the thumbnail
    const fullTitle = videoInfo.title.toUpperCase();

    const prompt = `Create a Minecraft YouTube thumbnail in the style of popular Minecraft content creators like The Hive server thumbnails.

VIDEO TITLE: "${fullTitle}"

THE THUMBNAIL MUST BE DIRECTLY RELEVANT TO THE VIDEO TOPIC:
- Analyze the video title "${fullTitle}" and create visuals that MATCH THE CONTENT
- If the title mentions a specific game mode (SkyWars, BedWars, Survival, PvP, etc.), show that game mode's environment
- If the title mentions a challenge or achievement, depict that scenario
- If the title mentions specific items, mobs, or locations, include them prominently
- The scene, action, and environment should tell the story of what the video is about
- Make viewers instantly understand the video topic from the thumbnail

CRITICAL STYLE REQUIREMENTS:
- HIGH-QUALITY 3D RENDERED Minecraft character in a DYNAMIC ACTION POSE relevant to the video content
- The character should be a Minecraft player skin with distinctive features (cyan/teal armor or unique clothing)
- Character should be the MAIN FOCUS, doing an action RELATED TO THE VIDEO TOPIC
- BLOCKY MINECRAFT-STYLE TEXT displaying the EXACT title "${fullTitle}" - THIS TEXT MUST MATCH EXACTLY, DO NOT CHANGE OR SHORTEN IT
- Text must have: thick black outline, drop shadow, and be in a chunky pixelated Minecraft font style
- Small "@benhive" text in bottom corner with same blocky style

BACKGROUND & ENVIRONMENT:
- The environment MUST match the video topic (e.g., if about SkyWars, show floating islands; if about building, show a build; if about PvP, show combat arena)
- Bright, vibrant BLUE SKY with fluffy white clouds
- Use DEPTH OF FIELD blur effect on background to make character pop
- Warm lighting, possibly golden hour or dramatic lighting
- Include relevant Minecraft elements (mobs, items, blocks) that relate to the video subject

COLOR PALETTE:
- Saturated, bright colors (cyan, gold, red accents)
- High contrast between character and background
- The overall image should be COLORFUL and EYE-CATCHING

COMPOSITION:
- 16:9 aspect ratio YouTube thumbnail format
- Character takes up 40-60% of the frame
- Text clearly readable and not overlapping the character's face
- Dynamic camera angle (slightly low angle looking up at character is ideal)

IMPORTANT TEXT RULES:
- The title "${fullTitle}" must appear EXACTLY as written - do not paraphrase, shorten, or modify it in any way
- Every word of the title must be included and spelled correctly
- @benhive must appear exactly as written

DO NOT include: realistic humans, photorealistic style, dark/gloomy colors, made-up text, modified versions of the title, or visuals unrelated to the video topic`;

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
