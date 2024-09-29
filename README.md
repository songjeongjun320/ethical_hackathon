# 🚀 Ethical Hackathon - Team E Project

## 🌟 Overview

This project, initiated by **Team E** for the **Ethical Hackathon**, aims to enhance online communication by providing users with positive alternatives to their comments and messages. Inspired by tools like **Grammarly** and other text-enhancing applications, our **Chrome Extension** actively monitors user input on various social media platforms and offers constructive rephrasing suggestions.

Instead of judging or criticizing the language users employ, our tool suggests, "How about rephrasing it this way to make it more positive?" This approach encourages a more constructive, respectful, and positive environment online.

## 🎯 Purpose

The primary goal of this project is to transform the language used by users across the internet into more positive expressions. By providing suggestions rather than judgments, we encourage a feedback-driven approach that can help reduce negativity in digital communication.

### 🔑 Key Features

- 📍 **Real-time Detection**: Actively monitors user-generated sentences or text inputs on popular social media platforms like Instagram, Facebook, and YouTube.
- ✨ **AI-Powered Suggestions**: Uses AI models (like OpenAI's language models) to analyze the user's input and offer rephrased suggestions in a more positive and constructive manner.
- 🛠️ **Custom Modal Popup**: Replaces traditional alert boxes with a custom-styled popup to present suggestions in a user-friendly manner.
- 🌐 **Multi-Platform Support**: Seamlessly integrates with Instagram, Facebook, and YouTube comment sections to provide feedback across different platforms.
- 🛑 **CORS Handling**: Includes server-side configuration to handle CORS (Cross-Origin Resource Sharing) policies, enabling smooth communication between the extension and the server.
- 🌈 **Positive Impact**: Aims to create a healthier and more supportive online environment by promoting the use of positive language in interactions.

## 🌈 Vision

We hope that this project will:

- 💬 Encourage users to adopt more positive language in their online interactions.
- 💡 Shift the perception of feedback by providing constructive suggestions instead of direct criticism.
- 🙌 Reduce the presence of negative or harmful language in online spaces, making the internet a safer and more welcoming environment for everyone.

## 📦 Architecture and Technology Stack

- **Frontend**: 
  - Chrome Extension using JavaScript for content scripts (`content.js`), background script (`background.js`), and popup modals.
  - Uses Mutation Observers to detect changes in DOM for real-time monitoring of user input fields.
- **Backend**: 
  - A Node.js server with Express to handle API requests.
  - Utilizes OpenAI’s text generation models (or other models) for generating positive rephrasing suggestions.
  - Includes CORS configuration to manage cross-origin requests.
- **Languages**: JavaScript, HTML, CSS.
- **Platforms**: Instagram, Facebook, YouTube.

## 🚀 How to Get Started

To run the project locally, follow these steps:

### 1. Clone the Repository

```bash
git clone https://github.com/songjeongjun320/ethical_hackathon
```

### 2. Install Node.js Dependencies
Navigate to the project directory and install the required dependencies:
```bash
npm install
```
Install any additional packages like the AI model SDK you are using (e.g., groq-sdk):
```bash
npm install groq-sdk
```

### 3. Run the Backend Server
Start the development server using the following command:
```bash
npm run dev
```
The server will start running on http://localhost:3000.

### 4. Set Up the Chrome Extension
1. Open the Chrome browser and go to chrome://extensions/.
2. Enable Developer mode using the toggle in the upper right corner.
3. Click on Load unpacked and select the chrome_extension folder located in your project directory.
4. The extension should now appear in your list of installed extensions.

### 5. Access the Application
Once the server is running, open your browser and navigate to http://localhost:3000 to see the application in action.

### 🛠️ Usage Instructions
1. With the Chrome extension installed and enabled, navigate to a social media platform like Instagram, Facebook, or YouTube.
2. When typing a comment, the extension listens for your input in real-time.
3. After you press Enter, the extension sends the comment text to the server, which processes it using the AI model.
4. A custom popup modal will appear, offering a positive suggestion for your comment. You can then review and apply the suggestion as you see fit.

### 📌 Notes
- Popup Modal: Instead of using a standard alert box, the extension utilizes a custom-styled popup for a more visually appealing experience.
- CORS Configuration: Ensure that the backend server is configured with the correct CORS policy to accept requests from the Chrome extension.
- Platform-Specific Comment Detection: The extension has different logic to detect comment boxes on Instagram, Facebook, and YouTube, ensuring seamless operation across platforms.


# You can now copy and paste this content into your `README.md` file. This time, all code blocks are properly enclosed to ensure correct markdown formatting.
