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
    <main className="min-h-screen bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 text-white">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/30 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">
              <span className="text-purple-400">BenTheVillager&apos;s</span>{" "}
              Thumbnail Generator
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              AI-powered YouTube thumbnails with{" "}
              <span className="text-purple-300 font-semibold">@benhive</span>{" "}
              branding
            </p>
          </div>
          <div className="hidden sm:block text-right">
            <span className="text-xs text-gray-500 bg-gray-800 px-3 py-1 rounded-full">
              Powered by OpenAI
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="mx-auto max-w-5xl px-4 py-10">
        {/* URL Input Section */}
        <section className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
          <label
            htmlFor="youtube-url"
            className="block text-sm font-medium text-gray-300 mb-3"
          >
            Paste a YouTube video URL
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              id="youtube-url"
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && !loading && handleGenerate()
              }
              className="flex-1 rounded-xl bg-gray-800 border border-gray-600 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              disabled={loading}
            />
            <button
              onClick={handleGenerate}
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed font-semibold transition-all text-sm uppercase tracking-wider whitespace-nowrap"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg
                    className="animate-spin h-4 w-4"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  Generating...
                </span>
              ) : (
                "Generate Thumbnail"
              )}
            </button>
          </div>

          {error && (
            <div className="mt-4 p-3 bg-red-900/40 border border-red-700/50 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}
        </section>

        {/* Result Section */}
        {imageUrl && (
          <section className="mt-8 bg-gray-900/60 border border-gray-700/50 rounded-2xl p-6 md:p-8 backdrop-blur-sm">
            {videoTitle && (
              <h2 className="text-lg font-semibold text-gray-200 mb-4">
                Thumbnail for:{" "}
                <span className="text-purple-300">{videoTitle}</span>
              </h2>
            )}

            {/* Thumbnail Preview */}
            <div className="relative rounded-xl overflow-hidden border border-gray-700/50 bg-black">
              <div className="aspect-video relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt="Generated YouTube thumbnail"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Dimensions info */}
            <p className="mt-3 text-xs text-gray-500 text-center">
              Generated at 1792x1024 &mdash; YouTube recommended thumbnail size
              is 1280x720 (16:9)
            </p>

            {/* Action Buttons */}
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={handleDownload}
                className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-500 font-semibold transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                Download Thumbnail
              </button>
              <button
                onClick={handleRegenerate}
                disabled={loading}
                className="px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed font-semibold transition-all text-sm uppercase tracking-wider flex items-center justify-center gap-2"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  />
                </svg>
                Regenerate
              </button>
            </div>
          </section>
        )}

        {/* How it works */}
        {!imageUrl && !loading && (
          <section className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gray-900/40 border border-gray-700/30 rounded-xl p-5 text-center">
              <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-400 text-lg font-bold">1</span>
              </div>
              <h3 className="font-semibold text-gray-200 mb-1">
                Paste a URL
              </h3>
              <p className="text-sm text-gray-500">
                Drop any YouTube video link into the input field above
              </p>
            </div>
            <div className="bg-gray-900/40 border border-gray-700/30 rounded-xl p-5 text-center">
              <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-400 text-lg font-bold">2</span>
              </div>
              <h3 className="font-semibold text-gray-200 mb-1">
                AI Generates
              </h3>
              <p className="text-sm text-gray-500">
                OpenAI creates a custom thumbnail with &quot;Ben The
                Villager&quot; and &quot;@benhive&quot; branding
              </p>
            </div>
            <div className="bg-gray-900/40 border border-gray-700/30 rounded-xl p-5 text-center">
              <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-400 text-lg font-bold">3</span>
              </div>
              <h3 className="font-semibold text-gray-200 mb-1">
                Download or Retry
              </h3>
              <p className="text-sm text-gray-500">
                Download the thumbnail or regenerate until you find the perfect
                one
              </p>
            </div>
          </section>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-16 py-6 text-center text-xs text-gray-600">
        BenTheVillager&apos;s Thumbnail Generator &mdash; Built with Next.js
        &amp; OpenAI
      </footer>
    </main>
  );
}
