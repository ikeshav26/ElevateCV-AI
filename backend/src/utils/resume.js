import { createCanvas } from 'canvas';
import { CanvasRenderingContext2D } from 'canvas';
import axios from 'axios';
import { GoogleGenerativeAI } from "@google/generative-ai";

// AI-POWERED DATA REFINEMENT FUNCTION
const refineUserDataWithAI = async (rawUserData) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const refinementPrompt = `
You are a professional resume AI assistant and career expert. I will provide you with raw user data in various formats. Your task is to intelligently process, clean, and structure this data into a professional, ATS-friendly resume format with proper definitions and enhanced descriptions.

Raw User Data:
- Target Role/Job Description: ${rawUserData.prompt || 'Not provided'}
- Name: ${rawUserData.name || 'Not provided'}
- Email: ${rawUserData.email || 'Not provided'}
- Phone: ${rawUserData.phone || 'Not provided'}
- Skills: ${rawUserData.skills || 'Not provided'}
- Education: ${rawUserData.education || 'Not provided'}
- Experience: ${rawUserData.experience || 'Not provided'}
- Projects: ${rawUserData.projects || 'Not provided'}
- Achievements: ${rawUserData.achievements || 'Not provided'}
- Languages: ${rawUserData.languages || 'Not provided'}
- Certifications: ${rawUserData.certificates || 'Not provided'}

IMPORTANT INSTRUCTIONS FOR DATA REFINEMENT:
1. Add proper professional definitions and context to all entries
2. Enhance descriptions with industry-standard terminology
3. Quantify achievements wherever possible (use realistic estimates if not provided)
4. Use action verbs and professional language
5. Ensure all content is ATS-friendly and keyword-rich
6. Create compelling, results-oriented descriptions
7. Match skills and experience to the target role when possible

Please process this data and return a structured JSON response with the following format:
{
  "name": "cleaned and properly formatted name",
  "email": "validated email address",
  "phone": "formatted phone number",
  "title": "professional job title derived from target role and experience",
  "location": "professional location (City, State or Country)",
  "skills": [
    {"name": "skill name", "category": "technical/soft/leadership", "level": "beginner/intermediate/advanced/expert", "description": "brief context of how this skill is used"}
  ],
  "education": [
    {"degree": "full degree name", "institution": "institution name", "year": "graduation year", "field": "field of study", "gpa": "if mentioned", "coursework": "relevant coursework if applicable", "honors": "any honors or distinctions"}
  ],
  "experience": [
    {"position": "professional job title", "company": "company name", "duration": "time period (Month Year - Month Year)", "description": "enhanced professional description with industry context", "achievements": ["quantified achievement 1", "quantified achievement 2", "quantified achievement 3"], "technologies": ["relevant technologies used"]}
  ],
  "projects": [
    {"name": "project name", "description": "detailed professional description with business impact", "technologies": ["technology stack used"], "achievements": ["quantified results or impact"], "link": "if provided", "duration": "project timeline"}
  ],
  "achievements": [
    {"title": "achievement title", "description": "detailed description with context and impact", "date": "date if provided", "organization": "awarding organization if applicable"}
  ],
  "languages": [
    {"name": "language name", "level": "Native/Fluent/Proficient/Conversational/Basic", "certification": "any language certifications"}
  ],
  "certifications": [
    {"name": "full certification name", "issuer": "issuing organization", "date": "issue date", "expiry": "expiry date if applicable", "credential_id": "if provided", "description": "brief description of certification value"}
  ],
  "summary": "generate a compelling 4-5 sentence professional summary that highlights key strengths, quantified achievements, and alignment with target role. Use industry keywords and action-oriented language."
}

Rules for processing:
1. Clean and standardize all text (proper capitalization, grammar, etc.)
2. Extract structured information from unstructured text
3. Infer missing information intelligently (like job title from target role)
4. Organize skills by category and estimate proficiency levels
5. Format dates consistently
6. Create professional descriptions for projects and achievements
7. Generate a compelling summary that highlights key strengths
8. If data is missing, use appropriate defaults or leave empty arrays
9. Ensure all output is professional and ATS-friendly
10. Focus on the target role when prioritizing and organizing information

Return only the JSON response, no additional text.
`;

    const result = await model.generateContent(refinementPrompt);
    const response = await result.response;
    const refinedDataText = response.text();

    // Clean the response text to extract only JSON
    let cleanedResponse = refinedDataText.trim();
    
    // Remove markdown code blocks if present
    cleanedResponse = cleanedResponse.replace(/```json\n?/, '');
    cleanedResponse = cleanedResponse.replace(/```\n?$/, '');
    
    // Parse the AI response
    try {
      const refinedData = JSON.parse(cleanedResponse);
      console.log('AI data refinement successful');
      return refinedData;
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw AI response:', refinedDataText);
      // Return structured fallback data
      return createFallbackStructuredData(rawUserData);
    }

  } catch (error) {
    console.error('AI data refinement failed:', error);
    // Return structured fallback data
    return createFallbackStructuredData(rawUserData);
  }
};

