console.log("Background script is running...");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background script received message:", message);

  if (message.text) {
    console.log("Starting sentiment analysis with text:", message.text);

    // Step 1: Check sentiment using /api/hf
    fetch("http://localhost:3000/api/hf_sentiment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: message.text }),
    })
      .then((response) => {
        console.log("Sentiment analysis response received:", response);
        if (!response.ok) {
          throw new Error(
            `Sentiment analysis failed with status: ${response.status}`
          );
        }
        return response.json();
      })
      .then((sentimentData) => {
        console.log("Sentiment analysis result:", sentimentData);

        // Step 2: Check if the NEG score is above 0.8 (80%)
        const negativeScoreObj = sentimentData[0].find(
          (s) => s.label === "NEG"
        );
        const positiveScoreObj = sentimentData[0].find(
          (s) => s.label === "POS"
        );

        console.log(negativeScoreObj);
        console.log(positiveScoreObj);

        if (negativeScoreObj && negativeScoreObj.score > 0.8) {
          console.log(
            "Negative sentiment detected with high confidence, proceeding to /api/groq"
          );

          // Step 3: Make fetch request to /api/groq
          return fetch("http://localhost:3000/api/groq", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ text: message.text }),
          });
        } else if (positiveScoreObj && positiveScoreObj.score > 0.5) {
          console.log(
            "Sentiment is not highly negative, no further action required."
          );
          sendResponse({ allowPost: true }); // Explicitly indicate that the comment can be posted
          return null; // Skip the next then/catch chain
        }
      })
      .then((response) => {
        if (!response) return; // Exit if the sentiment was not highly negative

        console.log("Fetch response from /api/groq received:", response);
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        if (data) {
          console.log("Data from /api/groq:", data);
          sendResponse({ modifiedText: data.result });
        }
      })
      .catch((error) => {
        console.error("Error in processing:", error);
        sendResponse({ error: "Failed to process text." });
      });

    // Required for async response
    return true;
  }
});
