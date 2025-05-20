import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, CheckCircle } from 'lucide-react';

const Home: React.FC = () => {
  const reviews = [
    {
      name: "Sarah Johnson",
      role: "Small Business Owner",
      content: "NTEK's finance tracker has revolutionized how I manage my business finances. The interface is intuitive and the reports are incredibly detailed.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Freelancer",
      content: "As a freelancer, keeping track of income and expenses was always a challenge. This app makes it effortless. The offline capability is a game-changer!",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Personal Finance Enthusiast",
      content: "The budgeting features are exceptional. I love how I can set goals and track my progress visually.",
      rating: 4
    }
  ];

  const roadmap = [
    {
      title: "Current Features",
      items: [
        "Expense Tracking",
        "Income Management",
        "Budget Planning",
        "Visual Reports",
        "Dark/Light Mode",
        "Offline Support"
      ]
    },
    {
      title: "Coming Soon",
      items: [
        "Multi-currency Support",
        "Bill Reminders",
        "Investment Tracking",
        "AI-powered Insights",
        "Shared Budgets",
        "Mobile Apps"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
            <div className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6">
              <motion.h1 
                className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                Take Control of Your Finances with NTEK
              </motion.h1>
              <motion.p 
                className="mt-6 text-lg text-gray-600 dark:text-gray-300"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                Smart financial tracking for modern life. Monitor expenses, set budgets, and achieve your financial goals with our intuitive tools.
              </motion.p>
              <motion.div 
                className="mt-8 flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Link
                  to="/register"
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                >
                  Get Started Free
                </Link>
                <Link
                  to="/login"
                  className="rounded-lg bg-white px-4 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                >
                  Sign in
                </Link>
              </motion.div>
            </div>
            <div className="relative mt-10 sm:mt-20 lg:col-span-5 lg:row-span-2 lg:mt-0 xl:col-span-6">
              <motion.div
                className="absolute left-1/2 top-4 h-[1026px] w-[1026px] -translate-x-1/3 stroke-gray-300/70 [mask-image:linear-gradient(to_bottom,white_20%,transparent_75%)] sm:top-16 sm:-translate-x-1/2 lg:-translate-x-1/2"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <img
                  src="https://images.pexels.com/photos/7567434/pexels-photo-7567434.jpeg"
                  alt="App screenshot"
                  className="rounded-2xl shadow-xl ring-1 ring-gray-900/10"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <motion.h2 
              className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Everything you need to manage your finances
            </motion.h2>
          </div>
          <motion.div 
            className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {roadmap[0].items.slice(0, 3).map((item, index) => (
                <div key={index} className="flex flex-col">
                  <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
                      <CheckCircle className="h-6 w-6 text-white" aria-hidden="true" />
                    </div>
                    {item}
                  </dt>
                  <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                    <p className="flex-auto">Experience the power of modern financial management.</p>
                  </dd>
                </div>
              ))}
            </dl>
          </motion.div>
        </div>
      </section>

      {/* Reviews Section */}
      <section className="py-20 sm:py-32 bg-white dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <motion.h2 
              className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Loved by users worldwide
            </motion.h2>
          </div>
          <motion.div 
            className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mt-20 lg:max-w-none lg:grid-cols-3"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {reviews.map((review, index) => (
              <div key={index} className="flex flex-col bg-gray-50 dark:bg-gray-700 rounded-2xl p-8">
                <div className="flex items-center gap-x-2 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="flex-1">
                  <p className="text-lg leading-8 text-gray-900 dark:text-white">{review.content}</p>
                </blockquote>
                <div className="mt-6 border-t border-gray-900/10 dark:border-gray-600 pt-6">
                  <p className="font-semibold text-gray-900 dark:text-white">{review.name}</p>
                  <p className="mt-1 text-gray-600 dark:text-gray-300">{review.role}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <motion.h2 
              className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Development Roadmap
            </motion.h2>
          </div>
          <motion.div 
            className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mt-20 lg:max-w-none lg:grid-cols-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {roadmap.map((section, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">{section.title}</h3>
                <ul className="space-y-4">
                  {section.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center gap-x-3">
                      <CheckCircle className={`h-5 w-5 ${index === 0 ? 'text-green-500' : 'text-gray-400'}`} />
                      <span className="text-gray-700 dark:text-gray-300">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;