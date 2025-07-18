import cloudinary from "../config/cloudinary.js";
import Resume from "../models/resume.model.js";
import { generateResumeFromJobDescription } from "../utils/resume.js";
import htmlPdf from 'html-pdf-node';

export const generate = async (req, res) => {
  try {
    const userId = req.user;
    const {
      prompt,
      name,
      email,
      phone,
      skills,
      education,
      experience,
      projects,
      achievements,
      languages,
      certificates,
    } = req.body;
    
    const userData = {
        name,
        email,
        phone,
        skills,
        education,
        experience,
        projects,
        achievements,
        prompt, 
        certificates,
        languages
    }

    console.log('Generating resume for:', userData.name);
    const resumeData = await generateResumeFromJobDescription(userData);
    
    let uploadResult;
    
    // Always handle as image since we only generate images now
    if (resumeData && resumeData.imageData) {
      console.log('Resume image generated successfully, uploading to Cloudinary...');
      
      try {
        uploadResult = await cloudinary.uploader.upload(resumeData.imageData, {
          folder: 'resumes',
          resource_type: 'image',
          public_id: `resume_${userData.name.replace(/\s+/g, '_')}_${Date.now()}`,
          format: resumeData.format || 'png'
        });
      } catch (uploadError) {
        console.error('Failed to upload resume image to Cloudinary:', uploadError);
        return res.status(500).json({ message: "Failed to upload generated resume image" });
      }
      
    } else {
      console.error('Failed to generate resume image');
      return res.status(500).json({ message: "Failed to generate resume image" });
    } 

    // Save resume data to database
    const resume = new Resume({
      userId: userId,
      name,
      resumeUrl: uploadResult.secure_url,
      content: `Resume image generated using ${resumeData.model || 'AI'}`
    });
    
    await resume.save();

    res.status(201).json({
      message: "Resume image generated and uploaded successfully",
      resume: {
        id: resume._id,
        name: resume.name,
        email: resume.email,
        resumeUrl: resume.resumeUrl,
        createdAt: resume.createdAt
      },
      downloadUrl: uploadResult.secure_url,
      generationType: resumeData.success ? 'AI_IMAGE' : 'TEMPLATE_IMAGE',
      model: resumeData.model,
      format: resumeData.format
    });

  } catch (error) {
    console.error("Error in generate controller:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
