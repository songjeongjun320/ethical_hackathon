// background.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background script is running...");

  if (message.text) {
    // Send text to your server for analysis and modification
    fetch("http://localhost:3000/api/groq", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: message.text }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Send the modified text back to content.js
        sendResponse({ modifiedText: data.result });
      })
      .catch((error) => {
        console.error("Error fetching from the server:", error);
        sendResponse({ error: "Failed to process text." });
      });

    // Required for async response
    return true;
  }
});
