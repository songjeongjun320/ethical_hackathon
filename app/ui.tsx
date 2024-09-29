"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const [modifiedText, setModifiedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("Supabase client initialized:", !!supabase);
  }, []);

  const handleInputChange = (e) => {
    setInputText(e.target.value);
  };

  const handleSubmit = async () => {
    setSubmittedText(inputText);
    setIsLoading(true);
    setModifiedText("");
    console.log("Analyzing sentiment...");

    try {
      // Call Hugging Face API for sentiment analysis
      const sentimentResponse = await fetch("/api/hf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      const sentimentResult = await sentimentResponse.json();
      console.log("Sentiment analysis result:", sentimentResult);

      // Check sentiment analysis results
      if (
        Array.isArray(sentimentResult) &&
        sentimentResult.length > 0 &&
        sentimentResult[0].length > 0
      ) {
        const sentiment = sentimentResult[0][0].label;
        console.log("Detected sentiment:", sentiment);

        if (sentiment === "NEG") {
          console.log("Negative sentiment detected. Calling Groq API...");
          // 調用 Groq API 來改善文本
          const groqResponse = await fetch("/api/groq", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: `Make sentence nicer. Result length must be similar to the original sentence. "${inputText}"`,
            }),
          });

          const groqData = await groqResponse.json();
          console.log("Groq API response:", groqData);
          setModifiedText(groqData.result);

          // Store data in Supabase
          console.log("Attempting to insert data into Supabase...");
          try {
            const { data, error } = await supabase
              .from("sentence_corrections")
              .insert([
                { input_text: inputText, output_text: groqData.result },
              ]);

            if (error) {
              console.error("Error inserting data into Supabase:", error);
            } else {
              console.log("Data successfully stored in Supabase:", data);
            }
          } catch (supabaseError) {
            console.error(
              "Caught error while inserting into Supabase:",
              supabaseError
            );
          }
        } else {
          console.log("Positive or neutral sentiment. No modification needed.");
          setModifiedText(inputText);
        }
      } else {
        console.error(
          "Unexpected sentiment analysis result format:",
          sentimentResult
        );
        setModifiedText(inputText);
      }
    } catch (error) {
      console.error("Error:", error);
      setModifiedText(inputText);
    } finally {
      setIsLoading(false);
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
        onChange={handleInputChange}
      />

      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-700"
        onClick={handleSubmit}
        disabled={isLoading}
      >
        {isLoading ? "Processing..." : "Submit"}
      </button>

      <div className="mt-8 p-4 w-full max-w-2xl bg-gray-100 border border-gray-300 rounded-md">
        <h2 className="text-2xl font-semibold mb-4 text-black">
          How about this?
        </h2>
        {isLoading ? (
          <div className="flex items-center">
            <div className="loader mr-2"></div>
            <p>Let's be more nice...</p>
          </div>
        ) : (
          <p>{modifiedText || submittedText}</p>
        )}
      </div>
    </div>
  );
}
