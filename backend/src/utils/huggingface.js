import { createCanvas } from 'canvas';
import { CanvasRenderingContext2D } from 'canvas';
import axios from 'axios';

export const generateResumeFromJobDescription = async (userData) => {
  try {
    const canvasImage = await generateResumeImageCanvas(userData);
    return {
      success: true,
      type: 'image',
      imageData: canvasImage.dataUrl,
      buffer: canvasImage.buffer,
      model: 'Canvas Generator',
      format: 'png',
    };
  } catch (error) {
    console.error('Canvas generation error:', error);
    throw new Error('Canvas generation failed');
  }
};

const generateResumeImageCanvas = async (userData) => {
  const width = 850;
  const height = 1200;
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Clean white background
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, width, height);

  // Designer accent - Left border
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, 8, height);

  // Professional margins
  const leftMargin = 80;
  const rightMargin = width - 80;
  const contentWidth = rightMargin - leftMargin;
  
  let currentY = 70;

  // HEADER SECTION - Elegant Black & White Design
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 36px Arial';
  ctx.textAlign = 'left';
  const userName = (userData.name || 'Your Name').toUpperCase();
  ctx.fillText(userName, leftMargin, currentY);
  
  // Elegant underline
  currentY += 8;
  ctx.fillStyle = '#000000';
  ctx.fillRect(leftMargin, currentY, userName.length * 18, 2);
  
  // Professional title
  currentY += 35;
  ctx.fillStyle = '#333333';
  ctx.font = '20px Arial';
  const title = toTitleCase(userData.title || userData.role || 'Software Developer');
  ctx.fillText(title, leftMargin, currentY);

  // Contact information - Clean professional layout
  currentY += 45;
  ctx.fillStyle = '#000000';
  ctx.font = '14px Arial';
  const email = (userData.email || 'email@example.com').toLowerCase();
  const phone = userData.phone || '+1 (555) 123-4567';
  const location = toTitleCase(userData.location || 'Location');
  
  // Clean contact layout without boxes
  const contactItems = [
    { icon: '✉', label: 'Email', value: email },
    { icon: '☎', label: 'Phone', value: phone },
    { icon: '📍', label: 'Location', value: location }
  ];
  
  contactItems.forEach((item, index) => {
    const itemX = leftMargin + (index * 240);
    
    // Icon with background circle
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(itemX + 12, currentY, 10, 0, 2 * Math.PI);
    ctx.fill();
    
    // Icon text - better positioning and size
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(item.icon, itemX + 12, currentY + 4);
    
    // Contact info
    ctx.fillStyle = '#666666';
    ctx.font = 'bold 10px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(item.label.toUpperCase(), itemX + 30, currentY - 5);
    
    ctx.fillStyle = '#000000';
    ctx.font = '12px Arial';
    ctx.fillText(item.value, itemX + 30, currentY + 8);
  });
  
  currentY += 25;
  
  // Add LinkedIn/GitHub with designer icons
  if (userData.linkedin || userData.github) {
    const socialY = currentY;
    if (userData.linkedin) {
      ctx.fillStyle = '#000000';
      ctx.font = '12px Arial';
      ctx.fillText('● LinkedIn: ' + userData.linkedin.toLowerCase(), leftMargin, socialY);
    }
    if (userData.github) {
      const githubY = userData.linkedin ? socialY + 20 : socialY;
      ctx.fillText('● GitHub: ' + userData.github.toLowerCase(), leftMargin, githubY);
      currentY = githubY;
    }
    currentY += 20;
  }

  // Designer separator line with geometric pattern
  currentY += 20;
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(leftMargin, currentY);
  ctx.lineTo(rightMargin, currentY);
  ctx.stroke();
  
  // Small decorative diamonds instead of squares
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#000000' : '#ffffff';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    
    // Create diamond shape
    const diamondX = leftMargin + (i * 15) + 3;
    const diamondY = currentY;
    
    ctx.beginPath();
    ctx.moveTo(diamondX, diamondY - 4);
    ctx.lineTo(diamondX + 3, diamondY);
    ctx.lineTo(diamondX, diamondY + 4);
    ctx.lineTo(diamondX - 3, diamondY);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  currentY += 30;

  // ELEGANT BLACK & WHITE SECTION HEADERS
  const addSectionHeader = (title) => {
    ctx.fillStyle = '#000000';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(title.toUpperCase(), leftMargin, currentY);
    
    currentY += 8;
    // Elegant thick underline
    ctx.fillStyle = '#000000';
    ctx.fillRect(leftMargin, currentY, title.length * 12, 3);
    
    // Decorative circle element
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(leftMargin + title.length * 12 + 15, currentY + 1.5, 4, 0, 2 * Math.PI);
    ctx.fill();
    
    currentY += 25;
  };

  // CLEAN TEXT CONTENT
  const addContent = (text, isBold = false, indent = 0) => {
    ctx.fillStyle = '#000000';
    ctx.font = isBold ? 'bold 14px Arial' : '14px Arial';
    ctx.textAlign = 'left';
    
    const lines = wrapText(ctx, text, contentWidth - indent);
    lines.forEach(line => {
      ctx.fillText(line, leftMargin + indent, currentY);
      currentY += 18;
    });
    currentY += 5;
  };

  // ELEGANT BULLET POINTS
  const addBulletPoint = (text) => {
    ctx.fillStyle = '#000000';
    ctx.font = '14px Arial';
    ctx.fillText('•', leftMargin + 20, currentY);
    
    ctx.fillStyle = '#000000';
    const lines = wrapText(ctx, text, contentWidth - 40);
    lines.forEach((line, index) => {
      ctx.fillText(line, leftMargin + 35, currentY + (index * 18));
    });
    currentY += lines.length * 18 + 5;
  };

  // SKILLS TAGS - Elegant Black & White Design
  const addSkillTags = (skills) => {
    let x = leftMargin;
    let rowY = currentY;
    
    skills.forEach(skill => {
      const padding = 12;
      const skillWidth = ctx.measureText(skill).width + (padding * 2);
      
      if (x + skillWidth > rightMargin - 20) {
        x = leftMargin;
        rowY += 35;
      }
      
      // Elegant border design
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(x, rowY - 12, skillWidth, 24, 4);
      ctx.stroke();
      
      // White background
      ctx.fillStyle = '#ffffff';
      ctx.fill();
      
      // Skill text
      ctx.fillStyle = '#000000';
      ctx.font = '13px Arial';
      ctx.textAlign = 'left';
      ctx.fillText(skill, x + padding, rowY + 3);
      
      x += skillWidth + 12;
    });
    
    currentY = rowY + 35;
  };

  // AI-POWERED DESCRIPTION GENERATOR FOR PROJECTS AND CERTIFICATES
  const generateAIDescription = async (itemName, itemType = 'project') => {
    const prompts = {
      project: `Write a professional 15-20 word description for a project named "${itemName}". Focus on technology, functionality, and impact.`,
      certificate: `Write a professional 15-20 word description for a certification named "${itemName}". Focus on skills gained and professional value.`
    };

    try {
      const response = await axios.post('https://api-inference.huggingface.co/models/google/flan-t5-large', {
        inputs: prompts[itemType] || prompts.project,
        parameters: { max_length: 50, temperature: 0.7, do_sample: true, top_p: 0.8 }
      }, { headers: { 'Content-Type': 'application/json' }, timeout: 15000 });

      if (response.data?.[0]?.generated_text) {
        let description = response.data[0].generated_text
          .replace(/^(Description:|Project:|Certificate:)/gi, '')
          .replace(/\s+/g, ' ').trim();
        
        const words = description.split(' ');
        if (words.length >= 10 && words.length <= 25) return description;
      }
    } catch (error) {
      console.log('AI description failed, using template...');
    }

    // Smart template fallback
    const templates = {
      project: [
        `Innovative ${itemName} application built with modern technologies to solve real-world problems efficiently.`,
        `Full-stack ${itemName} project featuring responsive design and robust backend functionality for users.`,
        `Advanced ${itemName} solution implementing best practices and scalable architecture for optimal performance.`
      ],
      certificate: [
        `Professional ${itemName} certification demonstrating expertise and commitment to industry best practices.`,
        `Advanced ${itemName} qualification validating specialized skills and technical competency in field.`,
        `Industry-recognized ${itemName} certification showcasing proficiency and dedication to professional development.`
      ]
    };
    
    const templateList = templates[itemType] || templates.project;
    return templateList[Math.floor(Math.random() * templateList.length)];
  };
  // AI SUMMARY GENERATOR - ENHANCED PERSONALIZED VERSION
  const generateAISummary = async (userData) => {
    // Enhanced user profile extraction with more detailed data
    const userProfile = {
      name: userData.name || 'Professional',
      title: userData.title || userData.role || 'Professional',
      skills: userData.skills?.slice(0, 10).map(skill => extractText(skill, ['name', 'skill', 'title'])).filter(Boolean).join(', ') || '',
      experience: userData.experience ? (Array.isArray(userData.experience) ? 
        userData.experience.map(exp => extractText(exp, ['position', 'company', 'description', 'achievements'])).join('. ').substring(0, 300) :
        extractText(userData.experience, ['position', 'company', 'description', 'achievements']).substring(0, 300)) : '',
      education: userData.education ? (Array.isArray(userData.education) ?
        userData.education.map(edu => extractText(edu, ['degree', 'institution', 'field', 'year'])).join(', ') :
        extractText(userData.education, ['degree', 'institution', 'field', 'year'])) : '',
      projects: userData.projects?.slice(0, 4).map(p => extractText(p, ['name', 'title', 'description'])).filter(Boolean).join(', ') || '',
      certifications: userData.certifications?.slice(0, 3).map(cert => extractText(cert, ['name', 'title', 'issuer'])).filter(Boolean).join(', ') || '',
      languages: userData.languages?.map(lang => extractText(lang, ['name', 'language', 'level'])).filter(Boolean).join(', ') || '',
      jobRequirement: userData.prompt || '',
      location: userData.location || '',
      yearsOfExperience: userData.experience ? (userData.experience.toString().match(/\d+\s*(year|yr)/gi) || ['1 year'])[0] : ''
    };

    // Create comprehensive, personalized prompt
    const summaryPrompt = `Create a unique professional resume summary for ${userProfile.name}, a ${userProfile.title}. 

PERSONAL DETAILS:
- Name: ${userProfile.name}
- Role: ${userProfile.title}
- Location: ${userProfile.location}
- Experience: ${userProfile.yearsOfExperience}

TECHNICAL SKILLS: ${userProfile.skills}

WORK EXPERIENCE: ${userProfile.experience}

EDUCATION: ${userProfile.education}

PROJECTS: ${userProfile.projects}

CERTIFICATIONS: ${userProfile.certifications}

LANGUAGES: ${userProfile.languages}

TARGET ROLE/REQUIREMENTS: ${userProfile.jobRequirement}

Write a compelling, personalized 3-4 sentence professional summary that:
1. Mentions specific skills from their profile
2. References their actual experience and achievements
3. Highlights relevant projects or certifications
4. Aligns with their target role requirements
5. Uses their actual background details
6. Avoids generic templates

Make it unique and specific to this person's profile. Use action words and quantifiable achievements when possible.`;

    // Try AI APIs with enhanced prompting
    const aiEndpoints = [
      'https://api-inference.huggingface.co/models/google/flan-t5-large',
      'https://api-inference.huggingface.co/models/microsoft/DialoGPT-large',
      'https://api-inference.huggingface.co/models/gpt2'
    ];

    for (const endpoint of aiEndpoints) {
      try {
        const response = await axios.post(endpoint, {
          inputs: summaryPrompt,
          parameters: { 
            max_length: 200, 
            temperature: 0.8, // Higher temperature for more creativity
            do_sample: true,
            top_p: 0.95,
            repetition_penalty: 1.2 // Avoid repetitive content
          }
        }, { headers: { 'Content-Type': 'application/json' }, timeout: 20000 });

        if (response.data?.[0]?.generated_text) {
          let summary = response.data[0].generated_text
            .replace(/^(Summary:|Professional Summary:|Resume Summary:|Create a|Write a)/gi, '')
            .replace(/\s+/g, ' ')
            .trim();
          
          // Clean up and validate the AI response
          summary = summary
            .replace(/^\W+/, '') // Remove leading non-word characters
            .replace(/\b(compelling|personalized|sentence|summary|professional)\b/gi, '') // Remove meta words
            .replace(/\s+/g, ' ')
            .trim();
            
          if (summary.length > 50 && summary.length < 600 && !summary.toLowerCase().includes('write a') && !summary.toLowerCase().includes('create a')) {
            return summary;
          }
        }
      } catch (error) {
        console.log(`AI endpoint ${endpoint} failed, trying next...`);
        continue;
      }
    }

    // Enhanced personalized fallback templates using actual user data
    return generatePersonalizedFallback(userProfile);
  };

  // Generate personalized fallback based on actual user data
  const generatePersonalizedFallback = (profile) => {
    const skillsText = profile.skills ? profile.skills.split(',').slice(0, 4).join(', ') : 'modern technologies';
    const experienceText = profile.experience ? profile.experience.split('.')[0] : 'dedicated professional experience';
    const educationText = profile.education ? profile.education.split(',')[0] : 'strong educational background';
    const projectsText = profile.projects ? `with notable projects including ${profile.projects.split(',')[0]}` : 'with diverse project experience';
    const certificationsText = profile.certifications ? ` Certified in ${profile.certifications.split(',')[0]}.` : '';
    const languagesText = profile.languages ? ` Multilingual with proficiency in ${profile.languages}.` : '';
    
    // Multiple personalized templates using actual user data
    const personalizedTemplates = [
      `${experienceText} specializing in ${skillsText}. ${educationText} combined with hands-on expertise in delivering scalable solutions.${projectsText}, demonstrating strong problem-solving abilities and technical leadership.${certificationsText}${languagesText}`,
      
      `Accomplished ${profile.title} with expertise in ${skillsText} and ${experienceText}. ${educationText} supports a proven track record of successful project delivery.${projectsText} while maintaining high standards of code quality and performance.${certificationsText}`,
      
      `Results-driven ${profile.title} bringing together ${skillsText} expertise with ${educationText}. ${experienceText} includes ${projectsText}, showcasing ability to translate business requirements into technical solutions.${certificationsText}${languagesText}`,
      
      `Innovative ${profile.title} with comprehensive experience in ${skillsText}. ${educationText} and ${experienceText} enable effective leadership in complex technical projects.${projectsText}, emphasizing collaborative development and agile methodologies.${certificationsText}`,
      
      `Versatile ${profile.title} combining ${skillsText} technical skills with ${educationText}. ${experienceText} demonstrates consistent delivery of high-impact solutions.${projectsText} while fostering team collaboration and knowledge sharing.${certificationsText}${languagesText}`
    ];
    
    // Select template based on data richness and user profile characteristics
    let templateIndex = 0;
    
    if (profile.certifications && profile.languages) {
      templateIndex = 4; // Rich profile with certs and languages
    } else if (profile.projects && profile.projects.split(',').length > 2) {
      templateIndex = 2; // Project-heavy profile
    } else if (profile.experience && profile.experience.length > 100) {
      templateIndex = 1; // Experience-focused profile
    } else if (profile.skills && profile.skills.split(',').length > 5) {
      templateIndex = 3; // Skills-focused profile
    } else {
      templateIndex = 0; // Balanced profile
    }
    
    return personalizedTemplates[templateIndex]
      .replace(/\s+/g, ' ') // Clean up spacing
      .replace(/\.\./g, '.') // Fix double periods
      .trim();
  };

  // Enhanced Extract Text Function
  const extractText = (input, keys = []) => {
    if (typeof input === 'string') return input;
    if (Array.isArray(input)) {
      return input.map(i => extractText(i, keys)).join(', ');
    }
    if (typeof input === 'object' && input !== null) {
      const extracted = keys.map(k => input[k]).filter(Boolean);
      return extracted.length > 0 ? extracted.join(' | ') : Object.values(input).filter(v => v && typeof v === 'string').join(' | ');
    }
    return String(input);
  };

  // PROFESSIONAL SUMMARY WITH AI
  let summary = '';
  
  if (userData.prompt || userData.skills || userData.experience) {
    addSectionHeader('Summary');
    try {
      summary = await generateAISummary(userData);
    } catch (error) {
      summary = userData.prompt?.replace(/we are hiring/gi, 'seeking opportunities as')
        .replace(/we are looking for/gi, 'experienced')
        .replace(/we need/gi, 'skilled in')
        .replace(/candidate should/gi, 'I am') || 
        `Dedicated ${userData.title || 'professional'} with expertise in modern technologies. Proven track record of delivering high-quality solutions.`;
    }
    addContent(summary);
    currentY += 25; // Increased spacing
  }

  // EXPERIENCE SECTION
  if (userData.experience) {
    addSectionHeader('Experience');
    const experiences = Array.isArray(userData.experience) ? userData.experience : [userData.experience];
    experiences.forEach(exp => {
      const position = toTitleCase(extractText(exp, ['position']));
      const company = toTitleCase(extractText(exp, ['company']));
      const duration = extractText(exp, ['duration']);
      const location = toTitleCase(extractText(exp, ['location']));
      
      const experienceHeader = [position, company, duration, location].filter(Boolean).join(' • ');
      addContent(experienceHeader, true);
      
      if (exp.description) addContent(capitalizeFirstLetter(extractText(exp.description)));
      const items = exp.achievements || exp.responsibilities;
      if (items) {
        (Array.isArray(items) ? items : [extractText(items)]).forEach(item => addBulletPoint(capitalizeFirstLetter(item)));
      }
      currentY += 10;
    });
    currentY += 25; // Increased spacing
  }

  // EDUCATION SECTION
  if (userData.education) {
    addSectionHeader('Education');
    const educations = Array.isArray(userData.education) ? userData.education : [userData.education];
    educations.forEach(edu => {
      const degree = toTitleCase(extractText(edu, ['degree']));
      const institution = toTitleCase(extractText(edu, ['institution', 'school']));
      const year = extractText(edu, ['year']);
      const gpa = extractText(edu, ['gpa']);
      const field = toTitleCase(extractText(edu, ['field']));
      
      const educationInfo = [degree, institution, field, year, gpa].filter(Boolean).join(' • ');
      addContent(educationInfo, true);
    });
    currentY += 25; // Increased spacing
  }

  // SKILLS SECTION
  if (userData.skills && userData.skills.length) {
    addSectionHeader('Technical Skills');
    
    const skills = userData.skills.slice(0, 15).map(skill =>
      toTitleCase(extractText(skill, ['name', 'skill', 'title']))
    );
    addSkillTags(skills);
    currentY += 25; // Increased spacing
  }

  // PROJECTS WITH AI DESCRIPTIONS
  if (userData.projects?.length) {
    addSectionHeader('Projects');
    for (const project of userData.projects.slice(0, 4)) {
      const projectTitle = toTitleCase(extractText(project, ['name', 'title']));
      addContent(projectTitle, true);
      
      let projectDesc = extractText(project, ['description', 'technologies', 'tech_stack']);
      if (!projectDesc || projectDesc === projectTitle || projectDesc.length < 20) {
        projectDesc = await generateAIDescription(projectTitle, 'project');
      }
      addContent(capitalizeFirstLetter(projectDesc));
      
      const url = project.url || project.github || project.link;
      if (url) {
        ctx.fillStyle = '#666666';
        ctx.font = '12px Arial';
        ctx.fillText(`→ ${url.toLowerCase()}`, leftMargin, currentY);
        currentY += 20;
      }
      currentY += 10;
    }
    currentY += 15; // Increased spacing
  }

  // CERTIFICATIONS WITH AI DESCRIPTIONS
  if (userData.certifications?.length) {
    addSectionHeader('Certifications');
    for (const cert of userData.certifications.slice(0, 5)) {
      const certName = toTitleCase(extractText(cert, ['name', 'title', 'certification']));
      const certIssuer = toTitleCase(extractText(cert, ['issuer', 'organization', 'provider']));
      const certDate = extractText(cert, ['date', 'year', 'issued']);
      
      addContent(certName, true);
      const certDescription = await generateAIDescription(certName, 'certificate');
      addContent(capitalizeFirstLetter(certDescription));
      
      if (certIssuer || certDate) {
        const issuerInfo = [certIssuer, certDate].filter(Boolean).join(' • ');
        ctx.fillStyle = '#666666';
        ctx.font = '12px Arial';
        ctx.fillText(issuerInfo, leftMargin, currentY);
        currentY += 20;
      }
      currentY += 8;
    }
    currentY += 25; // Increased spacing
  }

  // LANGUAGES SECTION - MOVED TO END
  if (userData.languages && userData.languages.length) {
    addSectionHeader('Languages');
    
    userData.languages.slice(0, 8).forEach((lang, index) => {
      const langName = toTitleCase(extractText(lang, ['name', 'language', 'title']));
      const proficiency = toTitleCase(extractText(lang, ['level', 'proficiency', 'fluency']) || 'Conversational');
      
      // Language entry with proficiency dots
      ctx.fillStyle = '#000000';
      ctx.font = 'bold 14px Arial';
      ctx.fillText(langName, leftMargin, currentY);
      
      // Proficiency level with dots
      const proficiencyLevels = {
        'Native': 5, 'Fluent': 4, 'Advanced': 4, 'Intermediate': 3, 
        'Conversational': 2, 'Basic': 1, 'Beginner': 1
      };
      
      const level = proficiencyLevels[proficiency] || 3;
      const dotsX = leftMargin + ctx.measureText(langName).width + 20;
      
      for (let i = 0; i < 5; i++) {
        ctx.fillStyle = i < level ? '#000000' : '#e0e0e0';
        ctx.beginPath();
        ctx.arc(dotsX + (i * 12), currentY - 5, 3, 0, 2 * Math.PI);
        ctx.fill();
      }
      
      // Proficiency text
      ctx.fillStyle = '#666666';
      ctx.font = '12px Arial';
      ctx.fillText(proficiency, dotsX + 70, currentY);
      
      currentY += 22;
    });
    currentY += 25; // Increased spacing
  }

  // FOOTER - Elegant Black & White Design
  currentY = height - 60;
  
  // Designer footer separator
  ctx.strokeStyle = '#000000';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(leftMargin, currentY);
  ctx.lineTo(rightMargin, currentY);
  ctx.stroke();
  
  // Decorative pattern with circles
  for (let i = 0; i < 8; i++) {
    ctx.fillStyle = '#000000';
    ctx.beginPath();
    ctx.arc(leftMargin + (i * 20), currentY + 15, 3, 0, 2 * Math.PI);
    ctx.fill();
  }
  
  currentY += 35;
  ctx.fillStyle = '#666666';
  ctx.font = '11px Arial';
  ctx.textAlign = 'center';
  ctx.fillText('Generated by ElevateCV AI • Professional Resume Builder', width / 2, currentY);

  const buffer = canvas.toBuffer('image/png');
  const base64Image = buffer.toString('base64');
  const dataUrl = `data:image/png;base64,${base64Image}`;
  return { dataUrl, buffer };
};

