import { Fragment, useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { toast } from 'react-hot-toast';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon, Bars3Icon, UserCircleIcon, ArrowRightOnRectangleIcon } from '@heroicons/react/24/outline';

const navigation = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'My Sessions', href: '/my-sessions' },
];

const Logo = ({ className }) => (
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path d="M16 2.66663C8.63636 2.66663 2.66669 8.63629 2.66669 16C2.66669 23.3636 8.63636 29.3333 16 29.3333C23.3637 29.3333 29.3334 23.3636 29.3334 16C29.3334 8.63629 23.3637 2.66663 16 2.66663Z" fill="#34D399" fillOpacity="0.2"/>
    <path d="M19.6534 10.6666C19.0934 10.1066 18.2801 9.77329 17.4267 9.77329C16.5734 9.77329 15.7601 10.1066 15.2001 10.6666L12.3467 13.52C12.1697 13.3481 11.961 13.2083 11.7311 13.109C11.5012 13.0097 11.2547 12.9529 11.0001 12.9426C10.2601 12.9426 9.55342 13.2266 9.02009 13.76C8.48675 14.2933 8.2001 15 8.2001 15.74C8.2001 16.48 8.48675 17.1866 9.02009 17.72C9.55342 18.2533 10.2601 18.5399 11.0001 18.5399C11.7401 18.5399 12.4467 18.2533 12.9801 17.72L15.8334 14.8666C16.0104 15.0385 16.2191 15.1782 16.449 15.2775C16.6789 15.3768 16.9254 15.4337 17.1801 15.4439C17.9201 15.4439 18.6267 15.1599 19.1601 14.6266C20.2267 13.56 20.2267 11.84 19.1601 10.7733L19.6534 10.6666Z" fill="#10B981"/>
    <path d="M21.0001 18.5333C21.7401 18.5333 22.4467 18.2493 22.9801 17.716C23.5134 17.1826 23.8001 16.476 23.8001 15.736C23.8001 14.996 23.5134 14.2893 22.9801 13.756C22.4467 13.2226 21.7401 12.936 21.0001 12.936C20.2601 12.936 19.5534 13.2226 19.0201 13.756L16.1667 16.6093C15.9897 16.4374 15.781 16.2977 15.5511 16.1984C15.3212 16.0991 15.0747 16.0422 14.8201 16.0319C14.0801 16.0319 13.3734 16.3159 12.8401 16.8493C11.7734 17.916 11.7734 19.636 12.8401 20.7026C13.3734 21.236 14.0801 21.5226 14.8201 21.5226C15.5601 21.5226 16.2667 21.236 16.8001 20.7026L19.6534 17.8493C19.8304 18.0212 20.0391 18.1609 20.269 18.2602C20.4989 18.3595 20.7454 18.4164 21.0001 18.4266V18.5333Z" fill="#34D399"/>
  </svg>
);

