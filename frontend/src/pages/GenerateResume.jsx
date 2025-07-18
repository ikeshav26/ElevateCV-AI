import { useContext, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { AppContext } from '../context/ContextProvider'

const GenerateResume = () => {
  const [formData, setFormData] = useState({
    prompt: '',
    name: '',
    email: '',
    phone: '',
    skills: '',
    education: '',
    experience: '',
    projects: '',
    achievements: '',
    languages: '',
    certificates: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedResume, setGeneratedResume] = useState(null)
  const { navigate } = useContext(AppContext)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.email || !formData.phone) {
      toast.error("Please fill in all required fields (Name, Email, Phone)")
      return
    }

    setIsGenerating(true)
    
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      if (!user) {
        toast.error("Please login first")
        navigate('/login')
        return
      }

      // Smart backend formatting - handle any user input format
      const formatToBackend = (data) => {
        // Helper function to split text intelligently
        const smartSplit = (text, preferredSeparator = '\n') => {
          if (!text || !text.trim()) return []
          
          // Check if text contains line breaks
          if (text.includes('\n')) {
            return text.split('\n').map(item => item.trim()).filter(item => item)
          }
          
          // Check if text contains commas (for skills/languages)
          if (text.includes(',')) {
            return text.split(',').map(item => item.trim()).filter(item => item)
          }
          
          // Check if text contains semicolons
          if (text.includes(';')) {
            return text.split(';').map(item => item.trim()).filter(item => item)
          }
          
          // If no separators found, return as single item
          return [text.trim()]
        }

        // Create projects objects from any text format
        const createProjectObjects = (projectsText) => {
          if (!projectsText || !projectsText.trim()) return []
          
          const projects = smartSplit(projectsText)
          return projects.map(project => ({
            name: project.split(':')[0]?.trim() || project.split('-')[0]?.trim() || project.trim(),
            description: project.trim(),
            url: null,
            github: null,
            link: null
          }))
        }

        return {
          prompt: data.prompt || '',
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          skills: smartSplit(data.skills, ','),
          education: data.education ? [data.education.trim()] : [],
          experience: data.experience ? [data.experience.trim()] : [],
          projects: createProjectObjects(data.projects),
          achievements: smartSplit(data.achievements),
          languages: smartSplit(data.languages, ','),
          certificates: smartSplit(data.certificates)
        }
      }

      const formattedData = formatToBackend(formData)
      
      console.log('Sending formatted data:', formattedData)

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/resume/generate`,
        formattedData,
        {
          withCredentials: true,
        }
      )

      if (response.data.success !== false) {
        setGeneratedResume(response.data)
        toast.success("Resume generated successfully!")
      } else {
        toast.error("Failed to generate resume")
      }
    } catch (error) {
      console.error('Resume generation error:', error)
      toast.error(error.response?.data?.message || "Failed to generate resume")
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    if (!generatedResume?.downloadUrl) {
      toast.error("No resume to download")
      return
    }

    try {
      const response = await fetch(generatedResume.downloadUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${formData.name}_Resume.png`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
      toast.success("Resume downloaded successfully!")
    } catch (error) {
      console.error('Download error:', error)
      toast.error("Failed to download resume")
    }
  }

  const handleReset = () => {
    setFormData({
      prompt: '',
      name: '',
      email: '',
      phone: '',
      skills: '',
      education: '',
      experience: '',
      projects: '',
      achievements: '',
      languages: '',
      certificates: ''
    })
    setGeneratedResume(null)
  }

  return (
    <div className="min-h-screen bg-[var(--color-base-100)] py-8 px-4 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-[var(--color-base-content)] mb-4">
            Generate Your Professional Resume
          </h1>
          <p className="text-lg text-[var(--color-base-content)] opacity-70">
            Fill in your details and let AI create a stunning resume for you
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="bg-[var(--color-base-200)] rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-[var(--color-base-content)] mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Resume Information
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Description/Prompt */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                  Job Description / Prompt
                </label>
                <textarea
                  name="prompt"
                  value={formData.prompt}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Paste the job description or describe the type of role you're applying for..."
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
                />
              </div>

              {/* Personal Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="+1 (555) 123-4567"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                  required
                />
              </div>

              {/* Skills */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                  Skills
                </label>
                <textarea
                  name="skills"
                  value={formData.skills}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="List your technical and soft skills. You can separate them with commas, line breaks, or just write them naturally."
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
                />
              </div>

              {/* Education */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                  Education
                </label>
                <textarea
                  name="education"
                  value={formData.education}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Tell us about your educational background. Include your degree, university, graduation year, and any relevant coursework or achievements."
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                  Work Experience
                </label>
                <textarea
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Describe your work experience, including job titles, companies, dates, and key responsibilities or achievements. Write it naturally in your own words."
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
                />
              </div>

              {/* Projects */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                  Projects
                </label>
                <textarea
                  name="projects"
                  value={formData.projects}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="List your notable projects. You can describe each project on a new line, or write them in a paragraph. Include technologies used and key features."
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
                />
              </div>

              {/* Achievements */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                  Achievements
                </label>
                <textarea
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="Share your accomplishments, awards, recognitions, or any notable achievements. Write them in any format you prefer."
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
                />
              </div>

              {/* Languages */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                  Languages
                </label>
                <input
                  type="text"
                  name="languages"
                  value={formData.languages}
                  onChange={handleInputChange}
                  placeholder="List the languages you speak and your proficiency level. Any format works."
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
              </div>

              {/* Certificates */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                  Certificates
                </label>
                <textarea
                  name="certificates"
                  value={formData.certificates}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="List your certifications, licenses, or professional credentials. Include the issuing organization and year if available."
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="flex-1 py-3 px-6 rounded-xl bg-[var(--color-primary)] text-[var(--color-primary-content)] font-semibold hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  {isGenerating ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Generating Resume...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Generate Resume
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-3 px-6 rounded-xl bg-[var(--color-base-300)] text-[var(--color-base-content)] font-semibold hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Reset Form
                </button>
              </div>
            </form>
          </div>

          {/* Output Section */}
          <div className="bg-[var(--color-base-200)] rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-[var(--color-base-content)] mb-6 flex items-center">
              <svg className="w-6 h-6 mr-2 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Generated Resume
            </h2>

            {!generatedResume ? (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-[var(--color-base-300)] rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-[var(--color-base-content)] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-base-content)] mb-2">
                  No Resume Generated Yet
                </h3>
                <p className="text-[var(--color-base-content)] opacity-60">
                  Fill in the form and click "Generate Resume" to create your professional resume
                </p>
              </div>
            ) : (
              <div className="space-y-6">
                {/* Resume Preview */}
                <div className="bg-[var(--color-base-100)] rounded-xl p-4 border border-[var(--color-base-300)]">
                  <img
                    src={generatedResume.downloadUrl}
                    alt="Generated Resume"
                    className="w-full h-auto rounded-lg shadow-lg"
                  />
                </div>

                {/* Resume Info */}
                <div className="bg-[var(--color-base-100)] rounded-xl p-4 border border-[var(--color-base-300)]">
                  <h4 className="font-semibold text-[var(--color-base-content)] mb-2">Resume Details</h4>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-medium">Name:</span> {generatedResume.resume?.name}</p>
                    <p><span className="font-medium">Generated:</span> {new Date(generatedResume.resume?.createdAt).toLocaleDateString()}</p>
                    <p><span className="font-medium">Type:</span> {generatedResume.generationType}</p>
                    <p><span className="font-medium">Format:</span> {generatedResume.format?.toUpperCase()}</p>
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={handleDownload}
                  className="w-full py-3 px-6 rounded-xl bg-green-600 text-white font-semibold hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Download Resume
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default GenerateResume
