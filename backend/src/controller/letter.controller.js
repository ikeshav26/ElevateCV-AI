import { GoogleGenerativeAI } from "@google/generative-ai";
import { createCanvas } from "canvas";
import cloudinary from "../config/cloudinary.js";
import Letter from "../models/letter.model.js";

export const generate = async (req, res) => {
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

    const requiredFields = [];
    if (!name || name.trim() === "") requiredFields.push("name");
    if (!email || email.trim() === "") requiredFields.push("email");
    if (!jobTitle || jobTitle.trim() === "") requiredFields.push("jobTitle");
    if (!company || company.trim() === "") requiredFields.push("company");

    if (requiredFields.length > 0) {
      return res.status(400).json({ 
        message: `Missing required fields: ${requiredFields.join(", ")}. All fields are required to generate a complete cover letter without placeholders.`,
        missingFields: requiredFields
      });
    }

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

    const canvasImage = await generateLetterCanvas(letterData, {
      name,
      email,
      phone,
      company,
      companyAddress,
    });

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
      skills,
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
You are a professional cover letter writer. Create a unique, personalized cover letter based on the user's specific information and request. 

CRITICAL REQUIREMENTS:
- NEVER use placeholders like [Your Name], [Company Name], [Position], etc.
- NEVER use generic phrases like "your company", "this position", "the role"
- ALWAYS use the EXACT information provided by the user
- Write as if you ARE the person applying for the job
- Make it sound natural and conversational, not robotic

USER REQUEST: "${prompt}"

ACTUAL USER INFORMATION (USE THESE EXACT DETAILS):
- Applicant Name: ${userInfo.name}
- Applying for Job: ${userInfo.jobTitle}
- Target Company: ${userInfo.company}
- Skills: ${userInfo.skills || ""}
- Experience: ${userInfo.experience || ""}
- Role Description: ${userInfo.description || ""}
- Tone: ${userInfo.tone || "Professional"}

INSTRUCTIONS:
Write exactly 3 unique paragraphs for a cover letter. Use the EXACT names and details provided above.

Paragraph 1 (Opening): 
- Express genuine interest in the ${userInfo.jobTitle} role at ${userInfo.company}
- Mention what attracts you to ${userInfo.company} specifically
- State your most relevant qualification using your actual experience/skills

Paragraph 2 (Body): 
- Highlight your specific skills (${userInfo.skills || "relevant skills"}) and experiences
- Provide concrete examples of achievements or projects
- Show knowledge of ${userInfo.company} and how you can contribute
- Be specific about the value you bring to ${userInfo.company}

Paragraph 3 (Closing):
- Reiterate enthusiasm for the ${userInfo.jobTitle} position at ${userInfo.company}
- Mention next steps (interview, portfolio review, etc.)
- Professional closing statement

STRICT RULES:
- Use "${userInfo.name}" as the applicant name (never "I" without context)
- Use "${userInfo.jobTitle}" as the exact job title
- Use "${userInfo.company}" as the exact company name
- Write in ${userInfo.tone || "professional"} tone
- Each paragraph should be 3-5 sentences long
- Separate paragraphs with "###PARAGRAPH###"
- Do NOT include header, date, or signature - only the 3 body paragraphs
- Make it sound human and genuine, not templated
- NO placeholders or generic terms allowed
- Write as if you're the person applying, using first person perspective naturally
`;

    const result = await model.generateContent(enhancedPrompt);
    const response = await result.response;
    const text = response.text();

    if (!text || text.trim().length === 0) {
      throw new Error("Empty response from Google AI");
    }

    let paragraphs = text
      .split("###PARAGRAPH###")
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => p.replace(/^(Paragraph \d+:|Opening:|Body:|Closing:)/i, '').trim());

    paragraphs = paragraphs.map(p => 
      p.replace(/\[.*?\]/g, '')
        .replace(/\{.*?\}/g, '')
        .replace(/your company/gi, userInfo.company)
        .replace(/this position/gi, userInfo.jobTitle)
        .replace(/the role/gi, `the ${userInfo.jobTitle} role`)
        .replace(/your organization/gi, userInfo.company)
        .trim()
    );

    if (paragraphs.length < 3) {
      return generateFallbackCoverLetter(prompt, userInfo);
    }

    return {
      paragraphs: paragraphs.slice(0, 3),
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

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  const leftMargin = 80;
  const rightMargin = width - 80;
  const topMargin = 80;
  const contentWidth = rightMargin - leftMargin;

  let currentY = topMargin;

  // Enhanced Header with elegant styling
  ctx.fillStyle = "#000000";
  ctx.font = "bold 28px Arial";
  ctx.textAlign = "left";
  
  const nameText = userInfo.name ? userInfo.name.toUpperCase() : "APPLICANT NAME";
  ctx.fillText(nameText, leftMargin, currentY);
  
  // Stylish underline with gradient effect
  const nameWidth = ctx.measureText(nameText).width;
  ctx.fillRect(leftMargin, currentY + 8, nameWidth, 3);
  ctx.fillStyle = "#333333";
  ctx.fillRect(leftMargin, currentY + 11, nameWidth * 0.7, 1);
  
  currentY += 55;

  // Contact Information with better spacing
  ctx.font = "16px Arial";
  ctx.fillStyle = "#000000";
  
  if (userInfo.email && userInfo.email.trim() !== "") {
    ctx.fillText(`✉ ${userInfo.email}`, leftMargin, currentY);
    currentY += 25;
  }
  
  if (userInfo.phone && userInfo.phone.trim() !== "") {
    ctx.fillText(`📞 ${userInfo.phone}`, leftMargin, currentY);
    currentY += 25;
  }

  currentY += 35;

  // Date with professional formatting
  ctx.textAlign = "right";
  ctx.font = "14px Arial";
  const dateText = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  ctx.fillText(dateText, rightMargin, currentY);
  
  currentY += 55;

  // Recipient section with enhanced styling
  ctx.textAlign = "left";
  ctx.font = "bold 18px Arial";
  ctx.fillText("Hiring Manager", leftMargin, currentY);
  currentY += 28;
  
  ctx.font = "16px Arial";
  ctx.fillStyle = "#333333";
  if (userInfo.company && userInfo.company.trim() !== "") {
    ctx.fillText(userInfo.company, leftMargin, currentY);
    currentY += 24;
  }
  
  if (userInfo.companyAddress && userInfo.companyAddress.trim() !== "") {
    ctx.fillText(userInfo.companyAddress, leftMargin, currentY);
    currentY += 24;
  }

  currentY += 40;

  // Professional salutation
  ctx.font = "16px Arial";
  ctx.fillStyle = "#000000";
  ctx.fillText("Dear Hiring Manager,", leftMargin, currentY);
  currentY += 45;

  // Enhanced body paragraphs with better typography
  ctx.font = "15px Arial";
  ctx.fillStyle = "#000000";
  const lineHeight = 22;
  const paragraphSpacing = 30;

  const paragraphs = letterData.paragraphs || [];

  paragraphs.forEach((paragraph, index) => {
    if (currentY > height - 220) return;

    let cleanParagraph = paragraph
      .replace(/\[.*?\]/g, '')
      .replace(/\{.*?\}/g, '')
      .replace(/your company/gi, userInfo.company || 'the company')
      .replace(/this position/gi, userInfo.jobTitle || 'this position')
      .replace(/the role/gi, `the ${userInfo.jobTitle || 'role'}`)
      .replace(/your organization/gi, userInfo.company || 'the organization')
      .trim();

    const lines = wrapText(ctx, cleanParagraph, contentWidth);
    
    lines.forEach((line, lineIndex) => {
      if (currentY > height - 220) return;
      ctx.fillText(line, leftMargin, currentY);
      currentY += lineHeight;
    });

    if (index < paragraphs.length - 1) {
      currentY += paragraphSpacing;
    }
  });

  // Enhanced closing section
  currentY += 40;
  
  if (currentY < height - 140) {
    ctx.font = "16px Arial";
    ctx.fillText("Sincerely,", leftMargin, currentY);
    currentY += 65;
    
    // Signature with elegant styling
    ctx.font = "bold 18px Arial";
    const signatureName = userInfo.name || "Applicant Name";
    ctx.fillText(signatureName, leftMargin, currentY);
    
    // Elegant signature underline
    const sigWidth = ctx.measureText(signatureName).width;
    ctx.fillStyle = "#666666";
    ctx.fillRect(leftMargin, currentY + 8, sigWidth, 1);
  }

  // Minimalist footer
  const footerY = height - 40;
  ctx.fillStyle = "#cccccc";
  ctx.fillRect(leftMargin, footerY - 15, contentWidth, 1);
  
  ctx.fillStyle = "#999999";
  ctx.font = "10px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Generated by ElevateCV AI", width / 2, footerY);

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
  const currentDate = new Date();
  const uniqueId = Math.random().toString(36).substring(2, 15);
  
  const applicantName = userInfo.name || "the applicant";
  const targetCompany = userInfo.company || "the organization";
  const targetPosition = userInfo.jobTitle || "the position";
  const applicantSkills = userInfo.skills || "relevant professional skills";
  const applicantExperience = userInfo.experience || "professional experience";
  
  const paragraph1 = `I am writing to express my strong interest in the ${targetPosition} role at ${targetCompany}. ${
    userInfo.experience 
      ? `With my background in ${applicantExperience}, I am` 
      : "I am"
  } excited about the opportunity to contribute to ${targetCompany}'s continued success. ${
    userInfo.skills 
      ? `My expertise in ${applicantSkills} aligns perfectly with the requirements of the ${targetPosition} position.`
      : `I believe my skills and enthusiasm make me an ideal candidate for the ${targetPosition} role.`
  }`;

  const paragraph2 = `Throughout my career, I have developed ${
    userInfo.skills 
      ? `strong capabilities in ${applicantSkills}` 
      : "valuable professional skills"
  } that would directly benefit ${targetCompany}. ${
    userInfo.experience 
      ? `My experience in ${applicantExperience} has taught me the importance of` 
      : "I have learned the value of"
  } collaboration, innovation, and delivering high-quality results that drive business objectives. ${
    userInfo.description 
      ? `I am particularly drawn to the ${targetPosition} role because ${userInfo.description.toLowerCase()}.`
      : `I am committed to bringing my best efforts to the ${targetPosition} position at ${targetCompany}.`
  }`;

  const paragraph3 = `Thank you for considering my application for the ${targetPosition} position at ${targetCompany}. I would welcome the opportunity to discuss how my ${
    userInfo.skills ? `skills in ${applicantSkills}` : "qualifications and experience"
  } can contribute to ${targetCompany}'s team objectives. I look forward to hearing from you soon and am available for an interview at your convenience.`;

  return {
    paragraphs: [paragraph1, paragraph2, paragraph3],
    source: "Enhanced Template Generator",
    generatedAt: currentDate.toISOString(),
    uniqueId,
    prompt,
    userInfo,
    note: "Fallback content generated when AI service is unavailable - no placeholders used"
  };
};


