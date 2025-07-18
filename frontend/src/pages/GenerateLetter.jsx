import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { AppContext } from '../context/ContextProvider'

const GenerateLetter = () => {
  const { user } = useContext(AppContext)
  const [formData, setFormData] = useState({
    prompt: '',
    companyName: '',
    positionTitle: '',
    jobDescription: '',
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      address: ''
    },
    experience: '',
    skills: '',
    achievements: '',
    motivation: ''
  })
  const [generatedLetter, setGeneratedLetter] = useState('')
  const [letterImageUrl, setLetterImageUrl] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [imageLoading, setImageLoading] = useState(false)
  const [imageError, setImageError] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    
    if (name.startsWith('personalInfo.')) {
      const field = name.split('.')[1]
      setFormData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          [field]: value
        }
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!user) {
      toast.error("Please login to generate cover letters")
      return
    }

    if (!formData.prompt || !formData.companyName || !formData.positionTitle || !formData.personalInfo.name || !formData.personalInfo.email) {
      const missingFields = []
      if (!formData.prompt) missingFields.push("Letter Prompt")
      if (!formData.companyName) missingFields.push("Company Name")  
      if (!formData.positionTitle) missingFields.push("Position Title")
      if (!formData.personalInfo.name) missingFields.push("Full Name")
      if (!formData.personalInfo.email) missingFields.push("Email")
      
      toast.error(`Please fill in required fields: ${missingFields.join(", ")}`)
      return
    }

    setIsGenerating(true)
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/letter/generate`,
        {
          prompt: formData.prompt,
          name: formData.personalInfo.name,
          email: formData.personalInfo.email,
          jobTitle: formData.positionTitle, // Backend expects jobTitle for validation
          role: formData.positionTitle, // Backend model expects role
          company: formData.companyName,
          phone: formData.personalInfo.phone || '',
          address: formData.personalInfo.address || '',
          description: formData.jobDescription || formData.positionTitle, // Backend model expects description
          experience: formData.experience || '',
          skills: formData.skills || '',
          achievements: formData.achievements || '',
          motivation: formData.motivation || ''
        },
        { withCredentials: true }
      )

      if (response.data.success) {
        const responseData = response.data.data
        let letterContent = ''
        let imageUrl = ''
        
        // Extract image URL from response
        if (responseData?.letterUrl) {
          imageUrl = responseData.letterUrl
        }
        
        // Handle different response structures from backend for fallback text
        if (typeof responseData === 'string') {
          letterContent = responseData
        } else if (responseData?.letter) {
          if (typeof responseData.letter === 'string') {
            letterContent = responseData.letter
          } else if (responseData.letter?.paragraphs && Array.isArray(responseData.letter.paragraphs)) {
            letterContent = responseData.letter.paragraphs.join('\n\n')
          } else if (responseData.letter?.content) {
            letterContent = responseData.letter.content
          }
        } else if (responseData?.content) {
          letterContent = responseData.content
        } else if (responseData?.paragraphs && Array.isArray(responseData.paragraphs)) {
          letterContent = responseData.paragraphs.join('\n\n')
        }
        
        if (imageUrl) {
          setLetterImageUrl(imageUrl)
          setGeneratedLetter(letterContent) // Keep text as fallback
          setImageLoading(true) // Start loading image
          setImageError(false)
          toast.success("Cover letter generated successfully!")
          
          // Scroll to the generated letter
          setTimeout(() => {
            document.getElementById('generated-letter')?.scrollIntoView({ 
              behavior: 'smooth' 
            })
          }, 100)
          setFormData({
            prompt: '',
            companyName: '',
            positionTitle: '',
            jobDescription: '',
            personalInfo: {
              name: '',
              email: '',
              phone: '',
              address: ''
            },
            experience: '',
            skills: '',
            achievements: '',
            motivation: ''
          })
        } else if (letterContent && letterContent.trim()) {
          setGeneratedLetter(letterContent)
          setLetterImageUrl('')
          toast.success("Cover letter generated successfully!")
          
          // Scroll to the generated letter
          setTimeout(() => {
            document.getElementById('generated-letter')?.scrollIntoView({ 
              behavior: 'smooth' 
            })
          }, 100)
        } else {
          console.log('Response data structure:', responseData)
          toast.error("Generated letter content is empty or in unexpected format")
        }
      } else {
        toast.error(response.data.message || "Failed to generate cover letter")
      }
    } catch (error) {
      console.error('Cover letter generation error:', error)
      
      if (error.response) {
        // Server responded with error status
        const errorMessage = error.response.data?.message || error.response.data?.error || "Server error occurred"
        toast.error(errorMessage)
      } else if (error.request) {
        // Network error
        toast.error("Network error. Please check your connection.")
      } else {
        // Other error
        toast.error("An unexpected error occurred")
      }
    } finally {
      setIsGenerating(false)
    }
  }

  const handleClear = () => {
    setFormData({
      prompt: '',
      companyName: '',
      positionTitle: '',
      jobDescription: '',
      personalInfo: {
        name: '',
        email: '',
        phone: '',
        address: ''
      },
      experience: '',
      skills: '',
      achievements: '',
      motivation: ''
    })
    setGeneratedLetter('')
    setLetterImageUrl('')
    setImageLoading(false)
    setImageError(false)
    toast.success("Form cleared!")
  }

  const handleFillSampleData = () => {
    setFormData({
      prompt: "Generate a professional cover letter for a software developer position",
      companyName: "TechCorp Solutions",
      positionTitle: "Full Stack Developer",
      jobDescription: "We are looking for a skilled Full Stack Developer to join our team. The ideal candidate should have experience with React, Node.js, and modern web technologies. You'll be responsible for developing scalable web applications and collaborating with cross-functional teams.",
      personalInfo: {
        name: "Alex Johnson",
        email: "alex.johnson@email.com",
        phone: "+1 (555) 123-4567",
        address: "123 Tech Street, Silicon Valley, CA 94000"
      },
      experience: "3+ years of full-stack development experience with expertise in React, Node.js, and PostgreSQL. Previously worked at StartupXYZ where I led the development of their main product platform, resulting in 40% increased user engagement.",
      skills: "JavaScript, TypeScript, React, Node.js, Express, PostgreSQL, MongoDB, AWS, Git, Docker, RESTful APIs, GraphQL",
      achievements: "Led development of a customer management system that increased efficiency by 35%. Contributed to open-source projects with over 500 GitHub stars. Mentored 3 junior developers.",
      motivation: "I'm passionate about creating innovative solutions that solve real-world problems. TechCorp's mission to democratize technology access aligns perfectly with my values, and I'm excited about the opportunity to contribute to your team's success."
    })
    toast.success("Sample data filled! Feel free to modify any fields.")
  }

  const copyToClipboard = async () => {
    try {
      if (generatedLetter) {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(generatedLetter)
          toast.success("Cover letter copied to clipboard!")
        } else {
          // Fallback for older browsers or non-secure contexts
          const textArea = document.createElement('textarea')
          textArea.value = generatedLetter
          textArea.style.position = 'fixed'
          textArea.style.left = '-999999px'
          textArea.style.top = '-999999px'
          document.body.appendChild(textArea)
          textArea.focus()
          textArea.select()
          document.execCommand('copy')
          textArea.remove()
          toast.success("Cover letter copied to clipboard!")
        }
      } else {
        toast.error("No text content available to copy")
      }
    } catch (error) {
      console.error('Copy to clipboard failed:', error)
      toast.error("Failed to copy to clipboard")
    }
  }

  const downloadImage = () => {
    if (letterImageUrl) {
      const link = document.createElement('a')
      link.href = letterImageUrl
      link.download = 'cover-letter.png'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success("Cover letter image downloaded!")
    } else {
      toast.error("No image available to download")
    }
  }

  return (
    <div className="min-h-screen bg-[var(--color-base-100)] py-8 px-4 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--color-base-content)] mb-4">
            AI Cover Letter Generator
          </h1>
          <p className="text-lg text-[var(--color-base-content)] opacity-70 max-w-3xl mx-auto">
            Create compelling, personalized cover letters that grab employers' attention and showcase your unique value proposition.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Form Section */}
          <div className="space-y-6">
            <div className="bg-[var(--color-base-200)] rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-[var(--color-base-content)] flex items-center">
                  <svg className="w-6 h-6 mr-2 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Letter Details
                </h2>
                <button
                  onClick={handleFillSampleData}
                  className="px-4 py-2 bg-[var(--color-secondary)] text-white rounded-lg hover:scale-105 transition-all duration-200 text-sm font-medium"
                >
                  Try Sample Data
                </button>
              </div>

              {/* Tips Section */}
              <div className="bg-[var(--color-base-100)] rounded-xl p-4 mb-6 border border-[var(--color-base-300)]">
                <h4 className="font-semibold text-[var(--color-base-content)] mb-2 flex items-center">
                  <svg className="w-5 h-5 mr-2 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  💡 Pro Tips for Better Cover Letters
                </h4>
                <ul className="text-sm text-[var(--color-base-content)] opacity-80 space-y-1">
                  <li>• Research the company and mention specific details about their mission or recent news</li>
                  <li>• Quantify your achievements with numbers and percentages where possible</li>
                  <li>• Match your skills to the job requirements mentioned in the description</li>
                  <li>• Show enthusiasm and explain why you want to work at this specific company</li>
                  <li>• Keep it concise but comprehensive - aim for 3-4 paragraphs</li>
                </ul>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <fieldset disabled={isGenerating} className="space-y-6">
                {/* Prompt */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                    Letter Prompt *
                  </label>
                  <textarea
                    name="prompt"
                    value={formData.prompt}
                    onChange={handleChange}
                    rows="2"
                    placeholder="Describe what kind of cover letter you need (e.g., 'Generate a professional cover letter for a marketing manager position emphasizing my creative skills and campaign management experience')"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none disabled:opacity-50"
                    required
                  />
                </div>

                {/* Company & Position */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                      Company Name *
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleChange}
                      placeholder="e.g., Google, Microsoft, StartupXYZ"
                      className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                      Position Title *
                    </label>
                    <input
                      type="text"
                      name="positionTitle"
                      value={formData.positionTitle}
                      onChange={handleChange}
                      placeholder="e.g., Software Engineer, Marketing Manager"
                      className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                      required
                    />
                  </div>
                </div>

                {/* Job Description */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                    Job Description
                    <span className="text-xs text-[var(--color-base-content)] opacity-60 ml-1">(Optional - helps improve letter quality)</span>
                  </label>
                  <textarea
                    name="jobDescription"
                    value={formData.jobDescription}
                    onChange={handleChange}
                    rows="4"
                    placeholder="Paste the job description here to help AI tailor your letter to the specific requirements..."
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
                  />
                </div>

                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-base-content)] mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        name="personalInfo.name"
                        value={formData.personalInfo.name}
                        onChange={handleChange}
                        placeholder="Your full name"
                        className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        name="personalInfo.email"
                        value={formData.personalInfo.email}
                        onChange={handleChange}
                        placeholder="your.email@example.com"
                        className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        name="personalInfo.phone"
                        value={formData.personalInfo.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 123-4567"
                        className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                        Address
                      </label>
                      <input
                        type="text"
                        name="personalInfo.address"
                        value={formData.personalInfo.address}
                        onChange={handleChange}
                        placeholder="City, State, Country"
                        className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                      />
                    </div>
                  </div>
                </div>

                {/* Experience */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                    Relevant Experience
                  </label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Describe your relevant work experience, including specific achievements and responsibilities..."
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
                  />
                </div>

                {/* Skills */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                    Key Skills
                  </label>
                  <textarea
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    rows="2"
                    placeholder="List your most relevant skills for this position (e.g., JavaScript, Project Management, Data Analysis, etc.)"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
                  />
                </div>

                {/* Achievements */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                    Notable Achievements
                  </label>
                  <textarea
                    name="achievements"
                    value={formData.achievements}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Highlight your key accomplishments with specific numbers and results when possible..."
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
                  />
                </div>

                {/* Motivation */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                    Why This Company/Role?
                  </label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleChange}
                    rows="3"
                    placeholder="Explain why you're interested in this specific company and role. What excites you about this opportunity?"
                    className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
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
                        Generating Cover Letter...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Generate Cover Letter
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleClear}
                    disabled={isGenerating}
                    className="py-3 px-6 rounded-xl bg-[var(--color-base-300)] text-[var(--color-base-content)] font-semibold hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Clear Form
                  </button>
                </div>
                </fieldset>
              </form>
            </div>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <div className="bg-[var(--color-base-200)] rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-[var(--color-base-content)] mb-6 flex items-center">
                <svg className="w-6 h-6 mr-2 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Your Cover Letter
              </h2>

              {!generatedLetter && !letterImageUrl ? (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-[var(--color-base-300)] rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-[var(--color-base-content)] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--color-base-content)] mb-2">
                    Ready to Create Your Cover Letter!
                  </h3>
                  <p className="text-[var(--color-base-content)] opacity-60">
                    Fill in the form details and click "Generate Cover Letter" to create your personalized letter
                  </p>
                </div>
              ) : (
                <div id="generated-letter" className="space-y-4">
                  {letterImageUrl ? (
                    <div className="bg-white rounded-2xl p-4 shadow-2xl border-2 border-[var(--color-primary)] relative overflow-hidden">
                      {/* Header with title and actions */}
                      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200">
                        <div className="flex items-center">
                          <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                          <h3 className="text-lg font-semibold text-gray-800">Your Professional Cover Letter</h3>
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={downloadImage}
                            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:scale-105 transition-all duration-200 text-sm font-medium flex items-center shadow-md"
                          >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            Download
                          </button>
                          {generatedLetter && (
                            <button
                              onClick={copyToClipboard}
                              className="px-4 py-2 bg-[var(--color-secondary)] text-white rounded-lg hover:scale-105 transition-all duration-200 text-sm font-medium flex items-center shadow-md"
                            >
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                              </svg>
                              Copy Text
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Image Display Area */}
                      <div className="relative bg-gray-50 rounded-xl overflow-hidden" style={{ minHeight: '600px' }}>
                        {imageLoading && !imageError && (
                          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
                            <div className="text-center">
                              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
                              <p className="text-gray-600">Loading your cover letter image...</p>
                            </div>
                          </div>
                        )}
                        <img 
                          src={letterImageUrl} 
                          alt="Generated Cover Letter" 
                          className={`w-full rounded-lg transition-opacity duration-300 cursor-pointer hover:opacity-90 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                          style={{ maxHeight: '1000px', objectFit: 'contain' }}
                          onLoad={() => setImageLoading(false)}
                          onError={() => {
                            setImageError(true)
                            setImageLoading(false)
                          }}
                          onClick={() => window.open(letterImageUrl, '_blank')}
                        />
                        {imageError && (
                          <div className="absolute inset-0 flex items-center justify-center bg-red-50">
                            <div className="text-center">
                              <svg className="w-12 h-12 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <p className="text-red-600">Failed to load image</p>
                              <button 
                                onClick={() => {
                                  setImageError(false)
                                  setImageLoading(true)
                                }}
                                className="mt-2 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                              >
                                Retry
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {/* Zoom hint */}
                        {!imageLoading && !imageError && (
                          <div className="absolute bottom-4 right-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs opacity-70 hover:opacity-100 transition-opacity">
                            Click to view full size
                          </div>
                        )}
                      </div>

                      {/* Success indicator */}
                      <div className="mt-4 flex items-center justify-center text-green-600">
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="text-sm font-medium">Ready to download or copy!</span>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-[var(--color-base-100)] rounded-xl p-6 border border-[var(--color-base-300)] relative">
                      <div className="absolute top-4 right-4">
                        <button
                          onClick={copyToClipboard}
                          className="px-3 py-1 bg-[var(--color-primary)] text-white rounded-lg hover:scale-105 transition-all duration-200 text-sm font-medium flex items-center"
                        >
                          <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy
                        </button>
                      </div>
                      <pre className="whitespace-pre-wrap text-[var(--color-base-content)] text-sm leading-relaxed pr-16">
                        {generatedLetter}
                      </pre>
                    </div>
                  )}
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    {letterImageUrl ? (
                      <>
                        <button
                          onClick={downloadImage}
                          className="flex-1 py-3 px-6 rounded-xl bg-[var(--color-primary)] text-white font-semibold hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                        >
                          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Download Image
                        </button>
                        {generatedLetter && (
                          <button
                            onClick={copyToClipboard}
                            className="flex-1 py-3 px-6 rounded-xl bg-[var(--color-secondary)] text-white font-semibold hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                          >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                          </svg>
                          Copy Text
                          </button>
                        )}
                      </>
                    ) : (
                      <button
                        onClick={copyToClipboard}
                        className="flex-1 py-3 px-6 rounded-xl bg-[var(--color-secondary)] text-white font-semibold hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                      >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                        Copy to Clipboard
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Back to Home Link */}
        <div className="text-center mt-8">
          <Link
            to="/"
            className="inline-flex items-center text-[var(--color-primary)] hover:text-[var(--color-secondary)] transition-colors duration-300"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

export default GenerateLetter
