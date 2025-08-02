import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import api from '../services/api';
import { ClockIcon, ChartBarIcon, FireIcon, VideoCameraIcon, PlusIcon } from '@heroicons/react/24/outline';
import yogaBg from '../assets/login.jpg';
import sleepBg from '../assets/register.jpg';

const featuredSessions = [
  {
    id: 'morning-meditation',
    title: 'Morning Calm',
    description: 'Start your day with a peaceful 10-minute meditation.',
    duration: '10 min',
    category: 'Meditation',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'stress-relief-yoga',
    title: 'Stress Relief Yoga',
    description: 'Release tension with this gentle, flowing yoga session.',
    duration: '30 min',
    category: 'Yoga',
    image: sleepBg,
  },
  {
    id: 'deep-sleep-audio',
    title: 'Deep Sleep Audio',
    description: 'Drift into restful sleep with this calming soundscape.',
    duration: '45 min',
    category: 'Sleep',
    image: yogaBg,
  }
];

const continueWatching = [
  {
    id: 'mindful-breathing',
    title: 'Mindful Breathing',
    progress: '50%',
    img: yogaBg,
  }
];

const DashboardPage = () => {
  const { user } = useAuth();
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await api.get('/');
        setSessions(response.data.data || []);
      } catch (error) {
        toast.error('Failed to load your sessions');
        console.error('Error fetching sessions:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSessions();
  }, []);

  const getUserGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const stats = [
    { name: 'Sessions Completed', stat: '12', icon: VideoCameraIcon },
    { name: 'Total Minutes', stat: '345', icon: ClockIcon },
    { name: 'Current Streak', stat: '5 days', icon: FireIcon },
  ];

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-128px)] flex items-center justify-center bg-gradient-to-r from-green-100 via-blue-100 to-purple-100 animate-fadeIn">
        <div className="text-center">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-3 text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 min-h-screen animate-fadeInSlow">
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl font-bold text-gray-800 tracking-tight animate-slideInLeft">
                {getUserGreeting()}, {user?.name?.split(' ')[0] || 'there'}!
              </h1>
              <p className="mt-2 text-lg text-gray-600 animate-fadeIn delay-75">Let's make today a mindful one.</p>
            </div>
            <div className="mt-6 flex md:mt-0 md:ml-4 animate-slideInRight">
              <Link to="/my-sessions" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 transition duration-300">
                My Sessions
              </Link>
              <Link to="/sessions/new" className="ml-3 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-md text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 transition duration-300">
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                New Session
              </Link>
            </div>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fadeUp">
            {stats.map((item) => (
              <div key={item.name} className="bg-white p-6 rounded-xl shadow hover:shadow-xl transition duration-300 relative overflow-hidden">
                <div className="absolute top-4 left-4 bg-emerald-500 rounded-md p-2">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-12">
                  <p className="text-sm text-gray-500 font-medium">{item.name}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{item.stat}</p>
                </div>
              </div>
            ))}
          </div>

          {continueWatching.length > 0 && (
            <div className="mt-14 animate-fadeUp delay-75">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Continue your practice</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {continueWatching.map((session) => (
                  <div key={session.id} className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition duration-300">
                    <div className="relative h-40 w-full">
                      <img src={session.img} alt={session.title} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition duration-300"></div>
                      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <button className="h-12 w-12 bg-white/30 backdrop-blur-md rounded-full flex items-center justify-center text-white group-hover:scale-110 transition-all">
                          ▶
                        </button>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium text-gray-800 truncate">{session.title}</h3>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div className="bg-emerald-500 h-1.5 rounded-full" style={{ width: session.progress }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-14 animate-fadeUp delay-100">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Featured for you</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredSessions.map((session) => (
                <Link to={`/sessions/${session.id}`} key={session.id} className="group relative bg-white rounded-xl shadow hover:shadow-2xl transition duration-300 overflow-hidden">
                  <div className="relative h-48 w-full">
                    <img src={session.image} alt={session.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-4">
                      <span className="px-2 py-1 bg-white/30 backdrop-blur-sm text-white text-xs font-semibold rounded-full">{session.category}</span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">{session.title}</h3>
                    <p className="text-sm text-gray-500 mt-1">{session.duration}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
