import { GoogleGenerativeAI } from "@google/generative-ai";
import { createCanvas } from "canvas";
import cloudinary from "../config/cloudinary.js";
import Letter from "../models/letter.model.js";

export const generateCoverLetter = async (req, res) => {
  try {
    const userId = req.user; 
    const {
      prompt,
      name,
      email,
      phone,
      jobTitle,
      company,
      role,
      description,
      experience,
      skills,
      tone,
      companyAddress,
    } = req.body;

    if (!prompt) {
      return res.status(400).json({ message: "Prompt is required" });
    }

    // Generate letter content with AI
    const letterData = await generateLetterFromPrompt(prompt, {
      name,
      email,
      phone,
      jobTitle,
      company,
      role,
      description,
      experience,
      skills,
      tone,
      companyAddress,
    });

    if (!letterData) {
      return res.status(500).json({ message: "Failed to generate cover letter" });
    }

    // Render the letter on canvas (image buffer)
    const canvasImage = await generateLetterCanvas(letterData, {
      name,
      email,
      phone,
      company,
      companyAddress,
    });

    // Upload image buffer to Cloudinary
    const uploadImage = () =>
      new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "image", folder: "cover_letters" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );
        stream.end(canvasImage.buffer);
      });

    const uploadResultData = await uploadImage();

    // Save letter record in DB
    const newLetter = new Letter({
      userId,
      name,
      email,
      jobTitle,
      company,
      role,
      description,
      experience,
      tone,
      letterUrl: uploadResultData.secure_url,
    });

    await newLetter.save();

    res.status(200).json({
      message: "Cover letter generated successfully",
      data: {
        letter: letterData,
        letterUrl: newLetter.letterUrl,
      },
      success: true,
    });
  } catch (err) {
    console.error("Error in generateCoverLetter:", err);
    res.status(500).json({
      message: "Internal server error",
      error: err.message || "Unknown error occurred",
    });
  }
};

export const generateLetterFromPrompt = async (prompt, userInfo = {}) => {
  try {
    if (!process.env.GOOGLE_API_KEY) {
      throw new Error("Google API key is not configured");
    }

    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const enhancedPrompt = `
You are a professional cover letter writer.

Write a complete, professional cover letter using only the information provided below. Do not ask for additional information or include placeholders.

User Details:
- Name: ${userInfo.name || "Applicant Name"}
- Email: ${userInfo.email || "email@example.com"}
- Phone: ${userInfo.phone || "Phone Number"}
- Job Title: ${userInfo.jobTitle || "the position"}
- Company: ${userInfo.company || "the company"}
- Role Description: ${userInfo.description || ""}
- Experience: ${userInfo.experience || ""}
- Skills: ${userInfo.skills || ""}
- Tone: ${userInfo.tone || "Professional"}

The letter should include:

1. A professional header with the applicant’s contact info (name, email, phone).
2. The current date.
3. Recipient info: “Hiring Manager” and the company name.
4. An engaging introduction stating interest in the job.
5. Body paragraphs clearly explaining relevant experience, skills, and how the applicant adds value.
6. A polite and confident closing paragraph with a call to action.
7. A formal sign-off with the applicant’s name.

Make the letter concise (about 250-400 words), clear, and suitable to send without any further editing.
`;

    console.log("Calling Google AI API for cover letter...");
    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();

    console.log("Google AI API response received for cover letter");

    if (!text || text.trim().length === 0) {
      throw new Error("Empty response from Google AI");
    }

    return {
      content: text,
      source: "Google Gemini AI",
      generatedAt: new Date().toISOString(),
      prompt,
      userInfo,
    };
  } catch (error) {
    console.error("Error in generateLetterFromPrompt:", error);

    if (
      error.message.includes("API key") ||
      error.message.includes("quota") ||
      error.message.includes("authentication")
    ) {
      return generateFallbackCoverLetter(prompt, userInfo);
    }

    throw error;
  }
};

