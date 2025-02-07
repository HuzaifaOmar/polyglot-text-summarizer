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
