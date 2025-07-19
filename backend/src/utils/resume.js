import { createCanvas } from 'canvas';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';

// AI-powered data refinement function
const refineUserDataWithAI = async (rawUserData) => {
  try {
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
    cleanedResponse = cleanedResponse.replace(/```json\n?/, '');
    cleanedResponse = cleanedResponse.replace(/```\n?$/, '');

    try {
      const refinedData = JSON.parse(cleanedResponse);
      console.log('AI data refinement successful');
      return refinedData;
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.error('Raw AI response:', refinedDataText);
      return createFallbackStructuredData(rawUserData);
    }
  } catch (error) {
    console.error('AI data refinement failed:', error);
    return createFallbackStructuredData(rawUserData);
  }
};

// Fallback function to create structured data when AI fails
function createFallbackStructuredData(rawUserData) {
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
}

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
  })).filter(skill => skill.name.length > 0);
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
  })).filter(lang => lang.name.length > 0);
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
  const title = rawUserData.prompt ? extractTitleFromPrompt(rawUserData.prompt) : 'Professional';
  return `Experienced ${title} with a strong background in technology and professional development. Skilled in multiple areas with a proven track record of delivering results. Passionate about continuous learning and contributing to team success.`;
};

// Text wrapping utility
const wrapText = (ctx, text, maxWidth, fontSize = 10) => {
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

// Helper to check if data has content
const hasContent = (data) => {
  if (!data) return false;
  if (Array.isArray(data)) return data.length > 0;
  if (typeof data === 'string') return data.trim().length > 0;
  if (typeof data === 'object') return Object.keys(data).length > 0;
  return Boolean(data);
};

// Generate resume canvas image with dynamic sections
async function generateResumeImageCanvas(userData) {
  const width = 900;
  const height = 1200;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');
  // Set background to white
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);
  const leftMargin = 50;
  const rightMargin = width - 50;
  const contentWidth = rightMargin - leftMargin;
  let currentY = 40;

  const sections = [
    {
      key: 'summary',
      render: () => {
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('PROFESSIONAL SUMMARY', leftMargin, currentY);
        currentY += 22;
        ctx.fillStyle = '#000000';
        ctx.font = '13px Arial';
        const summaryLines = wrapText(ctx, userData.summary, contentWidth - 20, 13);
        for (const line of summaryLines) {
          ctx.fillText(line, leftMargin, currentY);
          currentY += 18;
        }
        currentY += 10;
      },
      check: () => hasContent(userData.summary)
    },
    {
      key: 'skills',
      render: () => {
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('CORE COMPETENCIES', leftMargin, currentY);
        currentY += 22;
        ctx.fillStyle = '#000000';
        ctx.font = '13px Arial';
        const skillCategories = {};
        userData.skills.forEach(skill => {
          const category = skill.category || 'Technical';
          if (!skillCategories[category]) skillCategories[category] = [];
          skillCategories[category].push(skill.name);
        });
        Object.keys(skillCategories).forEach(category => {
          ctx.fillStyle = '#666666';
          ctx.font = 'bold 12px Arial';
          ctx.fillText(`${category.toUpperCase()}:`, leftMargin, currentY);
          ctx.fillStyle = '#000000';
          ctx.font = '13px Arial';
          const skillsText = skillCategories[category].join(' • ');
          const skillLines = wrapText(ctx, skillsText, contentWidth - 100, 13);
          skillLines.forEach((line, index) => {
            ctx.fillText(line, leftMargin + 100, currentY + (index * 16));
          });
          currentY += skillLines.length * 16 + 10;
        });
        currentY += 10;
      },
      check: () => hasContent(userData.skills)
    },
    {
      key: 'experience',
      render: () => {
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('PROFESSIONAL EXPERIENCE', leftMargin, currentY);
        currentY += 22;
        userData.experience.forEach(exp => {
          if (currentY > height - 150) return;
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 14px Arial';
          ctx.fillText(exp.position || 'Position', leftMargin, currentY);
          ctx.textAlign = 'right';
          ctx.fillStyle = '#000000';
          ctx.font = '13px Arial';
          ctx.fillText(exp.duration || 'Duration', rightMargin, currentY);
          ctx.textAlign = 'left';
          currentY += 18;
          ctx.fillStyle = '#333333';
          ctx.font = '13px Arial';
          ctx.fillText(exp.company || 'Company', leftMargin, currentY);
          currentY += 18;
          if (hasContent(exp.description)) {
            ctx.fillStyle = '#444444';
            ctx.font = '12px Arial';
            const descLines = wrapText(ctx, exp.description, contentWidth - 20, 12);
            for (const line of descLines) {
              ctx.fillText(line, leftMargin, currentY);
              currentY += 15;
            }
          }
          if (hasContent(exp.achievements)) {
            currentY += 5;
            exp.achievements.forEach(achievement => {
              ctx.fillStyle = '#333333';
              ctx.font = '12px Arial';
              ctx.fillText('• ' + achievement, leftMargin + 10, currentY);
              currentY += 15;
            });
          }
          if (hasContent(exp.technologies)) {
            currentY += 5;
            ctx.fillStyle = '#666666';
            ctx.font = 'italic 11px Arial';
            const techText = 'Technologies: ' + exp.technologies.join(', ');
            const techLines = wrapText(ctx, techText, contentWidth - 20, 11);
            for (const line of techLines) {
              ctx.fillText(line, leftMargin, currentY);
              currentY += 13;
            }
          }
          currentY += 15;
        });
      },
      check: () => hasContent(userData.experience)
    },
    {
      key: 'education',
      render: () => {
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('EDUCATION', leftMargin, currentY);
        currentY += 22;
        userData.education.forEach(edu => {
          if (currentY > height - 100) return;
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 14px Arial';
          ctx.fillText(edu.degree || 'Degree', leftMargin, currentY);
          ctx.textAlign = 'right';
          ctx.fillStyle = '#000000';
          ctx.font = '13px Arial';
          ctx.fillText(edu.year || 'Year', rightMargin, currentY);
          ctx.textAlign = 'left';
          currentY += 18;
          ctx.fillStyle = '#333333';
          ctx.font = '13px Arial';
          ctx.fillText(edu.institution || 'Institution', leftMargin, currentY);
          if (hasContent(edu.field) || hasContent(edu.gpa)) {
            currentY += 15;
            ctx.fillStyle = '#666666';
            ctx.font = '12px Arial';
            let eduDetails = '';
            if (edu.field) eduDetails += edu.field;
            if (edu.gpa) eduDetails += ` | GPA: ${edu.gpa}`;
            ctx.fillText(eduDetails, leftMargin, currentY);
          }
          currentY += 25;
        });
      },
      check: () => hasContent(userData.education)
    },
    {
      key: 'projects',
      render: () => {
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('PROJECTS', leftMargin, currentY);
        currentY += 22;
        userData.projects.forEach(proj => {
          if (currentY > height - 100) return;
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 14px Arial';
          ctx.fillText(proj.name || 'Project Name', leftMargin, currentY);
          ctx.textAlign = 'right';
          ctx.fillStyle = '#000000';
          ctx.font = '13px Arial';
          if (proj.duration) ctx.fillText(proj.duration, rightMargin, currentY);
          ctx.textAlign = 'left';
          currentY += 18;
          if (hasContent(proj.description)) {
            ctx.fillStyle = '#333333';
            ctx.font = '12px Arial';
            const projLines = wrapText(ctx, proj.description, contentWidth - 20, 12);
            for (const line of projLines) {
              ctx.fillText(line, leftMargin, currentY);
              currentY += 15;
            }
          }
          if (hasContent(proj.technologies)) {
            ctx.fillStyle = '#666666';
            ctx.font = 'italic 11px Arial';
            const techText = 'Technologies: ' + proj.technologies.join(', ');
            const techLines = wrapText(ctx, techText, contentWidth - 20, 11);
            for (const line of techLines) {
              ctx.fillText(line, leftMargin, currentY);
              currentY += 13;
            }
          }
          currentY += 15;
        });
      },
      check: () => hasContent(userData.projects)
    },
    {
      key: 'achievements',
      render: () => {
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('ACHIEVEMENTS', leftMargin, currentY);
        currentY += 22;
        userData.achievements.forEach(ach => {
          if (currentY > height - 100) return;
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 14px Arial';
          ctx.fillText(ach.title || 'Achievement', leftMargin, currentY);
          ctx.textAlign = 'right';
          ctx.fillStyle = '#000000';
          ctx.font = '13px Arial';
          if (ach.date) ctx.fillText(ach.date, rightMargin, currentY);
          ctx.textAlign = 'left';
          currentY += 18;
          if (hasContent(ach.description)) {
            ctx.fillStyle = '#333333';
            ctx.font = '12px Arial';
            const achLines = wrapText(ctx, ach.description, contentWidth - 20, 12);
            for (const line of achLines) {
              ctx.fillText(line, leftMargin, currentY);
              currentY += 15;
            }
          }
          currentY += 15;
        });
      },
      check: () => hasContent(userData.achievements)
    },
    {
      key: 'languages',
      render: () => {
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('LANGUAGES', leftMargin, currentY);
        currentY += 22;
        userData.languages.forEach(lang => {
          ctx.fillStyle = '#000000';
          ctx.font = '13px Arial';
          ctx.fillText(`${lang.name || 'Language'} - ${lang.level || 'Conversational'}`, leftMargin, currentY);
          currentY += 20;
        });
      },
      check: () => hasContent(userData.languages)
    },
    {
      key: 'certifications',
      render: () => {
        ctx.fillStyle = '#000000';
        ctx.font = 'bold 16px Arial';
        ctx.fillText('CERTIFICATIONS', leftMargin, currentY);
        currentY += 22;
        userData.certifications.forEach(cert => {
          ctx.fillStyle = '#000000';
          ctx.font = 'bold 14px Arial';
          ctx.fillText(cert.name || 'Certification', leftMargin, currentY);
          ctx.textAlign = 'right';
          ctx.fillStyle = '#000000';
          ctx.font = '13px Arial';
          if (cert.date) ctx.fillText(cert.date, rightMargin, currentY);
          ctx.textAlign = 'left';
          currentY += 18;
          if (hasContent(cert.issuer)) {
            ctx.fillStyle = '#333333';
            ctx.font = '12px Arial';
            ctx.fillText(`Issued by: ${cert.issuer}`, leftMargin, currentY);
            currentY += 15;
          }
          currentY += 10;
        });
      },
      check: () => hasContent(userData.certifications)
    }
  ];

  // Draw header with name, title, contact info
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 28px Arial';
  ctx.textAlign = 'left';
  const userName = (userData.name || 'Your Name').toUpperCase();
  ctx.fillText(userName, leftMargin, currentY);
  currentY += 36;
  ctx.fillStyle = '#000000';
  ctx.font = '18px Arial';
  const userTitle = userData.title || 'Professional';
  ctx.fillText(userTitle, leftMargin, currentY);
  currentY += 28;
  ctx.fillStyle = '#000000';
  ctx.font = '14px Arial';
  const contactInfo = `${userData.email || 'email@example.com'} | ${userData.phone || '+1 (555) 123-4567'} | ${userData.location || 'Location'}`;
  ctx.fillText(contactInfo, leftMargin, currentY);
  currentY += 20;
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(leftMargin, currentY);
  ctx.lineTo(rightMargin, currentY);
  ctx.stroke();
  currentY += 24;

  // Render all sections that have content
  for (const section of sections) {
    if (section.check()) {
      section.render();
    }
  }

  return {
    dataUrl: canvas.toDataURL('image/png'),
    buffer: canvas.toBuffer('image/png')
  };
}

// Main export: generate resume from job description with AI and fallback
const generateResumeFromJobDescription = async (userData) => {
  try {
    console.log('Starting AI-powered resume generation...');
    const refinedData = await refineUserDataWithAI(userData);
    console.log('Refined data structure:', JSON.stringify(refinedData, null, 2));
    const canvasImage = await generateResumeImageCanvas(refinedData);

    return {
      success: true,
      type: 'image',
      imageData: canvasImage.dataUrl,
      buffer: canvasImage.buffer,
      model: 'Gemini AI + Professional Canvas Generator',
      format: 'png',
      refinedData
    };
  } catch (error) {
    console.error('AI-powered resume generation error:', error);
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

export {
  refineUserDataWithAI,
  generateResumeFromJobDescription,
  wrapText,
  hasContent,
  generateResumeImageCanvas
};