// Fallback function to create structured data when AI fails
const createFallbackStructuredData = (rawUserData) => {
  return {
    name: rawUserData.name || 'Your Name',
    email: rawUserData.email || 'your.email@example.com',
    phone: rawUserData.phone || '+1 (555) 123-4567',
    title: rawUserData.prompt ? extractTitleFromPrompt(rawUserData.prompt) : 'Professional',
    location: 'Location',
    skills: rawUserData.skills ? parseSkillsFromText(rawUserData.skills) : [],
    education: rawUserData.education ? parseEducationFromText(rawUserData.education) : [],
    experience: rawUserData.experience ? parseExperienceFromText(rawUserData.experience) : [],
    projects: rawUserData.projects ? parseProjectsFromText(rawUserData.projects) : [],
    achievements: rawUserData.achievements ? parseAchievementsFromText(rawUserData.achievements) : [],
    languages: rawUserData.languages ? parseLanguagesFromText(rawUserData.languages) : [],
    certifications: rawUserData.certificates ? parseCertificationsFromText(rawUserData.certificates) : [],
    summary: generateFallbackSummary(rawUserData)
  };
};

// Helper functions for fallback parsing
const extractTitleFromPrompt = (prompt) => {
  const commonTitles = ['developer', 'engineer', 'manager', 'analyst', 'designer', 'consultant', 'specialist', 'coordinator', 'administrator', 'technician'];
  const lowerPrompt = prompt.toLowerCase();
  for (const title of commonTitles) {
    if (lowerPrompt.includes(title)) {
      return title.charAt(0).toUpperCase() + title.slice(1);
    }
  }
  return 'Professional';
};

const parseSkillsFromText = (skillsText) => {
  if (!skillsText || typeof skillsText !== 'string') return [];
  
  return skillsText.split(/[,\n;]/).map(skill => ({
    name: skill.trim(),
    category: 'technical',
    level: 'intermediate'
  })).filter(skill => skill.name && skill.name.length > 0);
};

const parseEducationFromText = (educationText) => {
  if (!educationText || typeof educationText !== 'string') return [];
  
  const lines = educationText.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];
  
  return [{
    degree: lines[0] || 'Degree',
    institution: lines[1] || 'Institution',
    year: new Date().getFullYear().toString(),
    field: 'Field of Study',
    gpa: ''
  }];
};

const parseExperienceFromText = (experienceText) => {
  if (!experienceText || typeof experienceText !== 'string') return [];
  
  return [{
    position: 'Position',
    company: 'Company',
    duration: '2022 - Present',
    description: experienceText.substring(0, 200),
    achievements: []
  }];
};

const parseProjectsFromText = (projectsText) => {
  if (!projectsText || typeof projectsText !== 'string') return [];
  
  return projectsText.split('\n').filter(p => p.trim()).slice(0, 5).map(project => ({
    name: project.substring(0, 50).trim() || 'Project',
    description: project.substring(0, 150).trim() || 'Project description',
    technologies: [],
    link: ''
  }));
};

