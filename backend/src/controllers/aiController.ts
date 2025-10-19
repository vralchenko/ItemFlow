import { Request, Response } from 'express';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is not set.");
}

const genAI = new GoogleGenerativeAI(apiKey);

interface SuggestionRequestBody {
    categoryName: string;
}

export const suggestItemName = async (req: Request<{}, {}, SuggestionRequestBody>, res: Response) => {
    const { categoryName } = req.body;

    if (!categoryName) {
        return res.status(400).json({ error: 'Category name is required.' });
    }

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        const prompt = `Suggest 5 creative and short names for a new item in the "${categoryName}" category. Respond with ONLY a valid JSON array of strings. Do not include markdown, backticks, or any other text. Example response: ["Name 1", "Name 2", "Name 3", "Name 4", "Name 5"]`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();

        const suggestions: string[] = JSON.parse(text);
        res.json(suggestions);

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        res.status(500).json({ error: "Failed to get suggestions from AI." });
    }
};