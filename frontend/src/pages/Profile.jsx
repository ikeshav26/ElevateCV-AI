import React, { useState, useEffect, useContext, useRef } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { AppContext } from '../context/ContextProvider'

const Profile = () => {
  const { user, setUser } = useContext(AppContext)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')
  const [userResumes, setUserResumes] = useState([])
  const [userCoverLetters, setUserCoverLetters] = useState([])
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    avatar: null
  })
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (user) {
      setProfileData({
        username: user.username || user.name || '',
        email: user.email || '',
        avatar: user.avatar || null
      })
      fetchUserContent()
    }
  }, [user])

  // Debug state changes
  useEffect(() => {
    console.log('User Resumes State:', userResumes)
  }, [userResumes])

  useEffect(() => {
    console.log('User Cover Letters State:', userCoverLetters)
  }, [userCoverLetters])

  // Fetch user's created content
  const fetchUserContent = async () => {
    if (!user) return
    
    setLoading(true)
    try {
      const [resumesResponse, lettersResponse] = await Promise.all([
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/resume/all`, { withCredentials: true }),
        axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/letter/all`, { withCredentials: true })
      ])

      console.log('Resumes Response:', resumesResponse.data)
      console.log('Letters Response:', lettersResponse.data)

      // Handle resume data - it might be direct array or wrapped in success response
      if (Array.isArray(resumesResponse.data)) {
        setUserResumes(resumesResponse.data)
      } else if (resumesResponse.data.success && resumesResponse.data.data) {
        setUserResumes(resumesResponse.data.data)
      } else if (resumesResponse.data.resumes) {
        setUserResumes(resumesResponse.data.resumes)
      } else {
        setUserResumes([])
      }

      // Handle cover letter data - it might be direct array or wrapped in success response
      if (Array.isArray(lettersResponse.data)) {
        setUserCoverLetters(lettersResponse.data)
      } else if (lettersResponse.data.success && lettersResponse.data.data) {
        setUserCoverLetters(lettersResponse.data.data)
      } else if (lettersResponse.data.letters) {
        setUserCoverLetters(lettersResponse.data.letters)
      } else {
        setUserCoverLetters([])
      }

    } catch (error) {
      console.error('Error fetching user content:', error)
      toast.error('Failed to load your content')
      setUserResumes([])
      setUserCoverLetters([])
    } finally {
      setLoading(false)
    }
  }

  // Refresh user data from backend
  const refreshUserData = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/me`,
        { withCredentials: true }
      )
      
      console.log('Refreshed user data:', response.data)
      let newUser = null;
      if (response.data && response.data.user) {
        newUser = response.data.user;
        setUser(newUser)
      } else if (response.data && response.data._id) {
        newUser = response.data;
        setUser(newUser)
      }
      if (newUser) {
        setProfileData({
          username: newUser.username || newUser.name || '',
          email: newUser.email || '',
          avatar: newUser.avatar || null
        })
      }
    } catch (error) {
      console.error('Error refreshing user data:', error)
    }
  }

  // Convert image to base64
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  // Handle profile picture upload
  const handleAvatarUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    setUploading(true)
    try {
      const base64 = await convertToBase64(file)
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/add-avatar`,
        { avatar: base64 },
        { withCredentials: true }
      )
      if (response.status === 200 && (response.data.success === true || response.data.success === undefined)) {
        toast.success('Profile picture updated successfully!')
        await refreshUserData(); // <-- refresh user context and profileData
      } else {
        toast.error('Failed to update profile picture')
      }
    } catch (error) {
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  // Handle username update
  const handleUsernameUpdate = async () => {
    if (!profileData.username.trim()) {
      toast.error('Username cannot be empty')
      return
    }
    setLoading(true)
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/change-username`,
        { newUsername: profileData.username },
        { withCredentials: true }
      )
      if (response.status === 200 && (response.data.success === true || response.data.success === undefined)) {
        toast.success('Username updated successfully!')
        await refreshUserData(); // <-- refresh user context and profileData
      } else {
        toast.error('Failed to update username')
      }
    } catch (error) {
      toast.error('Failed to update username')
    } finally {
      setLoading(false)
    }
  }

  // Toggle resume visibility
  const toggleResumeVisibility = async (resumeId, currentVisibility) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/resume/visibility/${resumeId}`,
        { withCredentials: true }
      )

      console.log('Resume visibility response:', response.data)

      // Update state optimistically (assume success)
      setUserResumes(prev => prev.map(resume => 
        resume._id === resumeId 
          ? { ...resume, isPublic: !currentVisibility }
          : resume
      ))
      
      // Show success message
      toast.success(`Resume ${!currentVisibility ? 'made public' : 'made private'}`)
      
      // If response indicates failure, revert the change
      if (response.data.success === false) {
        console.log('Reverting visibility change due to API failure')
        setUserResumes(prev => prev.map(resume => 
          resume._id === resumeId 
            ? { ...resume, isPublic: currentVisibility }
            : resume
        ))
        toast.error('Failed to update visibility')
      }
    } catch (error) {
      console.error('Error toggling resume visibility:', error)
      // Revert the optimistic update
      setUserResumes(prev => prev.map(resume => 
        resume._id === resumeId 
          ? { ...resume, isPublic: currentVisibility }
          : resume
      ))
      toast.error('Failed to update visibility')
    }
  }

  // Toggle cover letter visibility
  const toggleLetterVisibility = async (letterId, currentVisibility) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/letter/visibility/${letterId}`,
        { withCredentials: true }
      )

      console.log('Letter visibility response:', response.data)

      // Update state optimistically (assume success)
      setUserCoverLetters(prev => prev.map(letter => 
        letter._id === letterId 
          ? { ...letter, isPublic: !currentVisibility }
          : letter
      ))
      
      // Show success message
      toast.success(`Cover letter ${!currentVisibility ? 'made public' : 'made private'}`)
      
      // If response indicates failure, revert the change
      if (response.data.success === false) {
        console.log('Reverting letter visibility change due to API failure')
        setUserCoverLetters(prev => prev.map(letter => 
          letter._id === letterId 
            ? { ...letter, isPublic: currentVisibility }
            : letter
        ))
        toast.error('Failed to update visibility')
      }
    } catch (error) {
      console.error('Error toggling letter visibility:', error)
      // Revert the optimistic update
      setUserCoverLetters(prev => prev.map(letter => 
        letter._id === letterId 
          ? { ...letter, isPublic: currentVisibility }
          : letter
      ))
      toast.error('Failed to update visibility')
    }
  }

  // Delete resume
  const deleteResume = async (resumeId) => {
    if (!window.confirm('Are you sure you want to delete this resume?')) return

    // Store original state for potential revert
    const originalResumes = userResumes

    try {
      // Optimistically remove from UI
      setUserResumes(prev => prev.filter(resume => resume._id !== resumeId))
      toast.success('Resume deleted successfully')

      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/resume/delete/${resumeId}`,
        { withCredentials: true }
      )

      console.log('Delete resume response:', response.data)

      // If deletion failed on backend, revert the UI change
      if (response.data.success === false) {
        console.log('Reverting resume deletion due to API failure')
        setUserResumes(originalResumes)
        toast.error('Failed to delete resume')
      }
    } catch (error) {
      console.error('Error deleting resume:', error)
      // Revert the optimistic update
      setUserResumes(originalResumes)
      toast.error('Failed to delete resume')
    }
  }

  // Delete cover letter
  const deleteLetter = async (letterId) => {
    if (!window.confirm('Are you sure you want to delete this cover letter?')) return

    // Store original state for potential revert
    const originalLetters = userCoverLetters

    try {
      // Optimistically remove from UI
      setUserCoverLetters(prev => prev.filter(letter => letter._id !== letterId))
      toast.success('Cover letter deleted successfully')

      const response = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/letter/delete/${letterId}`,
        { withCredentials: true }
      )

      console.log('Delete letter response:', response.data)

      // If deletion failed on backend, revert the UI change
      if (response.data.success === false) {
        console.log('Reverting letter deletion due to API failure')
        setUserCoverLetters(originalLetters)
        toast.error('Failed to delete cover letter')
      }
    } catch (error) {
      console.error('Error deleting cover letter:', error)
      // Revert the optimistic update
      setUserCoverLetters(originalLetters)
      toast.error('Failed to delete cover letter')
    }
  }

  const ContentCard = ({ item, type }) => (
    <div className="bg-[var(--color-base-200)] rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300">
      <div className="relative">
        {(item.resumeUrl || item.letterUrl) ? (
          <img 
            src={item.resumeUrl || item.letterUrl} 
            alt={type}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
            <svg className="w-12 h-12 text-white opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
        )}
        <div className="absolute top-4 right-4 flex gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            item.isPublic 
              ? 'bg-green-500 text-white' 
              : 'bg-gray-500 text-white'
          }`}>
            {item.isPublic ? 'Public' : 'Private'}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-lg font-bold text-[var(--color-base-content)] mb-2">
          {item.name || 'Untitled'}
        </h3>
        
        {item.company && (
          <p className="text-sm text-[var(--color-base-content)] opacity-70 mb-2">
            {item.company} • {item.role || item.jobTitle}
          </p>
        )}
        
        {item.content && (
          <p className="text-sm text-[var(--color-base-content)] opacity-70 mb-4 line-clamp-2">
            {item.content}
          </p>
        )}
        
        <div className="text-xs text-[var(--color-base-content)] opacity-50 mb-4">
          Created {new Date(item.createdAt).toLocaleDateString()
        }</div>
        
        <div className="flex gap-2">
          <button
            onClick={() => type === 'resume' 
              ? toggleResumeVisibility(item._id, item.isPublic)
              : toggleLetterVisibility(item._id, item.isPublic)
            }
            className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
              item.isPublic
                ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                : 'bg-green-100 text-green-800 hover:bg-green-200'
            }`}
          >
            {item.isPublic ? 'Make Private' : 'Make Public'}
          </button>
          <button
            onClick={() => type === 'resume' ? deleteResume(item._id) : deleteLetter(item._id)}
            className="py-2 px-4 rounded-lg text-sm font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-all duration-200"
          >
            Delete
          </button>
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
              Please login to access your profile.
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
            My Profile
          </h1>
          <p className="text-lg text-[var(--color-base-content)] opacity-70">
            Manage your account settings and view your created content
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-[var(--color-base-200)] p-2 rounded-2xl shadow-lg">
            <div className="flex">
              <button
                onClick={() => setActiveTab('profile')}
                className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center ${
                  activeTab === 'profile'
                    ? 'bg-[var(--color-primary)] text-white shadow-lg transform scale-105'
                    : 'text-[var(--color-base-content)] hover:bg-[var(--color-base-300)]'
                }`}
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Profile Settings
              </button>
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
                My Resumes ({userResumes.length})
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
                Cover Letters ({userCoverLetters.length})
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'profile' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-[var(--color-base-200)] rounded-2xl p-8 shadow-xl">
              {/* Avatar Section */}
              <div className="text-center mb-8">
                <div className="relative inline-block">
                  <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] p-1">
                    <div className="w-full h-full rounded-full overflow-hidden bg-[var(--color-base-100)] flex items-center justify-center">
                      {profileData.avatar ? (
                        <img 
                          key={profileData.avatar}
                          src={profileData.avatar}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <svg className="w-16 h-16 text-[var(--color-base-content)] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute bottom-0 right-0 bg-[var(--color-primary)] text-white rounded-full p-2 shadow-lg hover:scale-110 transition-transform duration-200 disabled:opacity-50"
                  >
                    {uploading ? (
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    )}
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarUpload}
                  accept="image/*"
                  className="hidden"
                />
                <p className="text-sm text-[var(--color-base-content)] opacity-60 mt-2 mb-4">
                  Click the camera icon to upload a new profile picture
                </p>
                
                {/* Upload Avatar Button */}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-6 py-2 rounded-lg bg-[var(--color-primary)] text-white font-medium hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  {uploading ? (
                    <>
                      <div className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                      Uploading...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Change Avatar
                    </>
                  )}
                </button>
              </div>

              {/* Username Section */}
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-[var(--color-base-content)] mb-6 text-center">
                  Account Information
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                      Username
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="text"
                        value={profileData.username}
                        onChange={(e) => setProfileData(prev => ({ ...prev, username: e.target.value }))}
                        className="flex-1 px-4 py-3 rounded-xl bg-[var(--color-base-100)] text-[var(--color-base-content)] border border-[var(--color-base-300)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
                        placeholder="Enter your username"
                      />
                      <button
                        onClick={handleUsernameUpdate}
                        disabled={loading || !profileData.username.trim()}
                        className="px-6 py-3 rounded-xl bg-[var(--color-secondary)] text-white font-semibold hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 transition-all duration-200 shadow-md hover:shadow-lg"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                            Updating...
                          </>
                        ) : (
                          <>
                            <svg className="w-4 h-4 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Update
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--color-base-content)] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={profileData.email}
                      readOnly
                      className="w-full px-4 py-3 rounded-xl bg-[var(--color-base-300)] text-[var(--color-base-content)] opacity-60 cursor-not-allowed"
                      placeholder="Email cannot be changed"
                    />
                    <p className="text-xs text-[var(--color-base-content)] opacity-50 mt-1">
                      Email cannot be changed for security reasons
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resumes' && (
          <div>
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
                  <p className="text-[var(--color-base-content)] opacity-60">Loading your resumes...</p>
                </div>
              </div>
            ) : userResumes.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {userResumes.map((resume) => (
                  <ContentCard key={resume._id} item={resume} type="resume" />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-[var(--color-base-300)] rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-[var(--color-base-content)] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-base-content)] mb-2">
                  No resumes yet
                </h3>
                <p className="text-[var(--color-base-content)] opacity-60 mb-6">
                  Create your first resume to get started!
                </p>
                <Link
                  to="/generate-resume"
                  className="inline-flex items-center px-6 py-3 bg-[var(--color-primary)] text-white rounded-xl font-semibold hover:scale-105 transition-all duration-200"
                >
                  Create Resume
                </Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'coverletters' && (
          <div>
            {loading ? (
              <div className="flex justify-center items-center py-16">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--color-primary)] mx-auto mb-4"></div>
                  <p className="text-[var(--color-base-content)] opacity-60">Loading your cover letters...</p>
                </div>
              </div>
            ) : userCoverLetters.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {userCoverLetters.map((letter) => (
                  <ContentCard key={letter._id} item={letter} type="coverletter" />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-[var(--color-base-300)] rounded-full flex items-center justify-center">
                  <svg className="w-12 h-12 text-[var(--color-base-content)] opacity-40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-base-content)] mb-2">
                  No cover letters yet
                </h3>
                <p className="text-[var(--color-base-content)] opacity-60 mb-6">
                  Create your first cover letter to get started!
                </p>
                <Link
                  to="/generate-letter"
                  className="inline-flex items-center px-6 py-3 bg-[var(--color-secondary)] text-white rounded-xl font-semibold hover:scale-105 transition-all duration-200"
                >
                  Create Cover Letter
                </Link>
              </div>
            )}
          </div>
        )}

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

export default Profile
