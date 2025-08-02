import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { BookOpenIcon, Bars3BottomLeftIcon, ClockIcon, SignalIcon, TagIcon, LinkIcon, ArrowUpOnSquareIcon, ArchiveBoxIcon } from '@heroicons/react/24/outline';

const SessionEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const autoSaveTimeout = useRef(null);
  const [isAutoSaving, setIsAutoSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(!!id);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    tags: '',
    duration: '30',
    level: 'beginner',
    jsonFileUrl: '',
    status: 'draft',
  });

  useEffect(() => {
    if (id) {
      const loadSession = async () => {
        try {
          const response = await api.get(`/my-sessions/${id}`);
          const session = response.data.data;
          setFormData({
            title: session.title || '',
            description: session.description || '',
            tags: session.tags ? session.tags.join(', ') : '',
            duration: session.duration || '30',
            level: session.level || 'beginner',
            jsonFileUrl: session.jsonFileUrl || '',
            status: session.status || 'draft',
          });
        } catch (error) {
          toast.error('Failed to load session details.');
          console.error('Error loading session:', error);
          navigate('/my-sessions');
        } finally {
          setIsLoading(false);
        }
      };
      loadSession();
    } else {
        setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    if (isLoading || !id) return;

    clearTimeout(autoSaveTimeout.current);
    autoSaveTimeout.current = setTimeout(async () => {
      if (formData.title.trim() === '') return;
      
      setIsAutoSaving(true);
      try {
        const payload = { ...formData, id, tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) };
        await api.post(`/my-sessions/save-draft`, payload);
        setLastSaved(new Date());
      } catch (error) {
        console.error('Auto-save failed:', error);
        toast.error('Failed to auto-save draft.');
      } finally {
        setIsAutoSaving(false);
      }
    }, 3000);

    return () => clearTimeout(autoSaveTimeout.current);
  }, [formData, id, isLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

    const handleSubmit = async (e, action) => {
    e.preventDefault();
    if (formData.title.trim() === '') {
      toast.error('Please provide a title for your session.');
      return;
    }

    setIsSubmitting(true);
    clearTimeout(autoSaveTimeout.current);

    try {
      // Always save the draft first
      const draftPayload = { ...formData, id, tags: formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) };
      const response = await api.post('/my-sessions/save-draft', draftPayload);
      const savedSession = response.data.data;
      const sessionId = savedSession._id;

      toast.success('Draft saved successfully!');

      if (!id) {
        // If it's a new session, update the URL to the edit page
        navigate(`/sessions/${sessionId}/edit`, { replace: true });
      }

      if (action === 'published') {
        // If publishing, make the second API call
        await api.post('/my-sessions/publish', { id: sessionId });
        toast.success('Session published successfully!');
        navigate('/my-sessions');
      }

    } catch (error) {
      console.error('Error saving session:', error);
      toast.error(error.response?.data?.error || 'Failed to save session.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-128px)] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading session editor...</p>
        </div>
      </div>
    );
  }

  const getAutoSaveStatus = () => {
      if (isAutoSaving) return 'Saving...';
      if (lastSaved) return `Last saved at ${lastSaved.toLocaleTimeString()}`;
      if (id) return 'Changes will be saved automatically.';
      return 'Save your session to enable auto-saving.';
  }

  return (
    <div className="bg-slate-50 min-h-screen animate-fadeIn">
        <form onSubmit={(e) => handleSubmit(e, 'published')}>
            <div className="py-10">
                <div className="max-w-3xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
                    <div className="lg:col-span-8">

                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Session Details</h2>
                            <div className="space-y-6">

                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                                    <div className="relative mt-1">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <BookOpenIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input type="text" name="title" id="title" required value={formData.title} onChange={handleChange} className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm" placeholder="e.g., Morning Meditation" />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                    <div className="relative mt-1">
                                        <textarea id="description" name="description" rows={5} value={formData.description} onChange={handleChange} className="block w-full rounded-md border-gray-300 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm" placeholder="A brief summary of what this session is about..."></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="lg:col-span-4 mt-8 lg:mt-0">

                        <div className="bg-white rounded-lg shadow p-6">
                            <h2 className="text-xl font-semibold text-gray-900 mb-6">Configuration</h2>
                            <div className="space-y-6">

                                <div>
                                    <label htmlFor="duration" className="block text-sm font-medium text-gray-700">Duration (minutes)</label>
                                    <div className="relative mt-1">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <ClockIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input type="number" name="duration" id="duration" value={formData.duration} onChange={handleChange} className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm" placeholder="30" />
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="level" className="block text-sm font-medium text-gray-700">Level</label>
                                    <div className="relative mt-1">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <SignalIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <select id="level" name="level" value={formData.level} onChange={handleChange} className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm">
                                            <option value="beginner">Beginner</option>
                                            <option value="intermediate">Intermediate</option>
                                            <option value="advanced">Advanced</option>
                                            <option value="all">All Levels</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags</label>
                                    <div className="relative mt-1">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <TagIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input type="text" name="tags" id="tags" value={formData.tags} onChange={handleChange} className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm" placeholder="yoga, sleep, focus" />
                                    </div>
                                    <p className="mt-2 text-xs text-gray-500">Separate tags with a comma.</p>
                                </div>

                                <div>
                                    <label htmlFor="jsonFileUrl" className="block text-sm font-medium text-gray-700">Session Content URL</label>
                                    <div className="relative mt-1">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                            <LinkIcon className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <input type="url" name="jsonFileUrl" id="jsonFileUrl" value={formData.jsonFileUrl} onChange={handleChange} className="block w-full rounded-md border-gray-300 pl-10 shadow-sm focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm" placeholder="https://.../content.json" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="text-sm text-gray-500">
                            {getAutoSaveStatus()}
                        </div>
                        <div className="flex items-center space-x-4">
                            <button type="button" onClick={() => navigate('/my-sessions')} className="px-4 py-2 text-sm font-medium text-gray-700 rounded-md hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                                Cancel
                            </button>
                            <button type="button" onClick={(e) => handleSubmit(e, 'draft')} disabled={isSubmitting} className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50">
                                <ArchiveBoxIcon className="-ml-1 mr-2 h-5 w-5"/>
                                {isSubmitting ? 'Saving...' : 'Save Draft'}
                            </button>
                            <button type="submit" disabled={isSubmitting} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50">
                                <ArrowUpOnSquareIcon className="-ml-1 mr-2 h-5 w-5"/>
                                {isSubmitting ? 'Publishing...' : 'Publish Session'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
  );
};

export default SessionEditorPage;
