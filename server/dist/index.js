"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const dotenv_1 = __importDefault(require("dotenv"));
const generative_ai_1 = require("@google/generative-ai");
const server_1 = require("@google/generative-ai/server");
const promises_1 = __importDefault(require("fs/promises"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Set up CORS
app.use((0, cors_1.default)({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
// Configure multer to handle file uploads
const upload = (0, multer_1.default)({ dest: 'uploads/' }); // Files will be saved in the 'uploads' directory temporarily
// Define the root endpoint
app.get('/', (req, res) => {
    res.send("<h1>Hello</h1>");
});
// Define the /notes endpoint to handle file uploads and content generation
app.post('/notes', upload.single('file'), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
        const genAI = new generative_ai_1.GoogleGenerativeAI(apiKey);
        const fileManager = new server_1.GoogleAIFileManager(apiKey);
        // Upload the file to Google AI
        const uploadResponse = yield fileManager.uploadFile(filePath, {
            mimeType,
            displayName: originalName,
        });
        console.log(`Uploaded file ${uploadResponse.file.displayName} as: ${uploadResponse.file.uri}`);
        // Generate content based on the uploaded file
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = yield model.generateContent([
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
        yield promises_1.default.unlink(filePath);
        // Send the response
        res.json({
            message: "Notes generated successfully",
            content: generatedContent,
        });
    }
    catch (error) {
        console.error("Error processing request:", error);
        const errorMessage = error instanceof Error ? error.message : 'Failed to generate notes';
        res.status(500).json({ error: errorMessage });
    }
}));
// Start the server
app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
