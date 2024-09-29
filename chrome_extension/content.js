console.log("Content script loaded and running...");

let isListenerAttached = false; // To keep track if listener is already attached

const attachCommentListener = () => {
  if (isListenerAttached) return; // If the listener is already attached, return
  isListenerAttached = true; // Mark listener as attached

  // Listen for keydown events on the document body
  document.body.addEventListener("keydown", (event) => {
    try {
      // Find the comment box using the findCommentBox function
      const commentBox = findCommentBox();
      const inputText = commentBox
        ? (commentBox.value || commentBox.innerText || "").trim()
        : ""; // Handle both regular input and contenteditable elements

      // Check if the input box is empty, log an error, and exit the function
      if (!commentBox || !inputText) {
        console.error("Input box is empty or not found");
        return;
      }

      // Ensure the comment box is the currently focused element
      if (event.target === commentBox) {
        console.log("Keydown event detected:", event.key);

        // Check if the Enter key is pressed without Shift
        if (event.key === "Enter" && !event.shiftKey) {
          event.preventDefault(); // Prevent the default form submission behavior

          console.log(
            "Sending message to background script with text:",
            inputText
          );

          // Check if chrome.runtime is still valid before sending the message
          if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
            chrome.runtime.sendMessage({ text: inputText }, (response) => {
              // Handle the response from the background script
              if (response && response.modifiedText) {
                alert(
                  `How about changing it to this?\n${response.modifiedText}`
                );
              } else {
                console.error(
                  "No response received or error:",
                  response ? response.error : "Unknown error"
                );
              }
            });
          } else {
            console.error("Extension context is invalid or not available.");
          }
        }
      }
    } catch (error) {
      // Log any errors that occur during the execution of the code
      console.error("An error occurred:", error);
    }
  });
};

// Function to find the comment box based on the current URL
const findCommentBox = () => {
  const url = window.location.href;
  console.log(url);

  if (url.includes("instagram.com")) {
    console.log("Detected it is Instagram");
    return document.querySelector(
      'textarea[placeholder="댓글 달기..."], textarea[placeholder="Add a comment..."]'
    );
  } else if (url.includes("youtube.com")) {
    console.log("Detected it is YouTube");
    // Check for the editable div in the YouTube comment box
    return document.querySelector(
      '#contenteditable-root[contenteditable="true"], ytd-commentbox #contenteditable-root'
    );
  }

  return null; // No matching comment box found
};

// Create a MutationObserver to watch for changes in the DOM
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    const commentBoxFound = findCommentBox();
    if (commentBoxFound) {
      console.log("Comment box found:", commentBoxFound);
      observer.disconnect(); // Stop observing once the comment box is found
      attachCommentListener(); // Attach the listener after finding the comment box
    }
  });
});

// Start observing the document body for changes in the DOM tree
observer.observe(document.body, {
  childList: true,
  subtree: true,
});

// Attach the comment listener initially
attachCommentListener();
