import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { text } = await req.json(); // Extract the text sent by the user
    console.log(text);
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "user", content: `Make this sentence more positive: ${text}` },
      ],
      max_tokens: 100,
    });

    return new Response(
      JSON.stringify({
        modifiedText: response.choices[0].message.content.trim(),
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error with OpenAI API:", error);
    return new Response(
      JSON.stringify({ error: "Failed to process the request" }),
      { status: 500 }
    );
  }
}