const Layout = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Successfully logged out');
    navigate('/');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHomePage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <header className={`sticky top-0 z-40 transition-all duration-300 ${isScrolled || !isHomePage ? 'bg-white/80 shadow-md backdrop-blur-lg' : 'bg-white/80'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <Link to="/" className="flex items-center gap-2">
              <Logo className={`transition-all duration-300 ${isScrolled || !isHomePage ? 'text-emerald-600' : 'text-black'}`} />
              <span className={`text-xl font-bold font-serif transition-colors duration-300 ${isScrolled || !isHomePage ? 'text-black' : 'text-black'}`}>
                Serene
              </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              {isAuthenticated ? (
                navigation.map(item => (
                  <Link key={item.name} to={item.href} className={`text-sm font-medium transition-colors duration-300 ${isScrolled || !isHomePage ? 'text-black hover:text-emerald-600' : 'text-black hover:text-white'}`}>
                    {item.name}
                  </Link>
                ))
              ) : null}
            </nav>
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <div className="relative group">
                  <button className="flex items-center space-x-2 focus:outline-none">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors duration-300 ${isScrolled || !isHomePage ? 'bg-emerald-100 text-emerald-700' : 'bg-emerald-100 text-emerald-700'}`}>
                      {user?.name?.charAt(0)?.toUpperCase() || <UserCircleIcon className="w-6 h-6" />}
                    </div>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden group-hover:block animate-fadeIn">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-semibold text-gray-800">{user?.name || 'User'}</p>
                      <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                    </div>
                    <button onClick={handleLogout} className="flex items-center w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                      <ArrowRightOnRectangleIcon className="w-4 h-4 mr-2" />
                      Sign out
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link to="/login" className={`text-sm font-medium transition-colors duration-300 ${isScrolled || !isHomePage ? 'text-gray-600 hover:text-emerald-600' : 'text-gray-200 hover:text-white'}`}>
                    Login
                  </Link>
                  <Link to="/register" className="px-4 py-2 bg-emerald-600 text-white text-sm font-semibold rounded-lg shadow-md hover:bg-emerald-700 transition-all duration-300 hover:scale-105">
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
            <div className="md:hidden flex items-center">
              <button onClick={() => setMobileMenuOpen(true)} className={`p-2 rounded-md transition-colors duration-300 ${isScrolled || !isHomePage ? 'text-gray-700 hover:bg-gray-100' : 'text-white hover:bg-white/20'}`}>
                <Bars3Icon className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <Transition.Root show={isMobileMenuOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50 md:hidden" onClose={setMobileMenuOpen}>
          <Transition.Child as={Fragment} enter="ease-out duration-300" enterFrom="opacity-0" enterTo="opacity-100" leave="ease-in duration-200" leaveFrom="opacity-100" leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black/30" />
          </Transition.Child>
          <div className="fixed inset-0 flex justify-end">
            <Transition.Child as={Fragment} enter="transform transition ease-in-out duration-300" enterFrom="translate-x-full" enterTo="translate-x-0" leave="transform transition ease-in-out duration-300" leaveFrom="translate-x-0" leaveTo="translate-x-full">
              <Dialog.Panel className="w-full max-w-xs bg-white p-6">
                <div className="flex justify-between items-center mb-8">
                  <Link to="/" className="flex items-center gap-2" onClick={() => setMobileMenuOpen(false)}>
                    <Logo className="text-emerald-600" />
                    <span className="text-xl font-bold font-serif text-gray-800">Serene</span>
                  </Link>
                  <button onClick={() => setMobileMenuOpen(false)} className="p-2 rounded-md text-gray-600 hover:bg-gray-100">
                    <XMarkIcon className="w-6 h-6" />
                  </button>
                </div>
                <div className="space-y-4">
                  {isAuthenticated ? (
                    <>
                      {navigation.map(item => (
                        <Link key={item.name} to={item.href} onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">
                          {item.name}
                        </Link>
                      ))}
                      <div className="border-t border-gray-200 pt-4">
                        <button onClick={() => { handleLogout(); setMobileMenuOpen(false); }} className="flex items-center w-full text-left py-2 px-3 rounded-md text-base font-medium text-red-600 hover:bg-red-50">
                          <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                          Sign out
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="block py-2 px-3 rounded-md text-base font-medium text-gray-700 hover:bg-gray-100">Login</Link>
                      <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="block w-full text-center py-2 px-3 rounded-md text-base font-medium text-white bg-emerald-600 hover:bg-emerald-700">Sign Up</Link>
                    </>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer className="bg-emerald-50 text-gray-600">
        <div className="max-w-7xl mx-auto py-12 px-6 lg:px-8">
          <div className="xl:grid xl:grid-cols-3 xl:gap-8">
            <div className="space-y-8 xl:col-span-1">
              <Link to="/" className="flex items-center gap-2">
                <Logo className="text-emerald-600" />
                <span className="text-xl font-bold font-serif text-gray-800">Serene</span>
              </Link>
              <p className="text-sm text-gray-500">Find your inner peace, one session at a time.</p>
            </div>
            <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Solutions</h3>
                  <ul className="mt-4 space-y-4">
                    <li><Link to="/" className="text-base text-gray-500 hover:text-gray-900">Guided Sessions</Link></li>
                    <li><Link to="/" className="text-base text-gray-500 hover:text-gray-900">Analytics</Link></li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Support</h3>
                  <ul className="mt-4 space-y-4">
                    <li><Link to="/" className="text-base text-gray-500 hover:text-gray-900">Pricing</Link></li>
                    <li><Link to="/" className="text-base text-gray-500 hover:text-gray-900">Contact</Link></li>
                  </ul>
                </div>
              </div>
              <div className="md:grid md:grid-cols-2 md:gap-8">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Company</h3>
                  <ul className="mt-4 space-y-4">
                    <li><Link to="/" className="text-base text-gray-500 hover:text-gray-900">About</Link></li>
                    <li><Link to="/" className="text-base text-gray-500 hover:text-gray-900">Blog</Link></li>
                  </ul>
                </div>
                <div className="mt-12 md:mt-0">
                  <h3 className="text-sm font-semibold text-gray-900 tracking-wider uppercase">Legal</h3>
                  <ul className="mt-4 space-y-4">
                    <li><Link to="/" className="text-base text-gray-500 hover:text-gray-900">Privacy</Link></li>
                    <li><Link to="/" className="text-base text-gray-500 hover:text-gray-900">Terms</Link></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 border-t border-emerald-200 pt-8">
            <p className="text-base text-gray-500 xl:text-center">&copy; {new Date().getFullYear()} Serene Wellness, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;