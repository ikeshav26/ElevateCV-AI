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



export const getAllResumes=async(req,res)=>{
  try{
    const userId=req.user;
    const resumes=await Resume.find({ userId }).sort({ createdAt: -1 });
    res.status(200).json(resumes);
  }catch(err){
    console.error('Error fetching resumes:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message || 'Unknown error occurred' });
  }
}


export const getResume=async(req,res)=>{
  try{
    const resumeId=req.params.id;
    const resume=await Resume.findById(resumeId);
    if(!resume){
      return res.status(404).json({ message: 'Resume not found' });
    }
    res.status(200).json(resume);
  }catch(err){
    console.error('Error fetching resume:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message || 'Unknown error occurred' });
  }
}



export const exploreResumes=async(req,res)=>{
  try{
    const resumes=await Resume.find({ isPublic: true }).sort({ createdAt: -1 });
    res.status(200).json(resumes);
  }catch(err){
    console.error('Error exploring resumes:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message || 'Unknown error occurred' });
  }
}


export const deleteResume=async (req, res) => {
  try{
    const resumeId=req.params.id;
    const resume=await Resume.findById(resumeId);
    if(!resume){
      return res.status(404).json({ message: 'Resume not found' });
    }
    // Delete resume from Cloudinary
    if (resume.resumeUrl) {
      const publicId = resume.resumeUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(`resumes/${publicId}`, { resource_type: 'image' });
    }
    // Delete resume from database
    await Resume.findByIdAndDelete(resumeId);
    res.status(200).json({ message: 'Resume deleted successfully' });
  }catch(err){
    console.error('Error deleting resume:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message || 'Unknown error occurred' });
  }
}



export const changeVisibility=async(req,res)=>{
  try{
    const resumeId=req.params.id;
    const userId=req.user;
    const { isPublic } = req.body;

    const updatedResume=await Resume.findOneAndUpdate(
      { _id: resumeId, userId },
      { isPublic },
      { new: true }
    );
    if(!updatedResume){
      return res.status(404).json({ message: 'Resume not found or you do not have permission to change visibility' });
    }
    res.status(200).json({ message: 'Resume visibility updated successfully', resume: updatedResume });
  }catch(err){
    console.error('Error changing resume visibility:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message || 'Unknown error occurred' });
  }
}