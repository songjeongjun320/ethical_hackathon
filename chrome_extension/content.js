console.log("Content script loaded and running...");

let isListenerAttached = false; // To keep track if listener is already attached

const attachCommentListener = () => {
  if (isListenerAttached) return; // If the listener is already attached, return
  isListenerAttached = true; // Mark listener as attached

  document.body.addEventListener("keydown", (event) => {
    const commentBox = document.querySelector(
      'textarea[placeholder="댓글 달기..."], textarea[placeholder="Add a comment..."]'
    );

    if (commentBox && event.target === commentBox) {
      console.log("Keydown event detected:", event.key);
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        const inputText = commentBox.value;

        console.log(
          "Sending message to background script with text:",
          inputText
        );
        chrome.runtime.sendMessage({ text: inputText }, (response) => {
          if (response && response.modifiedText) {
            alert(`How about changing it to this?\n${response.modifiedText}`);
          } else {
            console.error(
              "No response received or error:",
              response ? response.error : "Unknown error"
            );
          }
        });
      }
    }
  });
};

// Create a MutationObserver to watch for changes in the DOM
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    const commentBoxFound = document.querySelector(
      'textarea[placeholder="댓글 달기..."], textarea[placeholder="Add a comment..."]'
    );
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