const generateLetterCanvas = async (letterData, userInfo = {}) => {
  const width = 850;
  const height = 1100;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext("2d");

  // Clean white background
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  // Professional black left border
  ctx.fillStyle = "#000000";
  ctx.fillRect(0, 0, 8, height);

  // Margins
  const leftMargin = 80;
  const rightMargin = width - 80;
  const contentWidth = rightMargin - leftMargin;

  let currentY = 80;

  // HEADER SECTION - Elegant Black & White Design
  ctx.fillStyle = "#000000";
  ctx.font = "bold 32px Arial";
  ctx.textAlign = "left";
  const userName = (userInfo.name || "Your Name").toUpperCase();
  ctx.fillText(userName, leftMargin, currentY);

  // Elegant underline for name
  currentY += 8;
  ctx.fillStyle = "#000000";
  ctx.fillRect(leftMargin, currentY, userName.length * 16, 3);

  currentY += 35;

  // Contact information with professional layout
  ctx.fillStyle = "#000000";
  ctx.font = "14px Arial";
  const contactInfo = [
    userInfo.email || "your.email@example.com",
    userInfo.phone || "Phone Number",
  ].filter(Boolean);

  contactInfo.forEach((info, index) => {
    const itemX = leftMargin + (index * 300);
    
    // Create small icon circles for contact info
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(itemX + 8, currentY, 6, 0, 2 * Math.PI);
    ctx.fill();
    
    // Icon symbols
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 8px Arial";
    ctx.textAlign = "center";
    const icon = index === 0 ? "✉" : "☎";
    ctx.fillText(icon, itemX + 8, currentY + 3);
    
    // Contact text
    ctx.fillStyle = "#000000";
    ctx.font = "12px Arial";
    ctx.textAlign = "left";
    ctx.fillText(info, itemX + 20, currentY + 4);
  });

  currentY += 50;

  // Designer separator line
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(leftMargin, currentY);
  ctx.lineTo(rightMargin, currentY);
  ctx.stroke();

  // Decorative elements
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = i % 2 === 0 ? "#000000" : "#ffffff";
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(leftMargin + (i * 15) + 8, currentY + 15, 3, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
  }

  currentY += 50;

  // Date with elegant formatting
  ctx.fillStyle = "#000000";
  ctx.font = "14px Arial";
  ctx.textAlign = "left";
  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  ctx.fillText(today, leftMargin, currentY);

  currentY += 50;

  // Recipient section with professional styling
  if (userInfo.company) {
    ctx.fillStyle = "#000000";
    ctx.font = "bold 14px Arial";
    ctx.fillText("HIRING MANAGER", leftMargin, currentY);
    currentY += 25;
    
    ctx.fillStyle = "#000000";
    ctx.font = "16px Arial";
    ctx.fillText(userInfo.company, leftMargin, currentY);
    currentY += 25;
    
    // Small decorative line under company name
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(leftMargin, currentY);
    ctx.lineTo(leftMargin + (userInfo.company || "Company").length * 8, currentY);
    ctx.stroke();
    
    currentY += 40;
  }

  // Letter content with professional typography
  ctx.fillStyle = "#000000";
  ctx.font = "13px Arial";

  const letterContent = letterData.content || "";

  // Clean content processing
  let processedContent = letterContent.replace(/^[\s\S]*?Dear\s+/i, "Dear ");

  // Split into paragraphs
  const paragraphs = processedContent
    .split("\n\n")
    .filter(
      (p) =>
        p.trim().length > 0 &&
        !p.match(/^\d{1,2}\/\d{1,2}\/\d{4}/) &&
        !p.match(/^[A-Z\s]+$/) &&
        !p.includes("@") &&
        !p.match(/^\+?\d/) &&
        p.trim().length > 10
    );

  // Process each paragraph with elegant formatting
  paragraphs.forEach((paragraph, i) => {
    if (currentY > height - 200) return;

    const trimmed = paragraph.trim();

    // Special formatting for greeting
    if (trimmed.startsWith("Dear")) {
      ctx.fillStyle = "#000000";
      ctx.font = "bold 14px Arial";
      ctx.fillText(trimmed, leftMargin, currentY);
      currentY += 35;
      return;
    }

    // Special formatting for closing
    if (
      trimmed.toLowerCase().includes("sincerely") ||
      trimmed.toLowerCase().includes("best regards") ||
      trimmed.toLowerCase().includes("thank you for considering")
    ) {
      currentY += 25;
    }

    // Regular paragraph with justified text
    ctx.fillStyle = "#000000";
    ctx.font = "13px Arial";
    const wrapped = wrapText(ctx, trimmed, contentWidth);
    
    wrapped.forEach((line, lineIndex) => {
      if (currentY > height - 200) return;
      
      // Add small bullet point for first line of each paragraph (except greeting/closing)
      if (lineIndex === 0 && i > 0 && !trimmed.toLowerCase().includes("sincerely") && !trimmed.toLowerCase().includes("thank you")) {
        ctx.fillStyle = "#000000";
        ctx.beginPath();
        ctx.arc(leftMargin + 5, currentY - 5, 2, 0, 2 * Math.PI);
        ctx.fill();
        ctx.fillText(line, leftMargin + 15, currentY);
      } else {
        ctx.fillText(line, leftMargin, currentY);
      }
      
      currentY += 20;
    });

    // Add paragraph spacing
    if (i < paragraphs.length - 1) currentY += 15;
  });

  // Professional signature section
  currentY += 40;
  if (currentY < height - 120) {
    ctx.fillStyle = "#000000";
    ctx.font = "14px Arial";
    ctx.fillText("Sincerely,", leftMargin, currentY);
    
    currentY += 50;
    
    // Signature with elegant underline
    ctx.fillStyle = "#000000";
    ctx.font = "bold 16px Arial";
    const signatureName = userInfo.name || "Your Name";
    ctx.fillText(signatureName, leftMargin, currentY);
    
    // Elegant signature underline
    currentY += 5;
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(leftMargin, currentY);
    ctx.lineTo(leftMargin + signatureName.length * 10, currentY);
    ctx.stroke();
  }

  // Professional footer design
  currentY = height - 80;
  
  // Footer separator with decorative pattern
  ctx.strokeStyle = "#000000";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(leftMargin, currentY);
  ctx.lineTo(rightMargin, currentY);
  ctx.stroke();

  // Decorative footer elements
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = "#000000";
    ctx.beginPath();
    ctx.arc(leftMargin + (i * 25), currentY + 15, 2, 0, 2 * Math.PI);
    ctx.fill();
  }

  currentY += 35;
  
  // Footer text
  ctx.fillStyle = "#666666";
  ctx.font = "11px Arial";
  ctx.textAlign = "center";
  ctx.fillText(
    "Generated by ElevateCV AI • Professional Cover Letter",
    width / 2,
    currentY
  );

  const buffer = canvas.toBuffer("image/png");
  const base64Image = buffer.toString("base64");
  const dataUrl = `data:image/png;base64,${base64Image}`;

  return { dataUrl, buffer };
};

