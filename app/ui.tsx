"use client";

import { useState, useEffect } from "react";
import { supabase } from "../lib/supabaseClient";

const offensiveWords = {
  racialSlurs: [
    "nigga",
    "nigger",
    "chink",
    "gook",
    "jap",
    "slope",
    "slant",
    "zipperhead",
    "spic",
    "beaner",
    "wetback",
    "cracker",
    "honky",
    "gringo",
    "redskin",
    "savages",
    "sandnigger",
    "camel jockey",
    "towelhead",
    "terrorist",
    "wog",
    "kike",
    "heeb",
    "gypsy",
    "pikey",
    "wop",
    "dago",
    "paki",
  ],
  culturalOrReligiousInsults: [
    "infidel",
    "heathen",
    "zionist",
    "islamist",
    "jihadi",
    "muzzie",
    "christ-killer",
  ],
  genderOrSexualityInsults: [
    "sissy",
    "tranny",
    "queer",
    "fag",
    "dyke",
    "homo",
    "nancy boy",
  ],
  slangForAsians: [
    "chink",
    "gook",
    "jap",
    "nip",
    "rice nigger",
    "yellow skin",
    "oriental",
    "dog eater",
    "bat eater",
  ],
  blackOrAfricanInsults: [
    "nigga",
    "nigger",
    "monkey",
    "jigaboo",
    "coon",
    "spook",
    "sambo",
    "tar baby",
    "cotton picker",
    "porch monkey",
    "ape",
    "jungle bunny",
  ],
  whiteOrEuropeanInsults: [
    "cracker",
    "honky",
    "white trash",
    "redneck",
    "hillbilly",
    "gringo",
    "pasty",
    "pale face",
    "mayo",
  ],
  hispanicOrLatinoInsults: [
    "spic",
    "beaner",
    "wetback",
    "greaser",
    "border hopper",
    "pepper belly",
    "mojado",
    "taco bender",
    "cholo",
  ],
  middleEasternInsults: [
    "sandnigger",
    "camel jockey",
    "towelhead",
    "terrorist",
    "raghead",
    "aladdin",
    "bomb maker",
    "desert monkey",
  ],
  nativeAmericanInsults: [
    "redskin",
    "injun",
    "savage",
    "wagon burner",
    "chief",
    "squaw",
    "teepee creeper",
    "corn shucker",
  ],
  jewishInsults: [
    "kike",
    "heeb",
    "jewboy",
    "hymie",
    "sheeny",
    "christ-killer",
    "penny pincher",
    "shylock",
  ],
  asianInsults: [
    "chink",
    "gook",
    "jap",
    "nip",
    "rice nigger",
    "slant-eye",
    "sloper",
    "yellow skin",
    "oriental",
    "dog eater",
    "bat eater",
  ],
  generalOffensivePhrases: [
    "go back to your country",
    "you people",
    "speak english",
  ],
};

// Helper function to detect offensive words in the input text
const detectOffensiveWords = (text: string) => {
  const detectedCategories: string[] = [];
  const lowerCaseText = text.toLowerCase();

  for (const category in offensiveWords) {
    const words = offensiveWords[category as keyof typeof offensiveWords]; // Explicitly type category
    for (let word of words) {
      if (lowerCaseText.includes(word)) {
        detectedCategories.push(category);
        break; // Break out of the loop after the first offensive word is found in this category
      }
    }
  }
  return detectedCategories.length > 0 ? detectedCategories : null;
};

export default function Home() {
  const [inputText, setInputText] = useState("");
  const [submittedText, setSubmittedText] = useState("");
  const [modifiedText, setModifiedText] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("Supabase client initialized:", !!supabase);
  }, []);

  const handleInputChange = (e: any) => {
    setInputText(e.target.value);
  };

  // Function to handle the form submission logic
  const handleSubmit = async () => {
    setSubmittedText(inputText);
    setIsLoading(true);
    setModifiedText("");
    console.log("Analyzing text...");

    // Check for offensive words
    const detectedCategories = detectOffensiveWords(inputText);
    if (detectedCategories) {
      console.log("Offensive words detected:", detectedCategories);
      setModifiedText(
        `Do you know what does "<strong>${inputText}</strong>" mean?`
      );
      setIsLoading(false);
      return; // Exit early since offensive words were found
    }

    // Existing logic for calling APIs remains unchanged
    try {
      // Call Hugging Face API for sentiment analysis
      const sentimentResponse = await fetch("/api/hf_sentiment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      const sentimentResult = await sentimentResponse.json();
      console.log("Sentiment analysis result:", sentimentResult);

      if (
        Array.isArray(sentimentResult) &&
        sentimentResult.length > 0 &&
        sentimentResult[0].length > 0
      ) {
        const sentiment = sentimentResult[0][0].label;
        console.log("Detected sentiment:", sentiment);

        if (sentiment === "NEG") {
          console.log("Negative sentiment detected. Calling Groq API...");
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

  // Add keydown listener for the Enter key
  const handleKeyDown = (e: any) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent the default behavior of the Enter key
      handleSubmit(); // Call the handleSubmit function
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
        onKeyDown={handleKeyDown} // Add this line to handle the Enter key press
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
          <p
            dangerouslySetInnerHTML={{
              __html:
                !modifiedText && !submittedText
                  ? ""
                  : modifiedText === submittedText
                  ? "You don't need us..."
                  : modifiedText || submittedText,
            }}
          ></p>
        )}
      </div>
    </div>
  );
}
