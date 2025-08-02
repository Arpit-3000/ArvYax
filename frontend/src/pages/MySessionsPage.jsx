import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import api from '../services/api';
import { PlusIcon, VideoCameraIcon, PencilIcon, TrashIcon, EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const MySessionsPage = () => {
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    setIsLoading(true);
    try {
      const response = await api.get('/my-sessions');
      setSessions(response.data.data || []);
    } catch (error) {
      toast.error('Failed to load your sessions');
      console.error('Error fetching sessions:', error);
    } finally {
      setIsLoading(false);
    }
  };

    const handlePublishToggle = async (session) => {
    const isPublished = session.status === 'published';
    const action = isPublished ? 'unpublish' : 'publish';
    const toastId = toast.loading(`Please wait while we ${action} your session...`);

    try {
      if (isPublished) {

        const payload = { ...session, id: session._id, status: 'draft' };
        await api.post('/my-sessions/save-draft', payload);
      } else {

        await api.post('/my-sessions/publish', { id: session._id });
      }
      toast.success(`Session ${action}ed successfully!`, { id: toastId });
      fetchSessions();
    } catch (error) {
      toast.error(error.response?.data?.error || `Failed to ${action} session`, { id: toastId });
      console.error(`Error ${action}ing session:`, error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to permanently delete this session?')) {
      try {
        await api.delete(`/my-sessions/${id}`);
        toast.success('Session deleted successfully!');
        fetchSessions();
      } catch (error) {
        toast.error('Failed to delete session');
      }
    }
  };

  const filteredSessions = activeTab === 'all' 
    ? sessions 
    : sessions.filter(session => session.status === activeTab);

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-128px)] flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading your sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen animate-fadeIn">
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
                <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                    My Sessions
                </h1>
                <p className="mt-1 text-md text-gray-500">Create, manage, and share your wellness content.</p>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
                <Link
                    to="/sessions/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                    <PlusIcon className="-ml-1 mr-2 h-5 w-5"/>
                    New Session
                </Link>
            </div>
          </div>


          <div className="mt-8">
            <div className="sm:hidden">
              <label htmlFor="tabs" className="sr-only">Select a tab</label>
              <select
                id="tabs"
                name="tabs"
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm rounded-md"
                onChange={(e) => setActiveTab(e.target.value)}
                value={activeTab}
              >
                <option value="all">All</option>
                <option value="draft">Drafts</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="hidden sm:block">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                  <button
                    onClick={() => setActiveTab('all')}
                    className={`${activeTab === 'all' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    All Sessions
                    <span className='ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800'>{sessions.length}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('draft')}
                    className={`${activeTab === 'draft' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Drafts
                    <span className='ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800'>{sessions.filter(s => s.status === 'draft').length}</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('published')}
                    className={`${activeTab === 'published' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                  >
                    Published
                    <span className='ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800'>{sessions.filter(s => s.status === 'published').length}</span>
                  </button>
                </nav>
              </div>
            </div>
          </div>


          <div className="mt-6">
            {filteredSessions.length > 0 ? (
              <div className="bg-white shadow overflow-hidden rounded-md">
                <ul role="list" className="divide-y divide-gray-200">
                  {filteredSessions.map((session) => (
                    <li key={session._id}>
                      <div className="block hover:bg-gray-50">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-emerald-600 truncate">
                              <Link to={`/sessions/${session._id}`} className="hover:underline">{session.title}</Link>
                            </p>
                            <div className="ml-2 flex-shrink-0 flex items-center space-x-4">
                              <p className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${session.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                {session.status}
                              </p>
                              <div className="flex items-center space-x-2">
                                <Link to={`/sessions/${session._id}/edit`} className="text-gray-400 hover:text-emerald-600">
                                  <PencilIcon className="h-5 w-5"/>
                                </Link>
                                <button onClick={() => handlePublishToggle(session)} className="text-gray-400 hover:text-emerald-600">
                                  {session.status === 'published' ? <EyeSlashIcon className="h-5 w-5"/> : <EyeIcon className="h-5 w-5"/>}
                                </button>
                                <button onClick={() => handleDelete(session._id)} className="text-gray-400 hover:text-red-600">
                                  <TrashIcon className="h-5 w-5"/>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="mt-2 sm:flex sm:justify-between">
                            <div className="sm:flex">
                              <p className="flex items-center text-sm text-gray-500">
                                {session.description || 'No description provided.'}
                              </p>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                              <p>Created on {new Date(session.createdAt).toLocaleDateString()}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-center py-12 bg-white shadow rounded-lg">
                <VideoCameraIcon className="mx-auto h-12 w-12 text-gray-400"/>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No sessions found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {activeTab === 'all'
                    ? 'Get started by creating a new session.'
                    : `You have no ${activeTab} sessions.`}
                </p>
                <div className="mt-6">
                    <Link to="/sessions/new" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500">
                        <PlusIcon className="-ml-1 mr-2 h-5 w-5"/>
                        Create Session
                    </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MySessionsPage;
