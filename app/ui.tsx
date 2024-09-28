"use client";

import { useState } from "react";

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [submittedText, setSubmittedText] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(e.target.value);
  };

  const handleSubmit = () => {
    setSubmittedText(inputText);
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
      >
        Submit
      </button>

      <div className="mt-8 p-4 w-full max-w-2xl bg-gray-100 border border-gray-300 rounded-md">
        <h2 className="text-2xl font-semibold mb-4 text-black">
          How about this?
        </h2>
        <p>{submittedText}</p>
      </div>
    </div>
  );
}
