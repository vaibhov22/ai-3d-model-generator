"use client";

import ModelViewer from "./components/ModelViewer";
import { useState } from "react";

const examples = [
  "A futuristic helmet",
  "A small friendly robot",
  "A futuristic sports car",
];

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");
  const [modelUrl, setModelUrl] = useState("");

  const generateModel = async () => {
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setModelUrl("");
    setStatus("Starting AI generation...");

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      let result = await response.json();

      if (!response.ok) {
      if (result.error === "The 3D generator is busy right now. Try again in a few seconds.") {
        throw new Error(
          "The AI 3D generator is busy. Please wait a few seconds and try again."
        );
      }

  throw new Error(result.error || "Generation failed");
}

      if (result.status === "pending" || result.status === "queued") {
        while (
          result.status === "pending" ||
          result.status === "queued"
        ) {
          setStatus("AI is creating your 3D model...");

          await new Promise((resolve) =>
            setTimeout(
            resolve,
            (result.retryAfter || result.retry_after || 5) * 1000
          )
          );

          const pollResponse = await fetch(
            `/api/generate?job=${encodeURIComponent(result.job)}`
          );

          result = await pollResponse.json();

          if (!pollResponse.ok) {
            throw new Error(result.error || "Generation failed");
          }
        }
      }

      if (result.status === "done" && result.glbUrl) {
        setModelUrl(result.glbUrl);
        setStatus("3D model generated successfully!");
      } else {
        throw new Error(
          result.error || "Could not generate the 3D model"
        );
      }
    } catch (error) {
      console.error(error);
      setStatus(
        error instanceof Error
          ? error.message
          : "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white">
      <div className="mx-auto max-w-7xl px-6 py-10">

        {/* Header */}
        <header className="mb-10">
          <div className="mb-3 inline-flex items-center rounded-full border border-gray-700 bg-gray-900 px-3 py-1 text-sm text-gray-300">
            AI Powered • Text to 3D
          </div>

          <h1 className="text-5xl font-bold tracking-tight">
            AI 3D Model Generator
          </h1>

          <p className="mt-3 max-w-2xl text-lg text-gray-400">
            Describe anything and turn your idea into an interactive
            3D model.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-2">

          {/* Left panel */}
          <section className="rounded-3xl border border-gray-800 bg-gray-950 p-6 shadow-2xl">

            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">
                Describe your model
              </h2>

              <span className="text-sm text-gray-500">
                {prompt.length}/1000
              </span>
            </div>

            <textarea
              value={prompt}
              maxLength={1000}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Example: A futuristic sports car..."
              className="mt-5 h-48 w-full resize-none rounded-2xl border border-gray-700 bg-black p-5 text-white placeholder-gray-600 outline-none transition focus:border-gray-400"
            />

            {/* Examples */}
            <div className="mt-4">
              <p className="mb-2 text-sm text-gray-500">
                Try an example
              </p>

              <div className="flex flex-wrap gap-2">
                {examples.map((example) => (
                  <button
                    key={example}
                    onClick={() => setPrompt(example)}
                    className="rounded-full border border-gray-700 px-3 py-1.5 text-sm text-gray-300 transition hover:border-gray-400 hover:text-white"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={generateModel}
              disabled={!prompt.trim() || loading}
              className="mt-6 w-full rounded-2xl bg-white px-5 py-4 text-base font-semibold text-black transition hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading
                ? "Generating 3D Model..."
                : modelUrl
                  ? "Generate Another Model"
                  : "Generate 3D Model"}
            </button>

            {status && (
              <div className="mt-4 rounded-xl border border-gray-800 bg-black p-4 text-center text-sm text-gray-400">
                {loading && (
                  <span className="mr-2 inline-block animate-pulse">
                    ●
                  </span>
                )}
                {status}
              </div>
            )}
          </section>

          {/* Viewer */}
          <section className="relative overflow-hidden rounded-3xl border border-gray-800 bg-gray-950 shadow-2xl">

            <div className="absolute left-5 top-5 z-10 rounded-full border border-gray-700 bg-black/70 px-3 py-1 text-xs text-gray-300 backdrop-blur">
              3D Preview
            </div>

            {modelUrl ? (
              <>
                <ModelViewer modelUrl={modelUrl} />

                <a
                  href={modelUrl}
                  download="AI-Generated-Model.glb"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="absolute bottom-5 right-5 rounded-xl bg-white px-5 py-3 font-semibold text-black transition hover:bg-gray-200"
                >
                  Download GLB
                </a>
              </>
            ) : (
              <div className="flex min-h-[520px] items-center justify-center px-6">
                <div className="text-center">
                  <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-2xl border border-gray-800 bg-black text-3xl">
                    ✦
                  </div>

                  <h3 className="text-lg font-semibold">
                    Your 3D model will appear here
                  </h3>

                  <p className="mt-2 max-w-sm text-sm text-gray-500">
                    Enter a description and generate an interactive
                    3D model.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-gray-600">
          Built with Next.js, React Three Fiber, Three.js and AI
          text-to-3D generation.
        </footer>

      </div>
    </main>
  );
}