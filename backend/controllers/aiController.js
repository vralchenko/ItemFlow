const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize the Google AI client with the key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.suggestItemName = async (req, res) => {
    const { categoryName } = req.body;

    if (!categoryName) {
        return res.status(400).json({ error: 'Category name is required.' });
    }

    // Get the generative model
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    // This is the "prompt" - our instruction to the AI.
    const prompt = `Suggest 5 creative and short names for a new item in the "${categoryName}" category. Respond with ONLY a valid JSON array of strings. Do not include markdown, backticks, or any other text. Example response: ["Name 1", "Name 2", "Name 3", "Name 4", "Name 5"]`;

    try {
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        // The AI's response is a string, which we need to parse into a JSON object
        const suggestions = JSON.parse(text);
        res.json(suggestions); // Send the array of names back to the frontend

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        res.status(500).json({ error: "Failed to get suggestions from AI." });
    }
};