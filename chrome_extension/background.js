console.log("Background script is running...");

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Background script received message:", message);

  if (message.text) {
    console.log("Starting fetch request with text:", message.text);

    // Attempt to fetch from the server
    fetch("http://localhost:3000/api/groq", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: message.text }),
    })
      .then((response) => {
        console.log("Fetch response received:", response);

        // Check if response is okay
        if (!response.ok) {
          throw new Error(`Server responded with status: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        console.log("Data from server:", data);
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
