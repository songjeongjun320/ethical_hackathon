import offensiveWords from "./lib/offensivewords";
import offensiveWords from "./lib/offensivewords";

console.log("Content script loaded and running...");

let isListenerAttached = false; // To keep track if listener is already attached

// Define the list of offensive words (add more words/categories as needed)
const offensiveWords = offensiveWords;
// Helper function to detect offensive words in the input text
const detectOffensiveWords = (text) => {
  const detectedCategories = [];
  const lowerCaseText = text.toLowerCase();

  for (const category in offensiveWords) {
    for (let word of offensiveWords[category]) {
      if (lowerCaseText.includes(word)) {
        console.log(
          `Offensive word detected: "${word}" in category: "${category}"`
        );

        // Check for specific categories and display an alert if detected
        if (
          category === "racialSlurs" ||
          category === "culturalOrReligiousInsults" ||
          category === "slangForAsians"
        ) {
          alert(`Do you know what does "${word}" mean?`);
          return null; // Exit early, no need to process further or send to API
        }

        detectedCategories.push(category);
        break; // Break out of the loop after the first offensive word is found in the category
      }
    }
  }

  return detectedCategories.length > 0 ? detectedCategories : null;
};

// Helper function to send message to background script
const sendMessageToBackground = (text, commentBox, event) => {
  // Check for offensive words before sending the request
  const detectedOffensiveWords = detectOffensiveWords(text);

  if (chrome && chrome.runtime && chrome.runtime.sendMessage) {
    if (detectedOffensiveWords) {
      // If offensive words are detected, send the message to modify the text
      chrome.runtime.sendMessage(
        {
          text: `This sentence has ${detectedOffensiveWords.join(
            ", "
          )} type word(s). Make it nicer. Just result.`,
        },
        (response) => {
          if (response && response.modifiedText) {
            alert(`How about changing it to this?\n${response.modifiedText}`);
            // Clear the comment box content to prevent submission
            if (commentBox) {
              commentBox.value = ""; // For textarea elements
              commentBox.innerText = ""; // For contenteditable elements
            }
            // Prevent the default submission behavior
            event.preventDefault();
            event.stopPropagation();
          } else {
            console.error(
              "No response received or error:",
              response ? response.error : "Unknown error"
            );
          }
        }
      );
    } else {
      // If no offensive words, use the existing sentiment analysis logic
      chrome.runtime.sendMessage({ text: text }, (response) => {
        if (response && response.modifiedText) {
          alert(`How about changing it to this?\n${response.modifiedText}`);
          // Clear the comment box content to prevent submission
          if (commentBox) {
            commentBox.value = ""; // For textarea elements
            commentBox.innerText = ""; // For contenteditable elements
          }
          // Prevent the default submission behavior
          event.preventDefault();
          event.stopPropagation();
        } else if (response && response.allowPost) {
          console.log("Positive sentiment detected, allowing post.");
          // Do nothing to let the comment post proceed
        } else {
          console.error(
            "No response received or error:",
            response ? response.error : "Unknown error"
          );
          // Clear the comment box to prevent submission in case of error
          if (commentBox) {
            commentBox.value = "";
            commentBox.innerText = "";
          }
          // Prevent the default submission behavior
          event.preventDefault();
          event.stopPropagation();
        }
      });
    }
  } else {
    console.error("Extension context is invalid or not available.");
  }
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
    return document.querySelector(
      '#contenteditable-root[contenteditable="true"], ytd-commentbox #contenteditable-root'
    );
  }

  return null; // No matching comment box found
};

// Attach comment listener for both keydown and button click events
const attachCommentListener = () => {
  if (isListenerAttached) return; // If the listener is already attached, return
  isListenerAttached = true; // Mark listener as attached

  // Common function to handle comment input and submission
  const handleCommentSubmission = (event, inputText, commentBox) => {
    console.log("Sending message to background script with text:", inputText);
    event.preventDefault(); // Prevent the default form submission behavior
    event.stopPropagation(); // Stop the event from propagating further
    sendMessageToBackground(inputText, commentBox, event);
  };

  // Listen for keydown events on the document body
  document.body.addEventListener("keydown", (event) => {
    try {
      const commentBox = findCommentBox();
      const inputText = commentBox
        ? (commentBox.value || commentBox.innerText || "").trim()
        : "";
      if (!commentBox || !inputText) {
        console.error("Input box is empty or not found");
        return;
      }

      if (
        event.target === commentBox &&
        event.key === "Enter" &&
        !event.shiftKey
      ) {
        console.log("Keydown event detected:", event.key);
        handleCommentSubmission(event, inputText, commentBox);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  });

  // Listen for click events on the document body (for comment button clicks)
  document.body.addEventListener("click", (event) => {
    try {
      const commentBox = findCommentBox();
      const inputText = commentBox
        ? (commentBox.value || commentBox.innerText || "").trim()
        : "";

      // Instagram and YouTube comment button selectors (update these as needed)
      const instagramButton = event.target.closest(
        '[role="button"][tabindex="0"]'
      );
      const youtubeButton = event.target.closest(
        ".yt-spec-touch-feedback-shape__fill"
      );

      // Check if the button and input box exist and are valid
      if ((instagramButton || youtubeButton) && commentBox && inputText) {
        console.log("Comment button clicked");
        handleCommentSubmission(event, inputText, commentBox);
      }
    } catch (error) {
      console.error("An error occurred:", error);
    }
  });
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