const parseAchievementsFromText = (achievementsText) => {
  if (!achievementsText || typeof achievementsText !== 'string') return [];
  
  return achievementsText.split('\n').filter(a => a.trim()).slice(0, 5).map(achievement => ({
    title: achievement.substring(0, 50).trim() || 'Achievement',
    description: achievement.substring(0, 100).trim() || 'Achievement description',
    date: ''
  }));
};

const parseLanguagesFromText = (languagesText) => {
  if (!languagesText || typeof languagesText !== 'string') return [];
  
  return languagesText.split(/[,\n;]/).map(lang => ({
    name: lang.trim(),
    level: 'Conversational'
  })).filter(lang => lang.name && lang.name.length > 0);
};

const parseCertificationsFromText = (certificatesText) => {
  if (!certificatesText || typeof certificatesText !== 'string') return [];
  
  return certificatesText.split('\n').filter(c => c.trim()).slice(0, 5).map(cert => ({
    name: cert.substring(0, 50).trim() || 'Certification',
    issuer: 'Issuing Organization',
    date: ''
  }));
};

const generateFallbackSummary = (rawUserData) => {
  const name = rawUserData.name || 'Professional';
  const title = rawUserData.prompt ? extractTitleFromPrompt(rawUserData.prompt) : 'Professional';
  return `Experienced ${title} with a strong background in technology and professional development. Skilled in multiple areas with a proven track record of delivering results. Passionate about continuous learning and contributing to team success.`;
};

// Text wrapping utility function
const wrapText = (ctx, text, maxWidth, fontSize = 12) => {
  const words = text.split(' ');
  const lines = [];
  let currentLine = '';

  ctx.font = `${fontSize}px Arial`;

  for (let i = 0; i < words.length; i++) {
    const testLine = currentLine + words[i] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;

    if (testWidth > maxWidth && currentLine !== '') {
      lines.push(currentLine.trim());
      currentLine = words[i] + ' ';
    } else {
      currentLine = testLine;
    }
  }
  lines.push(currentLine.trim());
  return lines;
};