export const getAllLetters=async(req,res)=>{
    try{
        const  userId=req.user;
        const Letters=await Letter.find({userId}).sort({createdAt: -1});
        res.status(200).json(Letters);
    }catch(err){
        console.error("Error in getAllLetters:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message || "Unknown error occurred"
        });
    }
}


export const getLetter=async(req,res)=>{
    try{
        const letterId=req.params.id;
        const userId=req.user;
        const letter=await Letter.findOne({ userId, _id: letterId });
        if(!letter){
            return res.status(404).json({ message: "Letter not found" });
        }
        res.status(200).json(letter);
    }catch(err){
        console.error("Error in getLetter:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message || "Unknown error occurred"
        });
    }
}


export const deleteLetter=async(req,res)=>{
    try{
        const letterId=req.params.id;
        const userId=req.user;
        const letter=await Letter.findOneAndDelete({ userId, _id: letterId });
        if(!letter){
            return res.status(404).json({ message: "Letter not found" });
        }
        res.status(200).json({ message: "Letter deleted successfully" });
    }catch(err){
        console.error("Error in deleteLetter:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message || "Unknown error occurred"
        });
    }
}



export const exploreLetters=async(req,res)=>{
    try{
        const letters=await Letter.find({ isPublic: true }).sort({ createdAt: -1 });
        res.status(200).json(letters);
    }catch(err){
        console.error("Error in exploreLetters:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message || "Unknown error occurred"
        });
    }
}



export const changeVisibility=async(req,res)=>{
    try{
        const letterId=req.params.id;
        const userId=req.user;
        const letter=await Letter.findOne({ userId, _id: letterId });
        if(!letter){
            return res.status(404).json({ message: "Letter not found" });
        }
        letter.isPublic = !letter.isPublic;
        await letter.save();
        res.status(200).json({
            message: `Letter visibility changed to ${letter.isPublic ? "public" : "private"}`,
            isPublic: letter.isPublic
        }); 
    }catch(err){
        console.error("Error in changeVisibility:", err);
        res.status(500).json({
            message: "Internal server error",
            error: err.message || "Unknown error occurred"
        });
    }
}