module.exports = async function (req, res) {
if (req.method !== "POST") {
return res.status(405).json({ error: "Method not allowed" });
}

try {
const message = req.body?.message;

```
if (!message) {
  return res.status(400).json({ error: "Message is required" });
}

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  return res.status(500).json({
    error: "GEMINI_API_KEY is missing."
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
      contents: [
        {
          role: "user",
          parts: [
            {
              text:
                "You are Ask Priyansh AI. Priyansh Sharma is a BCA student, future web developer and creator. Give helpful, clear and friendly answers. Do not invent private information.\n\nUser question: " +
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
  return res.status(response.status).json({
    error: data?.error?.message || "Gemini API request failed."
  });
}

const reply =
  data?.candidates?.[0]?.content?.parts?.[0]?.text;

if (!reply) {
  return res.status(500).json({
    error: "Gemini returned no response."
  });
}

return res.status(200).json({
  reply: reply
});
```

} catch (error) {
console.error("Server error:", error);

```
return res.status(500).json({
  error: error?.message || "Server error."
});
```

}
};
