import express, { Request, Response } from 'express';
import cors from 'cors';
import multer from 'multer';
import dotenv from "dotenv";
import { GoogleGenerativeAI } from '@google/generative-ai';
import { GoogleAIFileManager } from '@google/generative-ai/server';
import fs from "fs/promises"

dotenv.config();

const app = express();

// Set up CORS
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configure multer to handle file uploads
const upload = multer({ dest: 'uploads/' });  // Files will be saved in the 'uploads' directory temporarily

// Define the root endpoint
app.get('/', (req: Request, res: Response) => {
    res.send("<h1>Hello</h1>");
});

// Define the /notes endpoint to handle file uploads and content generation
app.post('/notes', upload.single('file'), async (req: Request, res: Response) => {
    try {
        // Check if a file is uploaded
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        // Get the file path and details
        const filePath = req.file.path;
        const originalName = req.file.originalname;
        const mimeType = req.file.mimetype;

        // Get the API key from environment variables
        const apiKey = process.env.G_API_KEY;
        if (!apiKey) {
            return res.status(500).json({ error: "API key is not defined" });
        }

        console.log("Processing /notes request...");

        // Initialize GoogleGenerativeAI
        const genAI = new GoogleGenerativeAI(apiKey);
        const fileManager = new GoogleAIFileManager(apiKey);

        // Upload the file to Google AI
        const uploadResponse = await fileManager.uploadFile(filePath, {
            mimeType,
            displayName: originalName,
        });

        console.log(`Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`);

        // Generate content based on the uploaded file
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent([
            {
                fileData: {
                    mimeType: uploadResponse.file.mimeType,
                    fileUri: uploadResponse.file.uri,
                },
            },
            { text: "Write detailed notes in markdown format with proper formatting, include every important thing." },
        ]);

        const generatedContent = result.response.text();

        // Clean up: Delete the file after processing
        await fs.unlink(filePath);

        // Send the response
        res.json({
            message: "Notes generated successfully",
            content: generatedContent,
        });

    } catch (error: unknown) {
        console.error("Error processing request:", error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate notes';
        res.status(500).json({ error: errorMessage });
    }
});

// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});