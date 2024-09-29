// content.js
document.addEventListener("DOMContentLoaded", () => {
  console.log("Content script loaded and running...");

  // Monitor comment input boxes on Instagram
  const commentBox = document.querySelector("textarea"); // Assuming Instagram's comment box is a textarea

  // Listen for submit action (this may vary depending on Instagram's exact HTML structure)
  commentBox?.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      // Assuming pressing Enter submits the comment
      event.preventDefault();

      const inputText = commentBox.value;
      // Send input text to background script for analysis
      chrome.runtime.sendMessage({ text: inputText }, (response) => {
        if (response.modifiedText) {
          alert(`How about this? \n${response.modifiedText}`);
        }
      });
    }
  });
});
