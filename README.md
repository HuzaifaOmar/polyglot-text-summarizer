# Polyglot Text Summarizer using MetaCall

## Overview

We'll build a text summarization application that:

1. Uses Python for AI processing (we'll call gemini API for now)
2. Exposes the functionality via a Node.js backend
3. Integrates both using MetaCall's polyglot capabilities

### Installation

1. **Install MetaCall**
    Choose your platform-specific installer from [here](https://github.com/metacall/install).
2. **Get Gemini API Key**
    Obtain your API key from [Google AI Studio](https://aistudio.google.com/app/apikey).

### Implementation

#### Python AI Component (summarizer.py)

```python
import google.generativeai as genai

# Initialize Gemini AI
genai.configure(api_key="<YOUR-API-KEY>")
model = genai.GenerativeModel("gemini-pro")

def summarize(text: str) -> str:
    """Summarize the input text using Gemini AI"""
    if not text.strip():
        return "Error: No text provided for summarization."

    prompt = (
        "Please summarize the following text concisely while maintaining key information.\n"
        "Format the response in markdown with:\n"
        "- A brief overview as a heading\n"
        "- Key points as a bulleted list\n"
        "- Any important quotes in blockquotes\n"
        "- Use bold and italic for emphasis where appropriate\n\n"
        f"Text to summarize:\n{text}"
    )

    response = model.generate_content(prompt)
    return response.text
```

### Nodejs Server (src/server.js)

```javascript
const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());
app.use(express.json());
const { metacall_load_from_file, metacall } = require("metacall");
const path = require("path");

// Initialize the Python script
const load = new Promise((resolve, reject) => {
  try {
     const scriptPath = path.join(__dirname, "summarizer.py");
     console.log("Loading...", scriptPath);
     metacall_load_from_file("py", [scriptPath]);
     resolve();
  } catch (ex) {
    reject(ex);
  }
});

const start = () => {
  app.use(express.json());

  app.post("/summarize", async (req, res) => {
    try {
      console.log("Received request body:", req.body); //  line
      const { text } = req.body;
      if (!text) {
        return res.status(400).send("Text is required.");
      }

      const summary = await metacall("summarize", text);
      res.json({ summary });
    } catch (error) {
      console.error("Error calling Python function:", error);
      res.status(500).json({ error: "Summarization failed." });
    }
  });

  return app.listen(3051, () => {
    console.log("Server listening on port 3051...");
  });
};

module.exports = (() => {
  let server = null;

  load
    .then(() => {
      server = start();
    })
    .catch(console.error);

  return {
    close: () => {
      console.log("Closing server...");
      server && server.close();
    },
  };
})();

```

### Setup & Execution

1. **Install Dependencies**

    ```bash
    metacall pip3 install google-generativeai
    metacall npm install express
    ```

2. **Start MetaCall CLI**

    ```bash
    metacall
    ```

3. **Load Application**

    ```bash
    load node ./src/server.js
    ```

4. **Run Frontend** (in separate terminal)

    ```bash
    npm install
    npm run dev
    ```

### Testing
Access the application at http://localhost:[frontend-port] and try:

- Input text in the provided field
- Click **Summarize**
- View formatted results with key points and quotes