// Professional Canvas Generation Function - Black & White Design
const generateResumeImageCanvas = async (userData) => {
  const width = 900;
  const height = 1200;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Professional white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Professional margins
  const leftMargin = 60;
  const rightMargin = width - 60;
  const contentWidth = rightMargin - leftMargin;
  
  let currentY = 50;

  // HEADER SECTION - Professional Black & White Design
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'left';
  const userName = (userData.name || 'Your Name').toUpperCase();
  ctx.fillText(userName, leftMargin, currentY);
  
  // Professional title
  currentY += 35;
  ctx.fillStyle = '#333333';
  ctx.font = '16px Arial';
  const userTitle = userData.title || 'Professional';
  ctx.fillText(userTitle, leftMargin, currentY);
  
  // Contact information line
  currentY += 25;
  ctx.fillStyle = '#666666';
  ctx.font = '12px Arial';
  const contactInfo = `${userData.email || 'email@example.com'} | ${userData.phone || '+1 (555) 123-4567'} | ${userData.location || 'Location'}`;
  ctx.fillText(contactInfo, leftMargin, currentY);
  
  // Professional divider line
  currentY += 20;
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(leftMargin, currentY);
  ctx.lineTo(rightMargin, currentY);
  ctx.stroke();
  
  currentY += 30;

  // PROFESSIONAL SUMMARY
  if (userData.summary) {
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('PROFESSIONAL SUMMARY', leftMargin, currentY);
    
    currentY += 20;
    ctx.fillStyle = '#333333';
    ctx.font = '12px Arial';
    
    // Wrap text for summary
    const summaryLines = wrapText(ctx, userData.summary, contentWidth - 20, 12);
    for (const line of summaryLines) {
      ctx.fillText(line, leftMargin, currentY);
      currentY += 16;
    }
    currentY += 15;
  }

  // SKILLS SECTION
  if (userData.skills && userData.skills.length > 0) {
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('CORE COMPETENCIES', leftMargin, currentY);
    
    currentY += 20;
    ctx.fillStyle = '#333333';
    ctx.font = '12px Arial';
    
    // Organize skills by category
    const skillCategories = {};
    userData.skills.forEach(skill => {
      const category = skill.category || 'Technical';
      if (!skillCategories[category]) skillCategories[category] = [];
      skillCategories[category].push(skill.name);
    });
    
    Object.keys(skillCategories).forEach(category => {
      // Category header
      ctx.fillStyle = '#666666';
      ctx.font = 'bold 11px Arial';
      ctx.fillText(`${category.toUpperCase()}:`, leftMargin, currentY);
      
      // Skills in category
      ctx.fillStyle = '#333333';
      ctx.font = '12px Arial';
      const skillsText = skillCategories[category].join(' • ');
      const skillLines = wrapText(ctx, skillsText, contentWidth - 100, 12);
      
      skillLines.forEach((line, index) => {
        ctx.fillText(line, leftMargin + 100, currentY + (index * 15));
      });
      
      currentY += skillLines.length * 15 + 10;
    });
    
    currentY += 10;
  }

  // PROFESSIONAL EXPERIENCE
  if (userData.experience && userData.experience.length > 0) {
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('PROFESSIONAL EXPERIENCE', leftMargin, currentY);
    
    currentY += 25;
    
    userData.experience.forEach((exp, index) => {
      if (currentY > height - 200) return; // Page break logic
      
      // Position and Company
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 13px Arial';
      ctx.fillText(exp.position || 'Position', leftMargin, currentY);
      
      // Duration (right aligned)
      ctx.textAlign = 'right';
      ctx.fillStyle = '#666666';
      ctx.font = '12px Arial';
      ctx.fillText(exp.duration || 'Duration', rightMargin, currentY);
      
      // Company name
      ctx.textAlign = 'left';
      currentY += 16;
      ctx.fillStyle = '#333333';
      ctx.font = '12px Arial';
      ctx.fillText(exp.company || 'Company', leftMargin, currentY);
      
      currentY += 18;
      
      // Description
      if (exp.description) {
        ctx.fillStyle = '#444444';
        ctx.font = '11px Arial';
        const descLines = wrapText(ctx, exp.description, contentWidth - 20, 11);
        for (const line of descLines) {
          ctx.fillText(line, leftMargin, currentY);
          currentY += 14;
        }
      }
      
      // Achievements
      if (exp.achievements && exp.achievements.length > 0) {
        currentY += 5;
        exp.achievements.forEach(achievement => {
          ctx.fillStyle = '#333333';
          ctx.font = '11px Arial';
          ctx.fillText('• ' + achievement, leftMargin + 10, currentY);
          currentY += 14;
        });
      }
      
      // Technologies
      if (exp.technologies && exp.technologies.length > 0) {
        currentY += 5;
        ctx.fillStyle = '#666666';
        ctx.font = 'italic 10px Arial';
        const techText = 'Technologies: ' + exp.technologies.join(', ');
        const techLines = wrapText(ctx, techText, contentWidth - 20, 10);
        for (const line of techLines) {
          ctx.fillText(line, leftMargin, currentY);
          currentY += 13;
        }
      }
      
      currentY += 20;
    });
  }

  // EDUCATION
  if (userData.education && userData.education.length > 0) {
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('EDUCATION', leftMargin, currentY);
    
    currentY += 25;
    
    userData.education.forEach(edu => {
      if (currentY > height - 150) return;
      
      // Degree
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(edu.degree || 'Degree', leftMargin, currentY);
      
      // Year (right aligned)
      ctx.textAlign = 'right';
      ctx.fillStyle = '#666666';
      ctx.font = '12px Arial';
      ctx.fillText(edu.year || 'Year', rightMargin, currentY);
      
      // Institution
      ctx.textAlign = 'left';
      currentY += 16;
      ctx.fillStyle = '#333333';
      ctx.font = '12px Arial';
      ctx.fillText(edu.institution || 'Institution', leftMargin, currentY);
      
      // Field and GPA
      if (edu.field || edu.gpa) {
        currentY += 14;
        ctx.fillStyle = '#666666';
        ctx.font = '11px Arial';
        let eduDetails = '';
        if (edu.field) eduDetails += edu.field;
        if (edu.gpa) eduDetails += (eduDetails ? ' | ' : '') + `GPA: ${edu.gpa}`;
        ctx.fillText(eduDetails, leftMargin, currentY);
      }
      
      currentY += 20;
    });
  }

  // PROJECTS (if space allows)
  if (userData.projects && userData.projects.length > 0 && currentY < height - 200) {
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 14px Arial';
    ctx.fillText('KEY PROJECTS', leftMargin, currentY);
    
    currentY += 25;
    
    userData.projects.slice(0, 2).forEach(project => {
      if (currentY > height - 100) return;
      
      // Project name
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 12px Arial';
      ctx.fillText(project.name || 'Project', leftMargin, currentY);
      
      currentY += 16;
      
      // Description
      if (project.description) {
        ctx.fillStyle = '#444444';
        ctx.font = '11px Arial';
        const projectLines = wrapText(ctx, project.description, contentWidth - 20, 11);
        for (const line of projectLines.slice(0, 2)) { // Limit to 2 lines
          ctx.fillText(line, leftMargin, currentY);
          currentY += 14;
        }
      }
      
      // Technologies
      if (project.technologies && project.technologies.length > 0) {
        currentY += 3;
        ctx.fillStyle = '#666666';
        ctx.font = 'italic 10px Arial';
        const techText = 'Technologies: ' + project.technologies.join(', ');
        ctx.fillText(techText, leftMargin, currentY);
        currentY += 13;
      }
      
      currentY += 15;
    });
  }

  // CERTIFICATIONS & LANGUAGES (Bottom section)
  let bottomY = height - 120;
  
  if (userData.certifications && userData.certifications.length > 0) {
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('CERTIFICATIONS', leftMargin, bottomY);
    
    bottomY += 18;
    ctx.fillStyle = '#333333';
    ctx.font = '11px Arial';
    
    userData.certifications.slice(0, 3).forEach(cert => {
      const certText = `• ${cert.name} - ${cert.issuer} (${cert.date || 'Current'})`;
      ctx.fillText(certText, leftMargin, bottomY);
      bottomY += 14;
    });
  }
  
  if (userData.languages && userData.languages.length > 0) {
    bottomY += 10;
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 12px Arial';
    ctx.fillText('LANGUAGES', leftMargin, bottomY);
    
    bottomY += 18;
    ctx.fillStyle = '#333333';
    ctx.font = '11px Arial';
    
    const langText = userData.languages.map(lang => `${lang.name} (${lang.level})`).join(' • ');
    ctx.fillText(langText, leftMargin, bottomY);
  }

  // Return canvas data
  return {
    dataUrl: canvas.toDataURL('image/png'),
    buffer: canvas.toBuffer('image/png')
  };
};

