// api/chat.js - Vercel serverless function enhanced for itch.io deployment
export default async function handler(req, res) {
  // Enhanced CORS headers to support itch.io domains
  const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "https://v6p9d9t4.ssl.hwcdn.net", // Current itch.io domain
    "https://itch.zone", // Future itch.io domain
    "https://html.itch.zone", // Alternative itch.io domain
    process.env.SITE_URL, // Your custom domain if any
  ].filter(Boolean); // Remove undefined values

  const origin = req.headers.origin;
  const isAllowedOrigin =
    origin &&
    (allowedOrigins.includes(origin) ||
      origin.includes(".itch.io") ||
      origin.includes("localhost") ||
      origin.includes("127.0.0.1"));

  // Set CORS headers - be more specific for security while allowing itch.io
  if (isAllowedOrigin) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  } else {
    res.setHeader("Access-Control-Allow-Origin", "*"); // Fallback for development
  }

  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "false");

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    console.log("🌐 CORS preflight request from:", origin);
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    console.log(`❌ Method ${req.method} not allowed from origin:`, origin);
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("🤖 Proxying request to OpenRouter API");
    console.log("🔑 API Key present:", !!process.env.OPENROUTER_API_KEY);
    console.log("🌐 Request origin:", origin);
    console.log(
      "📝 Site Title:",
      process.env.SITE_TITLE || "Frog Police: Gang Bust"
    );

    // Validate that we have the required environment variables
    if (!process.env.OPENROUTER_API_KEY) {
      console.error("❌ OPENROUTER_API_KEY environment variable not set");
      return res.status(500).json({
        error: "Server configuration error: API key not configured",
      });
    }

    // Validate request body
    if (!req.body || !req.body.model || !req.body.messages) {
      console.error("❌ Invalid request body:", {
        hasBody: !!req.body,
        hasModel: !!req.body?.model,
        hasMessages: !!req.body?.messages,
      });
      return res.status(400).json({
        error: "Bad request: Missing required fields",
        required: ["model", "messages"],
      });
    }

    // Determine the referer URL based on origin
    let refererUrl = process.env.SITE_URL || "https://your-game-site.com";
    if (origin && origin.includes(".itch.io")) {
      refererUrl = origin;
    } else if (
      origin &&
      (origin.includes("localhost") || origin.includes("127.0.0.1"))
    ) {
      refererUrl = origin;
    }

    console.log("🔗 Using referer URL:", refererUrl);

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": refererUrl,
          "X-Title": process.env.SITE_TITLE || "Frog Police: Gang Bust",
        },
        body: JSON.stringify(req.body),
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ OpenRouter API Error:", {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        referer: refererUrl,
      });

      return res.status(response.status).json({
        error: `OpenRouter API error: ${response.statusText}`,
        details: errorText,
        status: response.status,
      });
    }

    const data = await response.json();
    console.log("✅ OpenRouter API Success - Response received");
    console.log("📊 Response stats:", {
      hasChoices: !!data.choices,
      choiceCount: data.choices?.length,
      model: data.model,
      usage: data.usage,
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("💥 Server Error:", error);
    res.status(500).json({
      error: "Internal server error",
      message: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
}
