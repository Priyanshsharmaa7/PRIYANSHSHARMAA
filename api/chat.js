export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message } = req.body || {};

    if (!message || typeof message !== "string") {
      return res.status(400).json({
        error: "Please provide a message."
      });
    }

    const cleanMessage = message.trim();

    if (!cleanMessage) {
      return res.status(400).json({
        error: "Message cannot be empty."
      });
    }

    // Basic length limit
    if (cleanMessage.length > 4000) {
      return res.status(400).json({
        error: "Message is too long."
      });
    }

    if (!process.env.OPENAI_API_KEY) {
      return res.status(500).json({
        error: "OPENAI_API_KEY is not configured."
      });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-5-mini",
        instructions:
          "You are Ask Priyansh AI, the helpful AI assistant on Priyansh Sharma's personal website. Be friendly, concise, accurate, and safe. If asked about Priyansh Sharma, only use information provided on the website or in the conversation. Do not invent personal information.",
        input: cleanMessage
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI API error:", data);

      return res.status(response.status).json({
        error: "AI service error."
      });
    }

    return res.status(200).json({
      reply: data.output_text || "Sorry, I couldn't generate a response."
    });

  } catch (error) {
    console.error("Server error:", error);

    return res.status(500).json({
      error: "Something went wrong."
    });
  }
}
