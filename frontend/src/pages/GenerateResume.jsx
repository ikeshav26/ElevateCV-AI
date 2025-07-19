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
  const { navigate ,setuser} = useContext(AppContext)

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

      // Send raw data to backend - let Gemini AI handle the refinement
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/resume/generate`,
        formData, // Send raw form data directly
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
      if (
        error.message === "Unauthorized" ||
        error.response?.status === 401 ||
        error.response?.data?.message === "Unauthorized"
      ) {
        if (typeof setuser === 'function') setuser(false);
      } else {
        console.error('Resume generation error:', error)
        toast.error(error.response?.data?.message || "Failed to generate resume")
      }
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

  const handleFillSampleData = () => {
    setFormData({
      prompt: "I'm applying for a Senior Full Stack Developer position at a growing tech company. Looking for a role where I can lead development projects, work with modern JavaScript frameworks like React and Node.js, mentor junior developers, and contribute to architectural decisions for scalable web applications.",
      name: "Alex Chen",
      email: "alex.chen@email.com",
      phone: "(555) 123-4567",
      skills: "JavaScript, TypeScript, React, Node.js, Express, MongoDB, PostgreSQL, AWS, Docker, Git, Python, HTML, CSS, Tailwind CSS, REST APIs, GraphQL, Microservices, Agile Development, Team Leadership, Problem Solving, Code Review, Mentoring",
      education: "Bachelor of Science in Computer Science\nStanford University\nGraduated: May 2020\nGPA: 3.7/4.0\nRelevant Coursework: Data Structures, Algorithms, Database Systems, Software Engineering, Web Development, Machine Learning",
      experience: "Full Stack Developer at TechStart Inc.\nJune 2021 - Present\n- Developed and maintained 5+ web applications using React and Node.js serving over 10,000 users\n- Led a team of 3 junior developers and conducted weekly code reviews\n- Improved application performance by 40% through database optimization and caching strategies\n- Implemented CI/CD pipelines using GitHub Actions reducing deployment time by 60%\n- Collaborated with product managers and designers to deliver features on schedule\n\nJunior Developer at WebSolutions LLC\nJanuary 2021 - May 2021\n- Built responsive web interfaces using React and modern CSS frameworks\n- Integrated third-party APIs and payment gateways for e-commerce platforms\n- Participated in daily standups and sprint planning meetings\n- Wrote unit tests achieving 85% code coverage",
      projects: "E-Commerce Platform \"ShopEasy\"\n- Developed a full-stack e-commerce platform with React frontend and Node.js backend\n- Implemented user authentication, product catalog, shopping cart, and payment processing using Stripe\n- Used MongoDB for data storage and Redis for session management and caching\n- Deployed on AWS EC2 with auto-scaling and load balancing\n- Achieved 99.9% uptime and handles 1000+ concurrent users\n- GitHub: github.com/alexchen/shopeasy\n\nReal-Time Chat Application \"ChatFlow\"\n- Built a real-time messaging app using React, Socket.io, and Node.js\n- Implemented features like private messaging, group chats, file sharing, and emoji reactions\n- Used JWT for authentication and bcrypt for password hashing\n- Integrated with AWS S3 for file storage\n- Supports 500+ simultaneous connections with sub-second message delivery",
      achievements: "Employee of the Month - TechStart Inc. (March 2023, August 2023)\nFirst Place - University Hackathon 2020 (built COVID-19 tracking dashboard)\nDean's List - Fall 2018, Spring 2019, Fall 2019\nCompleted 30+ online courses on advanced JavaScript and cloud computing\nOpen Source Contributor - 15+ contributions to popular GitHub repositories\nMentor for 5+ junior developers through company mentorship program\nLed successful migration of legacy system to modern tech stack saving company $50K annually",
      languages: "English (Native), Mandarin (Fluent), Spanish (Conversational), German (Basic)",
      certificates: "AWS Certified Solutions Architect - Associate (Valid until Dec 2025)\nGoogle Cloud Professional Developer (Issued: Jan 2023)\nMongoDB Certified Developer Associate (Issued: Sep 2022)\nScrum Master Certification (PSM I) - Scrum.org (Issued: Jun 2023)\nFreeCodeCamp Full Stack Developer Certificate (Completed: Dec 2020)"
    })
    toast.success("Sample data filled! Edit as needed and generate your resume.")
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

        {/* Help Section */}
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl shadow-xl p-6 mb-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-4 md:mb-0">
              <h3 className="text-xl font-bold mb-2 flex items-center">
                <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Need Help Getting Started?
              </h3>
              <p className="text-white opacity-90">
                Not sure how to fill out the form? Try our sample data to see how it works!
              </p>
            </div>
            <button
              onClick={handleFillSampleData}
              className="bg-white text-[var(--color-primary)] px-6 py-3 rounded-xl font-semibold hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Fill Sample Data
            </button>
          </div>
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

            {/* Quick Tips */}
            <div className="bg-[var(--color-base-100)] rounded-xl p-4 mb-6 border border-[var(--color-base-300)]">
              <h4 className="font-semibold text-[var(--color-base-content)] mb-2 flex items-center">
                <svg className="w-5 h-5 mr-2 text-[var(--color-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                💡 Pro Tips
              </h4>
              <ul className="text-sm text-[var(--color-base-content)] opacity-80 space-y-1">
                <li>• <strong>Write naturally:</strong> Use your own words - AI will make it professional</li>
                <li>• <strong>Include numbers:</strong> "Led team of 5", "Improved performance by 40%"</li>
                <li>• <strong>Be specific:</strong> Mention technologies, tools, and concrete achievements</li>
                <li>• <strong>Use action words:</strong> "Developed", "Led", "Implemented", "Achieved"</li>
              </ul>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Job Description/Prompt */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                  Job Description / Target Role
                </label>
                <textarea
                  name="prompt"
                  value={formData.prompt}
                  onChange={handleInputChange}
                  rows="4"
                  placeholder="Paste the job description you're applying for, or describe your target role (e.g., 'Full Stack Developer', 'Data Scientist', 'Product Manager'). This helps AI tailor your resume perfectly."
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
                  placeholder="List your technical and soft skills. Examples: JavaScript, React, Node.js, Python, Team Leadership, Problem Solving, Communication. AI will organize and prioritize them based on your target role."
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
                  placeholder="Share your educational background. Include degrees, institutions, graduation years, relevant coursework, GPA if strong. Example: Bachelor of Science in Computer Science, XYZ University, 2020-2024, GPA: 3.8/4.0"
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
                  placeholder="Describe your work experience, internships, part-time jobs. Include company names, positions, dates, and key accomplishments. Focus on quantifiable achievements and relevant responsibilities."
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
                  placeholder="Highlight your best projects - personal, academic, or professional. Include project names, technologies used, brief descriptions, and links if available. Focus on projects relevant to your target role."
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent resize-none"
                />
              </div>

              {/* Achievements */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                  Achievements & Awards
                </label>
                <textarea
                  name="achievements"
                  value={formData.achievements}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="List your notable achievements, awards, honors, scholarships, competition wins, publications, or recognition. Include dates and brief context where relevant."
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
                  placeholder="List languages you speak and your proficiency level. Example: English (Native), Spanish (Fluent), French (Conversational), Mandarin (Basic)"
                  className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                />
              </div>

              {/* Certificates */}
              <div>
                <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                  Certifications
                </label>
                <textarea
                  name="certificates"
                  value={formData.certificates}
                  onChange={handleInputChange}
                  rows="3"
                  placeholder="List relevant certifications, professional licenses, or completed courses. Include issuing organizations and dates. Example: AWS Certified Developer (2023), Google Analytics Certified (2024)"
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
                  onClick={handleFillSampleData}
                  className="py-3 px-6 rounded-xl bg-[var(--color-secondary)] text-[var(--color-secondary-content)] font-semibold hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Try Sample
                </button>
                <button
                  type="button"
                  onClick={handleReset}
                  className="py-3 px-6 rounded-xl bg-[var(--color-base-300)] text-[var(--color-base-content)] font-semibold hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Clear Form
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

export default GenerateResume
