import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ArrowPathIcon, CloudArrowUpIcon, FingerPrintIcon, LockClosedIcon, AcademicCapIcon, LightBulbIcon, SparklesIcon, HeartIcon } from '@heroicons/react/24/outline'

const features = [
  {
    name: 'Personalized Sessions',
    description:
      'Craft and experience wellness sessions that are perfectly tailored to your needs, from guided meditations to invigorating yoga flows.',
    icon: SparklesIcon,
  },
  {
    name: 'Track Your Progress',
    description:
      'Visualize your journey with beautiful, insightful analytics that celebrate your milestones and inspire continued growth.',
    icon: ArrowPathIcon,
  },
  {
    name: 'Expert Guidance',
    description:
      'Access a rich library of content created by certified wellness experts to support and deepen your practice.',
    icon: AcademicCapIcon,
  },
  {
    name: 'A Community of Care',
    description:
      'Connect with like-minded individuals, share your experiences, and grow together in a supportive, nurturing community.',
    icon: HeartIcon,
  },
]

const testimonials = [
    {
        body: 'Serene has completely transformed my mornings. I feel more centered, focused, and ready to take on the day. The guided meditations are my favorite!',
        author: {
            name: 'Alex Johnson',
            handle: 'alexj',
            imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
    },
    {
        body: 'As a yoga instructor, I love using Serene to create and share custom flows with my students. The platform is intuitive, beautiful, and so easy to use.',
        author: {
            name: 'Maria Garcia',
            handle: 'yogamaria',
            imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
    },
    {
        body: 'The progress tracking is a game-changer. Seeing how far I’ve come keeps me motivated. I never realized how much a few minutes of mindfulness each day could impact my life.',
        author: {
            name: 'David Chen',
            handle: 'davidc',
            imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
        },
    },
]

const HomePage = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="bg-white text-gray-800 animate-fadeIn">
      {/* Hero Section */}
      <div className="relative isolate overflow-hidden bg-gray-900 h-[90vh] flex items-center justify-center">
        <img
          src="https://images.unsplash.com/photo-1519817914152-22d216bb9170?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80"
          alt="A calm, misty forest providing a serene background."
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40"></div>
        <div className="relative z-10 text-center text-white p-4 max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl font-serif">
            {isAuthenticated ? `Welcome Back, ${user?.name || 'Seeker'}` : 'Your Sanctuary for Wellness'}
          </h1>
          <p className="mt-6 text-lg leading-8 text-gray-300">
            {isAuthenticated
              ? 'Continue your journey to wellness. Your next session awaits.'
              : 'Discover guided sessions to calm your mind, heal your body, and renew your spirit. Your path to inner peace starts here.'}
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            {isAuthenticated ? (
                 <Link
                  to="/dashboard"
                  className="rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-all duration-300 hover:scale-105"
                >
                  Go to Dashboard
                </Link>
            ) : (
                <Link
                  to="/register"
                  className="rounded-md bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-600 transition-all duration-300 hover:scale-105"
                >
                  Get Started
                </Link>
            )}
             <Link to={isAuthenticated ? "/sessions/new" : "/login"} className="text-sm font-semibold leading-6 text-white hover:text-gray-200">
              {isAuthenticated ? "Create a new session" : "Sign In"} <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Features Section */}
       <div className="bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-emerald-600">Your Path to Serenity</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Everything you need for a balanced life
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              Our platform is thoughtfully designed with features that support and inspire your wellness journey, making self-care a simple and beautiful practice.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
              {features.map((feature) => (
                <div key={feature.name} className="relative pl-16">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    <div className="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-600">
                      <feature.icon className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">{feature.description}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* How it works Section */}
      <div className="bg-emerald-50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl lg:text-center">
                <h2 className="text-base font-semibold leading-7 text-emerald-700">A Simple Path</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">How It Works</p>
                <p className="mt-6 text-lg leading-8 text-gray-600">Begin your journey to wellness in just a few simple steps. We've made it easy to get started, so you can focus on what truly matters: you.</p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
                <div className="grid grid-cols-1 gap-12 text-center md:grid-cols-3">
                    <div className="flex flex-col items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 ring-8 ring-white">1</div>
                        <h3 className="mt-6 text-lg font-semibold text-gray-900">Create Your Account</h3>
                        <p className="mt-2 text-base text-gray-600">Join our community to unlock your personalized wellness dashboard.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 ring-8 ring-white">2</div>
                        <h3 className="mt-6 text-lg font-semibold text-gray-900">Choose a Session</h3>
                        <p className="mt-2 text-base text-gray-600">Explore our library of guided meditations, yoga, and more.</p>
                    </div>
                    <div className="flex flex-col items-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 ring-8 ring-white">3</div>
                        <h3 className="mt-6 text-lg font-semibold text-gray-900">Begin Your Practice</h3>
                        <p className="mt-2 text-base text-gray-600">Find your calm and start your journey to a more mindful life.</p>
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div className="relative isolate bg-white py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-xl text-center">
                <h2 className="text-lg font-semibold leading-8 tracking-tight text-emerald-600">Testimonials</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Loved by seekers everywhere</p>
            </div>
            <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
                <div className="-mt-8 sm:-mx-4 sm:columns-2 sm:text-[0] lg:columns-3">
                    {testimonials.map((testimonial) => (
                        <div key={testimonial.author.handle} className="pt-8 sm:inline-block sm:w-full sm:px-4">
                            <figure className="rounded-2xl bg-gray-50 p-8 text-sm leading-6">
                                <blockquote className="text-gray-900">
                                    <p>{`“${testimonial.body}”`}</p>
                                </blockquote>
                                <figcaption className="mt-6 flex items-center gap-x-4">
                                    <img className="h-10 w-10 rounded-full bg-gray-50" src={testimonial.author.imageUrl} alt="" />
                                    <div>
                                        <div className="font-semibold text-gray-900">{testimonial.author.name}</div>
                                        <div className="text-gray-600">{`@${testimonial.author.handle}`}</div>
                                    </div>
                                </figcaption>
                            </figure>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* CTA Section */}
       <div className="bg-emerald-700">
        <div className="mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:flex lg:items-center lg:justify-between lg:px-8">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Ready to dive in?
            <br />
            Start your free trial today.
          </h2>
          <div className="mt-10 flex items-center gap-x-6 lg:mt-0 lg:flex-shrink-0">
            <Link
              to="/register"
              className="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-emerald-600 shadow-sm hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-300 hover:scale-105"
            >
              Get started
            </Link>
            <Link to="/about" className="text-sm font-semibold leading-6 text-white hover:text-gray-200">
              Learn more <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;