// Word Wrap Helper
const wrapText = (ctx, text, maxWidth) => {
  const words = text.split(' ');
  const lines = [];
  let line = words[0];
  for (let i = 1; i < words.length; i++) {
    const testLine = line + ' ' + words[i];
    if (ctx.measureText(testLine).width < maxWidth) {
      line = testLine;
    } else {
      lines.push(line);
      line = words[i];
    }
  }
  lines.push(line);
  return lines;
};

// Capitalization Helper Functions
const toTitleCase = (str) => {
  if (!str || typeof str !== 'string') return str;
  
  // Words that should remain lowercase in titles
  const lowercaseWords = ['a', 'an', 'and', 'as', 'at', 'but', 'by', 'for', 'if', 'in', 'nor', 'of', 'on', 'or', 'so', 'the', 'to', 'up', 'yet'];
  
  return str.toLowerCase().split(' ').map((word, index) => {
    // Always capitalize the first word and words not in the lowercase list
    if (index === 0 || !lowercaseWords.includes(word)) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return word;
  }).join(' ');
};

const capitalizeFirstLetter = (str) => {
  if (!str || typeof str !== 'string') return str;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Round Rectangle Helper (for modern skill badges)
CanvasRenderingContext2D.prototype.roundRect = function (x, y, width, height, radius) {
  this.beginPath();
  this.moveTo(x + radius, y);
  this.lineTo(x + width - radius, y);
  this.quadraticCurveTo(x + width, y, x + width, y + radius);
  this.lineTo(x + width, y + height - radius);
  this.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  this.lineTo(x + radius, y + height);
  this.quadraticCurveTo(x, y + height, x, y + height - radius);
  this.lineTo(x, y + radius);
  this.quadraticCurveTo(x, y, x + radius, y);
  this.closePath();
};