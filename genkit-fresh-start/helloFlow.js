require('dotenv').config();

const { genkit, z } = require('genkit');
const { googleAI } = require('@genkit-ai/google-genai');

// Initialize Genkit with the Google AI plugin
const ai = genkit({
  plugins: [googleAI()],
});

// Define the flow using the ai instance
const helloFlow = ai.defineFlow(
  {
    name: 'helloFlow',
    inputSchema: z.string(),
    outputSchema: z.string(),
  },
  async (name) => {
    const { text } = await ai.generate({
      model: googleAI.model('gemini-2.0-flash-exp'),
      prompt: `Hello Gemini, my name is ${name}`,
    });
    console.log("Gemini's response:", text);
    return text;
  }
);

async function runMyFlow() {
  try {
    console.log("Running helloFlow with input 'Chris'...");
    const result = await helloFlow('Chris');
    console.log("\nFlow finished. Final result:", result);
  } catch (error) {
    console.error("Error running flow:", error);
  }
}

runMyFlow();
