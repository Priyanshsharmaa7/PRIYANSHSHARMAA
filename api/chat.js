export async function POST(request) {
  try {
    const body = await request.json();
    const message = body?.message;

    if (!message) {
      return new Response(
        JSON.stringify({ error: "Message is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "GEMINI_API_KEY is missing." }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=" +
        encodeURIComponent(apiKey),
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text:
                    "You are Ask Priyansh AI, the AI assistant on Priyansh Sharma's portfolio website. Answer clearly and helpfully. Do not invent private information.\n\nUser: " +
                    String(message)
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 500
          }
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      console.error("Gemini API error:", data);

      return new Response(
        JSON.stringify({
          error:
            data?.error?.message ||
            "Gemini API request failed."
        }),
        {
          status: response.status,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return new Response(
        JSON.stringify({
          error: "Gemini returned no response."
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" }
        }
      );
    }

    return new Response(
      JSON.stringify({ reply }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" }
      }
    );

  } catch (error) {
    console.error("Server error:", error);

    return new Response(
      JSON.stringify({
        error: error?.message || "Server error."
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
}
