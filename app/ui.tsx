"use client";

import { useState } from "react";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const [modifiedText, setModifiedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Handle input change in the textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  // Handle form submission
  const handleSubmit = async () => {
    setSubmittedText(inputText);
    setIsLoading(true);
    setModifiedText(""); // Clear the modified text while processing
    console.log("Waiting for the result..."); // Log message indicating processing

    {
      ("Here should be the code to detect whether the user's sentence is positive or negavite. ");
    }
    {
      ("If the user's sentence is positive, don't call groq api");
    }
    {
      ("If the user's sentence is negative, call groq api to make the sentence nicer");
    }

    try {
      console.log("Starting fetch request to groq...");
      const response = await fetch("/api/groq", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: `Make sentence nicer. Result length must be similar to the original sentence. "${inputText}"`,
        }),
      });

      console.log("Fetch request to groq completed.");
      const data = await response.json();
      console.log("data from groq : ", data);

      if (response.ok) {
        setModifiedText(data.result); // Save the response from the API
      } else {
        console.error("Error:", data.error);
      }
    } catch (error) {
      console.error("Failed to fetch:", error);
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-black text-black">
      <h1 className="text-4xl font-bold mb-8 text-white">
        Why don't you be more nice?
      </h1>

      <textarea
        className="border border-gray-300 p-4 w-full max-w-2xl h-32 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
        placeholder="Type something here..."
        value={inputText}
        onChange={handleInputChange} // Handle textarea input changes
      />

      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
        onClick={handleSubmit} // Trigger the submit handler
        disabled={isLoading} // Disable the button while loading
      >
        {isLoading ? "Processing..." : "Submit"}{" "}
        {/* Show "Processing..." while loading */}
      </button>

      <div className="mt-8 p-4 w-full max-w-2xl bg-gray-100 border border-gray-300 rounded-md">
        <h2 className="text-2xl font-semibold mb-4 text-black">
          How about this?
        </h2>
        {/* Show loading message or modified text */}
        {isLoading ? (
          <div className="flex items-center">
            <div className="loader mr-2"></div>{" "}
            {/* You can replace this with a spinner or text */}
            <p>Let's be more nice...</p>
          </div>
        ) : (
          <p>{modifiedText || submittedText}</p> // Show modified text or fallback to the original input
        )}
      </div>
    </div>
  );
}
