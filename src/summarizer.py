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
