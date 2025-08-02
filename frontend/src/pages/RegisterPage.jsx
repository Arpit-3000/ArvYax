import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { UserIcon, EnvelopeIcon, LockClosedIcon, ExclamationCircleIcon } from '@heroicons/react/24/outline';
import regsiterBG from '../assets/register.jpg';

const Logo = ({ className }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M16 2.66663C8.63636 2.66663 2.66669 8.63629 2.66669 16C2.66669 23.3636 8.63636 29.3333 16 29.3333C23.3637 29.3333 29.3334 23.3636 29.3334 16C29.3334 8.63629 23.3637 2.66663 16 2.66663Z" fill="#34D399" fillOpacity="0.2"/>
    <path d="M19.6534 10.6666C19.0934 10.1066 18.2801 9.77329 17.4267 9.77329C16.5734 9.77329 15.7601 10.1066 15.2001 10.6666L12.3467 13.52C12.1697 13.3481 11.961 13.2083 11.7311 13.109C11.5012 13.0097 11.2547 12.9529 11.0001 12.9426C10.2601 12.9426 9.55342 13.2266 9.02009 13.76C8.48675 14.2933 8.2001 15 8.2001 15.74C8.2001 16.48 8.48675 17.1866 9.02009 17.72C9.55342 18.2533 10.2601 18.5399 11.0001 18.5399C11.7401 18.5399 12.4467 18.2533 12.9801 17.72L15.8334 14.8666C16.0104 15.0385 16.2191 15.1782 16.449 15.2775C16.6789 15.3768 16.9254 15.4337 17.1801 15.4439C17.9201 15.4439 18.6267 15.1599 19.1601 14.6266C20.2267 13.56 20.2267 11.84 19.1601 10.7733L19.6534 10.6666Z" fill="#10B981"/>
    <path d="M21.0001 18.5333C21.7401 18.5333 22.4467 18.2493 22.9801 17.716C23.5134 17.1826 23.8001 16.476 23.8001 15.736C23.8001 14.996 23.5134 14.2893 22.9801 13.756C22.4467 13.2226 21.7401 12.936 21.0001 12.936C20.2601 12.936 19.5534 13.2226 19.0201 13.756L16.1667 16.6093C15.9897 16.4374 15.781 16.2977 15.5511 16.1984C15.3212 16.0991 15.0747 16.0422 14.8201 16.0319C14.0801 16.0319 13.3734 16.3159 12.8401 16.8493C11.7734 17.916 11.7734 19.636 12.8401 20.7026C13.3734 21.236 14.0801 21.5226 14.8201 21.5226C15.5601 21.5226 16.2667 21.236 16.8001 20.7026L19.6534 17.8493C19.8304 18.0212 20.0391 18.1609 20.269 18.2602C20.4989 18.3595 20.7454 18.4164 21.0001 18.4266V18.5333Z" fill="#34D399"/>
  </svg>
);

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      const { confirmPassword, ...userData } = formData;
      const result = await register(userData);
      
      if (result.success) {
        toast.success('Registration successful! Welcome aboard.');
        navigate('/login');
      } else {
        setError(result.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'An unexpected error occurred.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <Link to="/" className="flex items-center gap-2">
              <Logo className="text-emerald-600" />
              <span className="text-2xl font-bold font-serif text-gray-800">Serene</span>
            </Link>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
              Create your account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Already a member?{' '}
              <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-500">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-8">
            <div className="mt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Full Name
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                     <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                        <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                     </div>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      autoComplete="name"
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 pl-10 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                      placeholder="Jane Doe"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                    Email address
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                     <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                        <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                     </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 pl-10 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                      placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                    Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                        <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 pl-10 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                      placeholder="••••••••"
                      value={formData.password}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                    Confirm Password
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 pl-3 flex items-center">
                        <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      autoComplete="new-password"
                      required
                      className="block w-full appearance-none rounded-md border border-gray-300 pl-10 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-emerald-500 sm:text-sm"
                      placeholder="••••••••"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      disabled={isLoading}
                    />
                  </div>
                </div>

                {error && (
                  <div className="rounded-md bg-red-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <ExclamationCircleIcon className="h-5 w-5 text-red-400" aria-hidden="true" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800">{error}</h3>
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex w-full justify-center rounded-md border border-transparent bg-emerald-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 disabled:opacity-70 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating account...
                      </>
                    ) : 'Create Account'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="relative hidden lg:flex lg:w-1/2">
      
              <img
                className="absolute inset-0 h-full w-full object-cover"
                src={regsiterBG}
                alt="Nature"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-green-100/20 to-transparent"></div>
            </div>
    </div>
  );
};

export default RegisterPage;