const wrapText = (ctx, text, maxWidth) => {
  if (!text || text.trim().length === 0) return [];

  const words = text.split(" ");
  const lines = [];
  let line = "";

  for (let i = 0; i < words.length; i++) {
    const testLine = line + words[i] + " ";
    const testWidth = ctx.measureText(testLine).width;

    if (testWidth > maxWidth && line.length > 0) {
      lines.push(line.trim());
      line = words[i] + " ";
    } else {
      line = testLine;
    }
  }

  if (line.trim().length > 0) {
    lines.push(line.trim());
  }

  return lines;
};

const generateFallbackCoverLetter = (prompt, userInfo = {}) => {
  const fallbackContent = `
${userInfo.name || "Your Name"}
${userInfo.email || "your.email@example.com"}
${userInfo.phone || "Your Phone Number"}

${new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
})}

Hiring Manager
${userInfo.company || "Company Name"}

Dear Hiring Manager,

I am writing to express my strong interest in the ${
    userInfo.jobTitle || "position"
  } role at ${userInfo.company || "your company"}. Based on my experience in ${
    userInfo.experience || "the relevant field"
  } and skills in ${userInfo.skills || "key areas"}, I am confident that I would be a valuable addition to your team.

I have demonstrated strong problem-solving skills, a commitment to quality, and the ability to work effectively both independently and as part of a team.

Thank you for considering my application. I look forward to the opportunity to discuss how I can contribute to ${userInfo.company || "your company"}.

Sincerely,
${userInfo.name || "Your Name"}

Note: This is a fallback template cover letter generated automatically.
`;

  return {
    content: fallbackContent,
    source: "Template Generator",
    generatedAt: new Date().toISOString(),
    prompt,
    userInfo,
  };
};