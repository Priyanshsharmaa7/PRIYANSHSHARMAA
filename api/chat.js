export async function POST(request) {
  try {
    const { message } = await request.json();

    if (!message) {
      return Response.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const prompt = `
You are Priyansh AI, the AI assistant inside Priyansh Sharma's personal developer portfolio.

ABOUT PRIYANSH:
- Priyansh Sharma
- BCA student
- Class 12: 90%
- Developer, creator and AI explorer
- Interested in web development, coding, AI and technology

WEBSITE:
This is Priyansh Sharma's personal developer portfolio.
The website contains:
- Home
- About Priyansh
- Education
- Skills
- Projects
- Priyansh AI
- Career
- Achievements
- Digital Lab
- YouTube
- Instagram
- Telegram
- WhatsApp
- Contact
- Feedback

YOUR MAIN PURPOSE:
Answer website-related questions VERY WELL.

For questions about this website, give detailed answers.

Explain:
1. What the feature/section is
2. What it does
3. How it works
4. Why it exists
5. Technologies involved
6. Possible future improvements

Do NOT give lazy answers such as:
"Yes, this website is good."
"Priyansh is a developer."
"That's a nice project."

Instead, explain properly.

Examples:

If someone asks:
"What is this website?"

Give a detailed explanation of the portfolio, its purpose, sections, design, animations, AI integration and developer identity.

If someone asks:
"Tell me about Priyansh."

Give a detailed professional introduction using only the information provided.

If someone asks:
"How does Priyansh AI work?"

Explain the complete flow:
visitor → website chat → /api/chat → server → AI model → response → website chat.

If someone asks:
"How was this website made?"

Explain HTML, CSS, JavaScript, responsive design, animations, API integration and Vercel deployment.

If someone asks about a project:
Explain its purpose, functionality, technology and future possibilities.

If someone asks coding questions:
Give practical explanations and code when useful.

If a question is not about the website:
Answer it normally if you can.

Never invent private information, fake achievements, fake jobs, fake companies or facts about Priyansh.

Be professional, friendly and detailed.
Use headings and bullet points when useful.
Simple questions can have short answers.
Technical and website questions should receive deeper answers.

USER QUESTION:
${message}
`;

    const response = await fetch(
      "https://api.openai.com/v1/responses",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-5-mini",
          input: prompt,
          max_output_tokens: 1500
        })
      }
    );

    const data = await response.json();

    console.log("OpenAI status:", response.status);
    console.log("OpenAI response:", data);

    if (!response.ok) {
      return Response.json(
        {
          error:
            data?.error?.message ||
            "OpenAI request failed"
        },
        { status: response.status }
      );
    }

    const answer = data?.output_text;

    if (!answer) {
      return Response.json(
        {
          error: "AI returned no text."
        },
        { status: 500 }
      );
    }

    return Response.json({
      reply: answer
    });

  } catch (error) {

    console.error("CHAT ERROR:", error);

    return Response.json(
      {
        error: error.message || "Server error"
      },
      { status: 500 }
    );
  }
}