// Main export function
export const generateResumeFromJobDescription = async (userData) => {
  try {
    console.log('Starting AI-powered resume generation...');
    
    // Step 1: Refine raw user data using Gemini AI
    const refinedData = await refineUserDataWithAI(userData);
    console.log('Refined data structure:', JSON.stringify(refinedData, null, 2));
    
    // Step 2: Generate canvas image with refined data
    const canvasImage = await generateResumeImageCanvas(refinedData);
    
    return {
      success: true,
      type: 'image',
      imageData: canvasImage.dataUrl,
      buffer: canvasImage.buffer,
      model: 'Gemini AI + Professional Canvas Generator',
      format: 'png',
      refinedData: refinedData
    };
  } catch (error) {
    console.error('AI-powered resume generation error:', error);
    
    // Fallback to basic generation
    try {
      const fallbackData = createFallbackStructuredData(userData);
      const canvasImage = await generateResumeImageCanvas(fallbackData);
      
      return {
        success: false,
        type: 'image',
        imageData: canvasImage.dataUrl,
        buffer: canvasImage.buffer,
        model: 'Fallback Professional Canvas Generator',
        format: 'png',
        refinedData: fallbackData
      };
    } catch (fallbackError) {
      console.error('Fallback resume generation also failed:', fallbackError);
      throw new Error('Resume generation failed completely');
    }
  }
};
