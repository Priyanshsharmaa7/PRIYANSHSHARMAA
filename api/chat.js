export default async function handler(req, res) {
if (req.method !== "POST") {
return res.status(405).json({
error: "Method not allowed"
});
}

try {
const { message } = req.body || {};

```
if (!message || typeof message !== "string") {
  return res.status(400).json({
    error: "Message is required"
  });
}

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  return res.status(500).json({
    error: "GEMINI_API_KEY is missing in Vercel."
  });
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
      systemInstruction: {
        parts: [
          {
            text:
              "You are Ask Priyansh AI, the AI assistant on Priyansh Sharma's portfolio website. Priyansh is a BCA student, future web developer and creator. Answer questions clearly, helpfully and briefly. You may discuss his portfolio, projects, web development, technology and learning journey. Do not invent private or personal information."
          }
        ]
      },
      contents: [
        {
          role: "user",
          parts: [
            {
              text: message
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

  return res.status(response.status).json({
    error:
      data?.error?.message ||
      "Gemini API request failed."
  });
}

const reply =
  data?.candidates?.[0]?.content?.parts
    ?.map(part => part.text || "")
    .join("")
    .trim();

if (!reply) {
  return res.status(500).json({
    error: "Gemini returned an empty response."
  });
}

return res.status(200).json({
  reply
});
```

} catch (error) {
console.error("Server error:", error);

```
return res.status(500).json({
  error: "Server error while connecting to Gemini."
});
```

}
}
