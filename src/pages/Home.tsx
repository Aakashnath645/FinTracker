import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, CheckCircle, ArrowRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const reviewsRef = useRef(null);
  const roadmapRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero animations
      gsap.from(heroRef.current, {
        opacity: 0,
        y: 100,
        duration: 1,
        ease: "power4.out"
      });

      // Animate features
      gsap.from(".feature-card", {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top center+=100",
          toggleActions: "play none none reverse"
        },
        opacity: 0,
        y: 50,
        stagger: 0.2,
        duration: 0.8,
        ease: "back.out(1.7)"
      });

      // Animate reviews
      gsap.from(".review-card", {
        scrollTrigger: {
          trigger: reviewsRef.current,
          start: "top center+=100",
          toggleActions: "play none none reverse"
        },
        opacity: 0,
        x: -50,
        stagger: 0.3,
        duration: 0.8,
        ease: "power2.out"
      });

      // Animate roadmap
      gsap.from(".roadmap-item", {
        scrollTrigger: {
          trigger: roadmapRef.current,
          start: "top center+=100",
          toggleActions: "play none none reverse"
        },
        opacity: 0,
        y: 30,
        stagger: 0.2,
        duration: 0.6,
        ease: "power1.out"
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden pt-20 pb-16 sm:pt-32 sm:pb-24">
        <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.900),theme(colors.gray.900))] opacity-20"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              className="text-4xl font-bold tracking-tight sm:text-6xl bg-gradient-to-r from-indigo-600 via-blue-500 to-indigo-400 dark:from-indigo-400 dark:via-blue-300 dark:to-indigo-200 bg-clip-text text-transparent animate-gradient"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Transform Your Finances with NTEK
            </motion.h1>
            <motion.p 
              className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            >
              Experience the future of financial management. Smart tracking, real-time insights, and powerful analytics - all in one secure platform.
            </motion.p>
            <motion.div 
              className="mt-10 flex items-center justify-center gap-x-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            >
              <Link
                to="/register"
                className="rounded-full bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all duration-300 hover:scale-105"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="text-base font-semibold leading-6 text-gray-900 dark:text-white flex items-center group"
              >
                Sign in <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
              </Link>
            </motion.div>
          </div>

          <div className="mt-16 flow-root sm:mt-24">
            <motion.div 
              className="rounded-xl bg-gray-900/5 dark:bg-white/5 p-2 ring-1 ring-inset ring-gray-900/10 dark:ring-white/10 lg:-m-4 lg:rounded-2xl lg:p-4"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
            >
              <img
                src="https://images.pexels.com/photos/7567434/pexels-photo-7567434.jpeg"
                alt="App screenshot"
                width={2432}
                height={1442}
                className="rounded-md shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-24 sm:py-32 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-base font-semibold leading-7 text-indigo-600 dark:text-indigo-400">Everything you need</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Smart Financial Management
            </p>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Take control of your finances with our comprehensive suite of tools and features.
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              {[
                {
                  name: 'Smart Tracking',
                  description: 'Automatically categorize transactions and track spending patterns with AI-powered insights.',
                  icon: '📊'
                },
                {
                  name: 'Real-time Analytics',
                  description: 'Get instant insights into your spending habits with beautiful, interactive charts and reports.',
                  icon: '📈'
                },
                {
                  name: 'Secure & Private',
                  description: 'Your data is encrypted and stored locally. We never share your financial information.',
                  icon: '🔒'
                }
              ].map((feature) => (
                <div key={feature.name} className="feature-card flex flex-col">
                  <dt className="text-base font-semibold leading-7 text-gray-900 dark:text-white">
                    <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600 dark:bg-indigo-500">
                      <span className="text-2xl">{feature.icon}</span>
                    </div>
                    {feature.name}
                  </dt>
                  <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600 dark:text-gray-300">
                    <p className="flex-auto">{feature.description}</p>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section ref={reviewsRef} className="py-24 sm:py-32 bg-gray-50 dark:bg-gray-800">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Loved by Users Worldwide
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              See what our community has to say about NTEK Finance Tracker
            </p>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 lg:mt-20 lg:max-w-none lg:grid-cols-3">
            {[
              {
                content: "NTEK has completely transformed how I manage my finances. The interface is intuitive and the insights are incredibly valuable.",
                author: "Sarah Chen",
                role: "Small Business Owner",
                rating: 5
              },
              {
                content: "The best finance tracker I've ever used. The offline capability and local storage give me peace of mind about my data.",
                author: "Michael Rodriguez",
                role: "Freelancer",
                rating: 5
              },
              {
                content: "Beautiful interface and powerful features. NTEK makes financial management actually enjoyable!",
                author: "Emily Thompson",
                role: "Personal Finance Enthusiast",
                rating: 5
              }
            ].map((review, index) => (
              <div key={index} className="review-card flex flex-col justify-between">
                <div className="relative bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-lg ring-1 ring-gray-900/5 dark:ring-white/5">
                  <div className="flex items-center gap-x-1 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-gray-900 dark:text-white">
                    <p>"{review.content}"</p>
                  </blockquote>
                  <div className="mt-6 flex items-center gap-x-4">
                    <div className="text-sm">
                      <div className="font-semibold text-gray-900 dark:text-white">{review.author}</div>
                      <div className="text-gray-600 dark:text-gray-400">{review.role}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section ref={roadmapRef} className="py-24 sm:py-32 bg-white dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Development Roadmap
            </h2>
            <p className="mt-6 text-lg leading-8 text-gray-600 dark:text-gray-300">
              Our journey to build the ultimate financial management platform
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl lg:max-w-none">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <div className="roadmap-item rounded-2xl bg-gray-50 dark:bg-gray-800 p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Current Features
                </h3>
                <ul className="space-y-4">
                  {[
                    'Smart Transaction Tracking',
                    'Customizable Categories',
                    'Beautiful Analytics Dashboard',
                    'Budget Management',
                    'Dark/Light Mode',
                    'Offline Support',
                    'Data Export',
                    'Receipt Scanning'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-x-3">
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="roadmap-item rounded-2xl bg-gray-50 dark:bg-gray-800 p-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                  Coming Soon
                </h3>
                <ul className="space-y-4">
                  {[
                    'Multi-currency Support',
                    'Bill Reminders',
                    'Investment Portfolio Tracking',
                    'AI-powered Insights',
                    'Shared Budgets',
                    'Mobile Apps',
                    'Bank Integration',
                    'Financial Goals'
                  ].map((feature, index) => (
                    <li key={index} className="flex items-center gap-x-3">
                      <div className="h-5 w-5 rounded-full border-2 border-indigo-500 dark:border-indigo-400" />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative isolate overflow-hidden bg-gray-900">
        <div className="px-6 py-24 sm:px-6 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Ready to Transform Your Finances?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-300">
              Join thousands of users who are already managing their finances smarter with NTEK.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                to="/register"
                className="rounded-full bg-white px-8 py-3 text-base font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white transition-all duration-300 hover:scale-105"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="text-base font-semibold leading-6 text-white flex items-center group"
              >
                Sign in <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-2" />
              </Link>
            </div>
          </div>
        </div>
        <svg
          viewBox="0 0 1024 1024"
          className="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-x-1/2 -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)]"
          aria-hidden="true"
        >
          <circle cx="512" cy="512" r="512" fill="url(#gradient)" fillOpacity="0.7" />
          <defs>
            <radialGradient id="gradient">
              <stop stopColor="#3B82F6" />
              <stop offset="1" stopColor="#1E40AF" />
            </radialGradient>
          </defs>
        </svg>
      </section>
    </div>
  );
};

export default Home;