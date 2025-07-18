import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

export const generateQNA = async (req, res) => {
  try {
    const userId = req.user;
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: 'Prompt is required' });
    }

    console.log('Generating Q&A for prompt:', prompt);

    const qnaData = await generateQNAFromPrompt(prompt);

    if (!qnaData) {
      return res.status(500).json({ message: 'Failed to generate Q&A' });
    }

    res.status(200).json({
      message: 'Q&A generated successfully',
      data: qnaData,
      success: true
    });

  } catch (err) {
    console.error('Error in generateQNA:', err);
    res.status(500).json({
      message: 'Internal server error',
      error: err.message || 'Unknown error occurred'
    });
  }
};

const generateQNAFromPrompt = async (prompt) => {
  try {
    // Check if API key is available
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error('Google API key is not configured');
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const enhancedPrompt = `
You are a professional Q&A generator. Based on the user's request, generate comprehensive and relevant questions and answers.

User Request: "${prompt}"

Instructions:
- If the user asks for questions only, provide a numbered list of questions
- If the user asks for questions AND answers, provide each question followed by a detailed answer
- Make the content professional and informative
- Focus on the specific topic or company mentioned by the user
- Provide practical, interview-style questions when appropriate
- Format the response clearly for easy reading

Generate the Q&A content now:
    `;

    console.log('Calling Google AI API...');
    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();

    console.log('Google AI API response received');

    if (!text || text.trim().length === 0) {
      throw new Error('Empty response from Google AI');
    }

    return {
      content: text,
      source: 'Google Gemini AI',
      generatedAt: new Date().toISOString(),
      prompt: prompt
    };

  } catch (err) {
    console.error('Error generating Q&A:', err);
    
    // Provide a fallback response if AI fails
    if (err.message.includes('API key') || err.message.includes('quota') || err.message.includes('authentication')) {
      return generateFallbackQNA(prompt);
    }
    
    throw err;
  }
};

// Fallback Q&A generation when AI is unavailable
const generateFallbackQNA = (prompt) => {
  console.log('Using fallback Q&A generation for:', prompt);
  
  const fallbackContent = `
Based on your request about "${prompt}", here are some relevant questions and answers:

1. What is the main concept behind ${prompt}?
   Answer: ${prompt} involves understanding key principles and best practices in the field. It requires knowledge of fundamental concepts and their practical applications.

2. What are the key skills needed for ${prompt}?
   Answer: Important skills include technical proficiency, problem-solving abilities, communication skills, and staying updated with industry trends and best practices.

3. How can someone prepare for ${prompt}?
   Answer: Preparation involves studying core concepts, practicing hands-on exercises, reviewing common scenarios, and gaining practical experience through projects or internships.

4. What are common challenges in ${prompt}?
   Answer: Common challenges include staying current with rapidly evolving technologies, managing complex requirements, debugging issues, and maintaining code quality while meeting deadlines.

5. What are the career prospects in ${prompt}?
   Answer: The field offers diverse career opportunities including specialized roles, leadership positions, consulting opportunities, and the potential for continuous learning and growth.

Note: This is a fallback response. For more detailed and customized Q&A, please ensure the AI service is properly configured.
  `;

  return {
    content: fallbackContent,
    source: 'Fallback Generator',
    generatedAt: new Date().toISOString(),
    prompt: prompt
  };
};