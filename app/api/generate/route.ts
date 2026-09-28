import { NextResponse } from "next/server";

function browserUrl(glbUrl: string) {
  const url = new URL(glbUrl);
  return `https://three.ws/cdn${url.pathname}`;
}

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (!prompt?.trim()) {
      return NextResponse.json(
        { error: "Prompt is required" },
        { status: 400 }
      );
    }

    const response = await fetch("https://three.ws/api/forge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: prompt.trim(),
        backend: "nvidia",
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: data.message || data.error || "Generation failed",
          retry_after: data.retry_after,
        },
        { status: response.status }
      );
    }

    if (data.glb_url) {
      data.glbUrl = browserUrl(data.glb_url);
    }

    // Forge uses job_id instead of job
    if (data.job_id) {
      data.job = data.job_id;
    }

    // Forge uses eta_seconds instead of etaSeconds
    if (data.eta_seconds) {
      data.etaSeconds = data.eta_seconds;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to start 3D generation" },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const job = searchParams.get("job");

    if (!job) {
      return NextResponse.json(
        { error: "Job is required" },
        { status: 400 }
      );
    }

    const response = await fetch(
      `https://three.ws/api/forge?job=${encodeURIComponent(job)}`,
      {
        cache: "no-store",
      }
    );

    const data = await response.json();

    if (data.glb_url) {
      data.glbUrl = browserUrl(data.glb_url);
    }

    if (data.job_id) {
      data.job = data.job_id;
    }

    if (data.eta_seconds) {
      data.etaSeconds = data.eta_seconds;
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to check generation status" },
      { status: 500 }
    );
  }
}