export async function POST(request) {
  try {
    const body = await request.json();
    const message = body?.message;

    if (!message) {
      return Response.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return Response.json(
        { error: "GEMINI_API_KEY is missing in Vercel." },
        { status: 500 }
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
              role: "user",
              parts: [
                {
                  text:
                    "You are Ask Priyansh AI, the AI assistant on Priyansh Sharma's portfolio website. Priyansh is a BCA student, future web developer and creator. Answer clearly, helpfully and briefly. Do not invent private information.\n\nUser: " +
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

      return Response.json(
        {
          error:
            data?.error?.message ||
            "Gemini API request failed."
        },
        { status: response.status }
      );
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reply) {
      return Response.json(
        { error: "Gemini returned no response." },
        { status: 500 }
      );
    }

    return Response.json({ reply });

  } catch (error) {
    console.error("Server error:", error);

    return Response.json(
      {
        error: error?.message || "Server error."
      },
      { status: 500 }
    );
  }
}
