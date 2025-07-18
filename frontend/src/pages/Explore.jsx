import React, { useState, useEffect, useContext } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { AppContext } from '../context/ContextProvider'

const Explore = () => {
  const { user } = useContext(AppContext)
  const [activeTab, setActiveTab] = useState('resumes')
  const [resumes, setResumes] = useState([])
  const [coverLetters, setCoverLetters] = useState([])
  const [loading, setLoading] = useState(false)

  // Fetch resumes data
  const fetchResumes = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/resume/explore`,
        { withCredentials: true }
      )
      
      console.log('Resume API Response:', response.data)
      
      if (response.data.success) {
        const resumeData = response.data.data || response.data.resumes || []
        console.log('Parsed Resume Data:', resumeData)
        setResumes(resumeData)
      } else if (Array.isArray(response.data)) {
        // Handle case where API returns array directly
        console.log('Direct Array Resume Data:', response.data)
        setResumes(response.data)
      } else {
        console.error('Failed to fetch resumes:', response.data.message)
        setResumes([])
      }
    } catch (error) {
      console.error('Error fetching resumes:', error)
      toast.error('Failed to load resumes')
      setResumes([])
    } finally {
      setLoading(false)
    }
  }

  // Fetch cover letters data
  const fetchCoverLetters = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/letter/explore`,
        { withCredentials: true }
      )
      
      console.log('Cover Letter API Response:', response.data)
      
      if (response.data.success) {
        const letterData = response.data.data || response.data.letters || []
        console.log('Parsed Cover Letter Data:', letterData)
        setCoverLetters(letterData)
      } else if (Array.isArray(response.data)) {
        // Handle case where API returns array directly
        console.log('Direct Array Cover Letter Data:', response.data)
        setCoverLetters(response.data)
      } else {
        console.error('Failed to fetch cover letters:', response.data.message)
        setCoverLetters([])
      }
    } catch (error) {
      console.error('Error fetching cover letters:', error)
      toast.error('Failed to load cover letters')
      setCoverLetters([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (user) {
      fetchResumes()
      fetchCoverLetters()
    }
  }, [user])

  // Debug logging
  useEffect(() => {
    console.log('Current resumes state:', resumes)
    console.log('Current coverLetters state:', coverLetters)
    console.log('Active tab:', activeTab)
  }, [resumes, coverLetters, activeTab])

  const handleDownload = (item, type) => {
    const downloadUrl = item.resumeUrl || item.letterUrl || item.imageUrl
    if (downloadUrl) {
      const link = document.createElement('a')
      link.href = downloadUrl
      link.download = `${type}-${item.name || item._id || item.id}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      toast.success(`${type} downloaded!`)
    } else {
      toast.error(`No downloadable ${type} available`)
    }
  }

  const ResumeCard = ({ resume }) => (
    <div className="bg-[var(--color-base-200)] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group">
      <div className="relative overflow-hidden">
        {resume.resumeUrl ? (
          <img 
            src={resume.resumeUrl} 
            alt={resume.name || 'Resume'}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-64 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
            <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => handleDownload(resume, 'resume')}
            className="w-full bg-white/90 hover:bg-white text-gray-800 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Resume
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-[var(--color-base-content)] mb-2 group-hover:text-[var(--color-primary)] transition-colors duration-200">
          {resume.name || 'Professional Resume'}
        </h3>
        <div className="space-y-2 text-sm text-[var(--color-base-content)] opacity-70">
          <div className="flex items-center">
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {resume.content}
          </div>
        </div>
        
        <div className="mt-4 text-xs text-[var(--color-base-content)] opacity-50">
          Created {resume.createdAt ? new Date(resume.createdAt).toLocaleDateString() : 'Recently'}
        </div>
      </div>
    </div>
  )

  const CoverLetterCard = ({ letter }) => (
    <div className="bg-[var(--color-base-200)] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 group">
      <div className="relative overflow-hidden">
        {letter.letterUrl || letter.imageUrl ? (
          <img 
            src={letter.letterUrl || letter.imageUrl} 
            alt={letter.name || 'Cover Letter'}
            className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-64 bg-gradient-to-br from-[var(--color-secondary)] to-[var(--color-primary)] flex items-center justify-center">
            <svg className="w-16 h-16 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute top-4 right-4">
          <span className="bg-[var(--color-secondary)] text-white px-2 py-1 rounded-full text-xs font-medium">
            Cover Letter
          </span>
        </div>
        <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={() => handleDownload(letter, 'cover-letter')}
            className="w-full bg-white/90 hover:bg-white text-gray-800 py-2 px-4 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center justify-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download Letter
          </button>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-[var(--color-base-content)] mb-2 group-hover:text-[var(--color-secondary)] transition-colors duration-200">
          {letter.name || 'Professional Cover Letter'}
        </h3>
        <div className="space-y-2 text-sm text-[var(--color-base-content)] opacity-70">
          {letter.email && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              {letter.email}
            </div>
          )}
          {letter.company && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {letter.company}
            </div>
          )}
          {letter.role && (
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H8a2 2 0 01-2-2V8a2 2 0 012-2z" />
              </svg>
              {letter.role}
            </div>
          )}
        </div>
        
        <div className="mt-4 text-xs text-[var(--color-base-content)] opacity-50">
          Created {letter.createdAt ? new Date(letter.createdAt).toLocaleDateString() : 'Recently'}
        </div>
      </div>
    </div>
  )

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--color-base-100)] py-8 px-4 pt-24">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-[var(--color-base-200)] rounded-2xl p-12 shadow-xl">
            <svg className="w-20 h-20 mx-auto mb-6 text-[var(--color-base-content)] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h2 className="text-3xl font-bold text-[var(--color-base-content)] mb-4">
              Login Required
            </h2>
            <p className="text-lg text-[var(--color-base-content)] opacity-70 mb-8">
              Please login to explore resumes and cover letters created by our community.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center px-8 py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Login to Continue
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[var(--color-base-100)] py-8 px-4 pt-24">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-[var(--color-base-content)] mb-4">
            Explore Creative Works
          </h1>
          <p className="text-lg text-[var(--color-base-content)] opacity-70 max-w-3xl mx-auto">
            Discover inspiring resumes and cover letters created by our community. Get ideas and see what makes applications stand out.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-[var(--color-base-200)] p-2 rounded-2xl shadow-lg">
            <div className="flex">
              <button
                onClick={() => setActiveTab('resumes')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center ${
                  activeTab === 'resumes'
                    ? 'bg-[var(--color-primary)] text-white shadow-lg transform scale-105'
                    : 'text-[var(--color-base-content)] hover:bg-[var(--color-base-300)]'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Resumes ({resumes.length})
              </button>
              <button
                onClick={() => setActiveTab('coverletters')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center ${
                  activeTab === 'coverletters'
                    ? 'bg-[var(--color-secondary)] text-white shadow-lg transform scale-105'
                    : 'text-[var(--color-base-content)] hover:bg-[var(--color-base-300)]'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                Cover Letters ({coverLetters.length})
              </button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
              <p className="text-[var(--color-base-content)] opacity-60">Loading...</p>
            </div>
          </div>
        ) : (
          /* Content Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
            {activeTab === 'resumes' ? (
              resumes.length > 0 ? (
                resumes.map((resume) => (
                  <ResumeCard key={resume._id || resume.id} resume={resume} />
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-[var(--color-base-300)] rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-[var(--color-base-content)] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--color-base-content)] mb-2">
                    No resumes found
                  </h3>
                  <p className="text-[var(--color-base-content)] opacity-60 mb-6">
                    Be the first to create and share a resume!
                  </p>
                  <Link
                    to="/generate-resume"
                    className="inline-flex items-center px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:scale-105 transition-all duration-200"
                  >
                    Create Resume
                  </Link>
                </div>
              )
            ) : (
              coverLetters.length > 0 ? (
                coverLetters.map((letter) => (
                  <CoverLetterCard key={letter._id || letter.id} letter={letter} />
                ))
              ) : (
                <div className="col-span-full text-center py-16">
                  <div className="w-24 h-24 mx-auto mb-6 bg-[var(--color-base-300)] rounded-full flex items-center justify-center">
                    <svg className="w-12 h-12 text-[var(--color-base-content)] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold text-[var(--color-base-content)] mb-2">
                    No cover letters found
                  </h3>
                  <p className="text-[var(--color-base-content)] opacity-60 mb-6">
                    Be the first to create and share a cover letter!
                  </p>
                  <Link
                    to="/generate-letter"
                    className="inline-flex items-center px-6 py-3 bg-[var(--color-secondary)] text-white rounded-xl font-semibold hover:scale-105 transition-all duration-200"
                  >
                    Create Cover Letter
                  </Link>
                </div>
              )
            )}
          </div>
        )}

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] rounded-2xl p-8 text-center text-white shadow-2xl">
          <h2 className="text-3xl font-bold mb-4">Create Your Own Masterpiece</h2>
          <p className="text-lg mb-6 opacity-90">
            Ready to create a professional resume or cover letter that stands out? Join our community and showcase your work!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/generate-resume"
              className="px-8 py-3 bg-white text-[var(--color-primary)] rounded-xl font-semibold hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Create Resume
            </Link>
            <Link
              to="/generate-letter"
              className="px-8 py-3 bg-white/20 backdrop-blur-sm text-white rounded-xl font-semibold hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl border border-white/30"
            >
              Create Cover Letter
            </Link>
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

export default Explore
