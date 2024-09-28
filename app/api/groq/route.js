import { NextResponse } from "next/server"; // Import Next.js response handler
import { Groq } from "groq-sdk"; // Import Groq SDK

// Initialize Groq client with API key from environment variables
const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req) {
  // Parse JSON request body to extract the 'text' field
  const { text } = await req.json();

  try {
    // Log API key and input text for debugging purposes
    console.log("API Key:", process.env.GROQ_API_KEY);
    console.log("Input Text:", text);

    // If no input text is provided, return a 400 (Bad Request) response
    if (!text) {
      return NextResponse.json(
        { error: "No input text provided" },
        { status: 400 }
      );
    }

    // Call the Groq API to create a completion using the provided input text
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user", // Set the role to 'user' as required by Groq API
          content: `Make sentence nicer. Just result. ${text}`, // Pass the input text
        },
      ],
      model: "llama3-8b-8192", // Specify the model name (ensure it’s correct)
    });

    // Log the API response for debugging purposes
    console.log("API Response:", response);

    // Check if the response contains valid content, otherwise return an error
    if (
      response.choices &&
      response.choices[0] &&
      response.choices[0].message &&
      response.choices[0].message.content
    ) {
      console.log("API Response Content:", response.choices[0].message.content);
      // If a valid response is received, return the result as JSON
      return NextResponse.json({ result: response.choices[0].message.content });
    } else {
      // If no valid response, return a 500 (Internal Server Error) response
      return NextResponse.json(
        { error: "No response from LLaMA" },
        { status: 500 }
      );
    }
  } catch (error) {
    // Log any errors encountered during the API call
    console.error("Error:", error.message);

    // Return a 500 (Internal Server Error) response with the error message
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
