import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TextareaAutosize from "react-textarea-autosize";
import { FileText, Wand2, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (!text.trim()) return;

    setLoading(true);
    setSummary("");
    try {
      const response = await axios.post(
        "http://localhost:3051/summarize",
        { text }, 
        {
          headers: { "Content-Type": "application/json" },
        }
      );

      console.log("Response data:", response.data);
      if (!response.data) {
        throw new Error("No summary was generated");
      }

      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error details:", error);
      if (error instanceof Error) {
        setSummary(`Error: ${error.message}`);
      } else {
        setSummary("Error: Failed to generate summary. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            AI Text Summarizer
          </h1>
          <p className="text-gray-600">
            Transform your long text into concise summaries using Google's
            Gemini AI
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText className="text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-800">
                Input Text
              </h2>
            </div>
            <TextareaAutosize
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste your text here..."
              className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all min-h-[200px] resize-none"
            />
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSummarize}
              disabled={loading || !text.trim()}
              className="mt-4 w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Wand2 className="w-5 h-5" />
              )}
              Summarize
            </motion.button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center gap-2 mb-4">
              <FileText className="text-indigo-600" />
              <h2 className="text-xl font-semibold text-gray-800">Summary</h2>
            </div>
            <AnimatePresence mode="wait">
              {summary ? (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className={`p-4 rounded-lg min-h-[200px] prose prose-indigo max-w-none ${
                    typeof summary === "string" && summary.startsWith("Error")
                      ? "bg-red-50 text-red-600"
                      : "bg-gray-50"
                  }`}
                >
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {summary}
                  </ReactMarkdown>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 text-gray-400 bg-gray-50 rounded-lg min-h-[200px] flex items-center justify-center"
                >
                  Your summary will appear here
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default App;
