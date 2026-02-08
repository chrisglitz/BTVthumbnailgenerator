"use client";

import { useState } from "react";

export default function Home() {
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [videoTitle, setVideoTitle] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleGenerate() {
    if (!youtubeUrl.trim()) {
      setError("Please enter a YouTube URL");
      return;
    }

    setLoading(true);
    setError(null);
    setImageUrl(null);
    setVideoTitle(null);

    try {
      const res = await fetch("/api/generate-thumbnail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ youtubeUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate thumbnail");
      }

      setImageUrl(data.imageUrl);
      setVideoTitle(data.videoTitle);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Something went wrong";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  async function handleDownload() {
    if (!imageUrl) return;

    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `btv-thumbnail-${Date.now()}.png`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch {
      setError("Failed to download image. Try right-clicking and saving.");
    }
  }

  function handleRegenerate() {
    handleGenerate();
  }

  return (
    <main className="min-h-screen relative">
      {/* Animated honeycomb background */}
      <div className="honeycomb-bg" />

      {/* Floating bee particles */}
      <div className="particle-field">
        <span className="particle">&#x1F41D;</span>
        <span className="particle">&#x2B22;</span>
        <span className="particle">&#x1F41D;</span>
        <span className="particle">&#x2B22;</span>
        <span className="particle">&#x1F41D;</span>
        <span className="particle">&#x2B22;</span>
        <span className="particle">&#x1F41D;</span>
      </div>

      {/* Main content layer */}
      <div className="relative z-10">
        {/* Subscribe Banner */}
        <div className="subscribe-banner px-4 py-6 md:py-8">
          {/* Sparkle effects */}
          <div className="sparkle" />
          <div className="sparkle" />
          <div className="sparkle" />
          <div className="sparkle" />
          <div className="sparkle" />
          <div className="sparkle" />

          <div className="mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-center gap-6 md:gap-10 relative z-10">
            {/* Villager Character */}
            <div className="villager-character hidden sm:block">
              <div className="villager-head">
                <div className="villager-nose" />
                <div className="villager-eyes">
                  <div className="villager-eye" />
                  <div className="villager-eye" />
                </div>
                <div className="villager-eyebrow left" />
                <div className="villager-eyebrow right" />
              </div>
              <div className="villager-body" />
              <div className="villager-arms">
                <div className="villager-arm left" />
                <div className="villager-arm right" />
              </div>
              <div className="villager-legs">
                <div className="villager-leg" />
                <div className="villager-leg" />
              </div>
            </div>

            {/* Text Content */}
            <div className="text-center md:text-left flex-1">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                <span className="bell-icon">&#x1F514;</span>
                <span className="subscribe-text">SUBSCRIBE TO</span>
                <span className="bell-icon" style={{ animationDelay: '0.25s' }}>&#x1F514;</span>
              </div>
              <div className="channel-name mb-3">
                BEN THE VILLAGER!
              </div>
              <a
                href="https://youtube.com/@benhive"
                target="_blank"
                rel="noopener noreferrer"
                className="channel-url group"
              >
                <span className="yt-button" />
                <span>youtube.com/@benhive</span>
                <span className="arrow-bounce">&#x279C;</span>
              </a>
            </div>

            {/* Right side bee */}
            <div className="hidden lg:flex flex-col items-center gap-2">
              <span className="text-6xl bee-icon">&#x1F41D;</span>
              <span className="text-sm text-[#FFD700]/60" style={{ fontFamily: 'VT323, monospace' }}>
                JOIN THE HIVE!
              </span>
            </div>
          </div>
        </div>

        {/* Header */}
        <header className="border-b-4 border-[#FFD700]/30 bg-gradient-to-r from-[#1a1a2e]/95 via-[#2a2a3e]/95 to-[#1a1a2e]/95 backdrop-blur-md">
          <div className="mx-auto max-w-5xl px-4 py-6 flex items-center justify-between">
            <div className="animate-fade-in">
              <div className="flex items-center gap-3">
                <span className="bee-icon text-4xl">&#x1F41D;</span>
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-wide title-animated">
                    BenTheVillager&apos;s
                  </h1>
                  <h2 className="text-xl md:text-2xl font-bold text-white/90" style={{ textShadow: '2px 2px 0 #000' }}>
                    Thumbnail Generator
                  </h2>
                </div>
              </div>
              <p className="text-sm text-[#FFD700]/70 mt-2 tracking-wide" style={{ fontFamily: 'VT323, monospace' }}>
                AI-powered thumbnails with{" "}
                <span className="text-[#FFD700] font-bold">@benhive</span>{" "}
                branding
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="mx-auto max-w-5xl px-4 py-10">
          {/* URL Input Section */}
          <section className="mc-panel p-6 md:p-8 animate-fade-in-delay-1">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-[#FFD700] to-[#E87E04] flex items-center justify-center" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                <span className="text-[#1a1a2e] font-bold text-sm">1</span>
              </div>
              <label
                htmlFor="youtube-url"
                className="text-lg font-bold glow-text"
                style={{ fontFamily: 'VT323, monospace', letterSpacing: '0.1em' }}
              >
                PASTE A YOUTUBE URL
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <input
                id="youtube-url"
                type="url"
                placeholder="https://www.youtube.com/watch?v=..."
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && !loading && handleGenerate()
                }
                className="mc-input flex-1 w-full"
                disabled={loading}
              />
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="mc-button mc-button-primary whitespace-nowrap"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3">
                    <div className="w-5 h-5 border-2 border-[#1a1a2e] border-t-transparent animate-spin" style={{ borderRadius: '0' }} />
                    CRAFTING...
                  </span>
                ) : (
                  <>&#x2699; GENERATE</>
                )}
              </button>
            </div>

            {error && (
              <div className="error-shake mt-4 p-4 bg-red-900/60 border-4 border-red-700 text-red-200" style={{ fontFamily: 'VT323, monospace', fontSize: '1.1rem' }}>
                &#x26A0; {error}
              </div>
            )}
          </section>

          {/* Loading State */}
          {loading && (
            <section className="mt-8 mc-panel p-8 text-center animate-fade-in">
              <div className="flex flex-col items-center gap-6">
                <div className="relative">
                  <div className="mc-spinner" />
                  <span className="absolute -top-2 -right-2 text-2xl bee-icon">&#x1F41D;</span>
                </div>
                <div>
                  <p className="text-[#FFD700] text-xl" style={{ fontFamily: 'VT323, monospace' }}>
                    THE BEES ARE WORKING ON YOUR THUMBNAIL...
                  </p>
                  <p className="text-white/50 text-sm mt-2" style={{ fontFamily: 'VT323, monospace' }}>
                    This may take a moment
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* Result Section */}
          {imageUrl && !loading && (
            <section className="mt-8 mc-panel p-6 md:p-8 animate-fade-in">
              {videoTitle && (
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">&#x1F3AC;</span>
                  <h2 className="text-lg font-bold text-white/90" style={{ fontFamily: 'VT323, monospace' }}>
                    THUMBNAIL FOR:{" "}
                    <span className="text-[#FFD700]">{videoTitle}</span>
                  </h2>
                </div>
              )}

              {/* Thumbnail Preview */}
              <div className="pixel-frame">
                <div className="aspect-video relative bg-black">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt="Generated YouTube thumbnail"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Dimensions info */}
              <p className="mt-4 text-center text-[#FFD700]/60" style={{ fontFamily: 'VT323, monospace' }}>
                &#x1F4D0; 1792x1024 &mdash; YouTube recommends 1280x720 (16:9)
              </p>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-center">
                <button
                  onClick={handleDownload}
                  className="mc-button mc-button-green"
                >
                  <span className="flex items-center justify-center gap-2">
                    &#x2B07; DOWNLOAD
                  </span>
                </button>
                <button
                  onClick={handleRegenerate}
                  disabled={loading}
                  className="mc-button mc-button-primary"
                >
                  <span className="flex items-center justify-center gap-2">
                    &#x1F504; REGENERATE
                  </span>
                </button>
              </div>
            </section>
          )}

          {/* How it works */}
          {!imageUrl && !loading && (
            <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="step-card mc-panel p-6 text-center animate-fade-in-delay-1">
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-[#FFD700] to-[#E87E04] flex items-center justify-center" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                  <span className="text-[#1a1a2e] font-bold text-2xl">1</span>
                </div>
                <h3 className="font-bold text-[#FFD700] text-lg mb-2" style={{ fontFamily: 'VT323, monospace', letterSpacing: '0.1em' }}>
                  PASTE URL
                </h3>
                <p className="text-white/60 text-sm" style={{ fontFamily: 'VT323, monospace' }}>
                  Drop any YouTube video link into the input above
                </p>
              </div>

              <div className="step-card mc-panel p-6 text-center animate-fade-in-delay-2">
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-[#FFD700] to-[#E87E04] flex items-center justify-center" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                  <span className="text-[#1a1a2e] font-bold text-2xl">2</span>
                </div>
                <h3 className="font-bold text-[#FFD700] text-lg mb-2" style={{ fontFamily: 'VT323, monospace', letterSpacing: '0.1em' }}>
                  AI GENERATES
                </h3>
                <p className="text-white/60 text-sm" style={{ fontFamily: 'VT323, monospace' }}>
                  OpenAI crafts a custom thumbnail with &quot;Ben The Villager&quot; branding
                </p>
              </div>

              <div className="step-card mc-panel p-6 text-center animate-fade-in-delay-3">
                <div className="w-14 h-14 mx-auto mb-4 bg-gradient-to-br from-[#FFD700] to-[#E87E04] flex items-center justify-center" style={{ clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)' }}>
                  <span className="text-[#1a1a2e] font-bold text-2xl">3</span>
                </div>
                <h3 className="font-bold text-[#FFD700] text-lg mb-2" style={{ fontFamily: 'VT323, monospace', letterSpacing: '0.1em' }}>
                  DOWNLOAD
                </h3>
                <p className="text-white/60 text-sm" style={{ fontFamily: 'VT323, monospace' }}>
                  Save the thumbnail or regenerate until you find the perfect one
                </p>
              </div>
            </section>
          )}

          {/* Decorative Minecraft blocks */}
          <div className="fixed bottom-0 left-0 right-0 h-16 pointer-events-none z-0 overflow-hidden opacity-30">
            <div className="flex">
              {Array.from({ length: 30 }).map((_, i) => (
                <div
                  key={i}
                  className="w-16 h-16 flex-shrink-0"
                  style={{
                    background: i % 3 === 0
                      ? 'linear-gradient(180deg, #5D9B47 0%, #4A8039 40%, #8B6914 40%, #725510 100%)'
                      : i % 3 === 1
                      ? 'linear-gradient(180deg, #4A8039 0%, #3D6B2E 40%, #725510 40%, #5A440D 100%)'
                      : 'linear-gradient(180deg, #5D9B47 0%, #4A8039 50%, #8B6914 50%, #6B500F 100%)',
                    borderRight: '2px solid rgba(0,0,0,0.3)',
                    borderTop: '2px solid rgba(255,255,255,0.1)',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="relative z-10 border-t-4 border-[#FFD700]/20 mt-16 py-6 text-center bg-[#1a1a2e]/80 backdrop-blur-sm">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl bee-icon">&#x1F41D;</span>
            <p className="text-[#FFD700]/60" style={{ fontFamily: 'VT323, monospace', letterSpacing: '0.1em' }}>
              BENTHEVILLAGER&apos;S THUMBNAIL GENERATOR
            </p>
            <span className="text-2xl bee-icon" style={{ animationDelay: '1s' }}>&#x1F41D;</span>
          </div>
          <p className="text-white/30 text-xs mt-2" style={{ fontFamily: 'VT323, monospace' }}>
            Built with Next.js &amp; OpenAI
          </p>
        </footer>
      </div>
    </main>
  );
}
