import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import axios from 'axios';
import { AppContext } from '../context/ContextProvider';
import { Eye, EyeOff, Trash2, Download } from 'lucide-react';

const Profile = () => {
  const [username, setUsername] = useState('');
  const [avatar, setAvatar] = useState('');
  const [resumes, setResumes] = useState([]);
  const [letters, setLetters] = useState([]);
  const [activeTab, setActiveTab] = useState('resumes');
  const { user, setuser } = useContext(AppContext);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const userRes = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/user/me`, {
          withCredentials: true,
        });
        setuser(userRes.data.user);
        setUsername(userRes.data.user.username);
        setAvatar(userRes.data.user.avatar);
        await Promise.all([fetchResumes(), fetchLetters()]);
      } catch (err) {
        toast.error('Failed to fetch profile data');
        console.error(err);
      }
    };

    fetchAll();
  }, []);

  const fetchResumes = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/resume/all`, {
        withCredentials: true,
      });
      setResumes(res.data || []);
    } catch {
      toast.error('Failed to load resumes');
    }
  };

  const fetchLetters = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/letter/all`, {
        withCredentials: true,
      });
      setLetters(res.data || []);
    } catch {
      toast.error('Failed to load letters');
    }
  };

  const handleVisibilityToggle = async (type, id) => {
    const updateLocal = () => {
      const list = type === 'resume' ? resumes : letters;
      const updated = list.map(item => item._id === id ? { ...item, isPublic: !item.isPublic } : item);
      type === 'resume' ? setResumes(updated) : setLetters(updated);
    };

    updateLocal();

    try {
      await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/${type}/visibility/${id}`, {
        withCredentials: true,
      });
      toast.success('Visibility updated');
    } catch {
      toast.error('Failed to update visibility');
      type === 'resume' ? fetchResumes() : fetchLetters();
    }
  };

  const handleDelete = async (type, id) => {
    const backup = type === 'resume' ? [...resumes] : [...letters];
    const filterDeleted = () => type === 'resume'
      ? setResumes(prev => prev.filter(r => r._id !== id))
      : setLetters(prev => prev.filter(l => l._id !== id));

    filterDeleted();

    try {
      await axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/${type}/delete/${id}`, {
        withCredentials: true,
      });
      toast.success(`${type === 'resume' ? 'Resume' : 'Letter'} deleted`);
    } catch {
      toast.error(`Failed to delete ${type}`);
      type === 'resume' ? setResumes(backup) : setLetters(backup);
    }
  };

  const handleDownload = (url) => {
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const renderCard = (item, type) => (
    <div
      key={item._id}
      className="bg-[var(--color-base-200)] p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-[var(--color-base-300)] group relative overflow-hidden"
    >
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-semibold text-lg text-[var(--color-base-content)] truncate">
          {item.name || item.company || 'Untitled'}
        </h3>
        <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${item.isPublic ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
          {item.isPublic ? 'Public' : 'Private'}
        </span>
      </div>
      <p className="text-sm text-[var(--color-base-muted)] mb-3 line-clamp-2">
        {item.description || item.content}
      </p>

      {(item.resumeUrl || item.letterUrl) && (
        <img
          src={item.resumeUrl || item.letterUrl}
          alt="Preview"
          className="rounded-lg w-full h-36 object-cover mb-3 border border-[var(--color-base-300)]"
        />
      )}

      <div className="text-xs text-[var(--color-base-muted)] mb-4">
        Created: {new Date(item.createdAt).toLocaleDateString()}
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={() => handleVisibilityToggle(type, item._id)} className={`flex items-center gap-1 px-4 py-1.5 text-xs rounded-full font-semibold ${item.isPublic ? 'bg-green-600 text-white' : 'bg-yellow-500 text-white'}`}>
          {item.isPublic ? <Eye size={15} /> : <EyeOff size={15} />}
          {item.isPublic ? 'Public' : 'Private'}
        </button>

        {(item.resumeUrl || item.letterUrl) && (
          <button onClick={() => handleDownload(item.resumeUrl || item.letterUrl)} className="flex items-center gap-1 px-4 py-1.5 text-xs rounded-full font-semibold bg-blue-600 text-white">
            <Download size={15} />
            Download
          </button>
        )}

        <button onClick={() => handleDelete(type, item._id)} className="flex items-center gap-1 px-4 py-1.5 text-xs rounded-full font-semibold bg-red-600 text-white">
          <Trash2 size={15} />
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-base-100)] pt-24 px-4 pb-20">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-[var(--color-base-content)] mb-10">
          My Profile
        </h1>

        <div className="flex flex-col md:flex-row items-center gap-5 mb-10 justify-center">
          <div className="relative">
            <img
              src={avatar || '/default-avatar.png'}
              alt="Avatar"
              className="w-28 h-28 rounded-full border-4 border-[var(--color-primary)] object-cover shadow-lg"
            />
            <span className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 border-2 border-white rounded-full"></span>
          </div>
          <div className="text-center md:text-left">
            <p className="text-2xl font-bold text-[var(--color-base-content)]">{username}</p>
            <p className="text-sm text-[var(--color-base-muted)]">{user?.email}</p>
          </div>
        </div>

        <div className="flex justify-center gap-4 mb-8">
          <button onClick={() => setActiveTab('resumes')} className={`px-6 py-2 rounded-xl font-semibold ${activeTab === 'resumes' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-black'}`}>
            Resumes ({resumes.length})
          </button>
          <button onClick={() => setActiveTab('letters')} className={`px-6 py-2 rounded-xl font-semibold ${activeTab === 'letters' ? 'bg-purple-600 text-white' : 'bg-gray-200 text-black'}`}>
            Cover Letters ({letters.length})
          </button>
        </div>

        {activeTab === 'resumes' && resumes.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumes.map(resume => renderCard(resume, 'resume'))}
          </div>
        ) : activeTab === 'letters' && letters.length ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {letters.map(letter => renderCard(letter, 'letter'))}
          </div>
        ) : (
          <p className="text-center text-[var(--color-base-muted)] py-12 text-sm italic">
            No {activeTab === 'resumes' ? 'resumes' : 'cover letters'} found.
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;