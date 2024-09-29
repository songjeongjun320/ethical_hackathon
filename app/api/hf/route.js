import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Parse JSON request body to extract the 'text' field
    const { text } = await req.json();

    console.log("Analyzing sentiment for:", text);

    // If no input text is provided, return a 400 (Bad Request) response
    if (!text) {
      return NextResponse.json(
        { error: "No input text provided" },
        { status: 400 }
      );
    }

    const apiKey = process.env.HUGGING_FACE_API_KEY;

    // Call the Hugging Face API for sentiment analysis
    const response = await fetch(
      "https://api-inference.huggingface.co/models/finiteautomata/bertweet-base-sentiment-analysis",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ inputs: text }),
      }
    );

    const result = await response.json();
    console.log("Sentiment analysis result:", result);

    // Check if the response contains valid content, otherwise return an error
    if (Array.isArray(result) && result.length > 0 && Array.isArray(result[0]) && result[0].length > 0) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(
        { error: "Unexpected response from Hugging Face API" },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}