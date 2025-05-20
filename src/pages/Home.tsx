import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, CheckCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const reviewsRef = useRef(null);
  const roadmapRef = useRef(null);

  useEffect(() => {
    // Hero section animations
    gsap.from(heroRef.current, {
      opacity: 0,
      y: 100,
      duration: 1,
      ease: "power4.out"
    });

    // Features section animations
    gsap.from(".feature-card", {
      scrollTrigger: {
        trigger: featuresRef.current,
        start: "top center",
        toggleActions: "play none none reverse"
      },
      opacity: 0,
      y: 50,
      stagger: 0.2,
      duration: 0.8,
      ease: "back.out(1.7)"
    });

    // Reviews section animations
    gsap.from(".review-card", {
      scrollTrigger: {
        trigger: reviewsRef.current,
        start: "top center",
        toggleActions: "play none none reverse"
      },
      opacity: 0,
      x: -50,
      stagger: 0.3,
      duration: 0.8,
      ease: "power2.out"
    });

    // Roadmap section animations
    gsap.from(".roadmap-card", {
      scrollTrigger: {
        trigger: roadmapRef.current,
        start: "top center",
        toggleActions: "play none none reverse"
      },
      opacity: 0,
      scale: 0.9,
      stagger: 0.2,
      duration: 0.6,
      ease: "power1.out"
    });
  }, []);

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

  const features = [
    {
      title: "Smart Tracking",
      description: "Automatically categorize and track your expenses with AI-powered insights",
      icon: "📊"
    },
    {
      title: "Real-time Sync",
      description: "Access your financial data across all devices with instant synchronization",
      icon: "🔄"
    },
    {
      title: "Secure & Private",
      description: "Bank-level encryption ensures your financial data stays safe and private",
      icon: "🔒"
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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
      {/* Hero Section */}
      <section ref={heroRef} className="relative overflow-hidden py-20 sm:py-32 lg:pb-32 xl:pb-36">
        <div className="absolute inset-0 bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.100),white)] dark:bg-[radial-gradient(45rem_50rem_at_top,theme(colors.indigo.900),theme(colors.gray.900))] opacity-20"></div>
        
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-x-8 lg:gap-y-20">
            <div className="relative z-10 mx-auto max-w-2xl lg:col-span-7 lg:max-w-none lg:pt-6 xl:col-span-6">
              <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-blue-500 dark:from-indigo-400 dark:to-blue-300 bg-clip-text text-transparent sm:text-6xl">
                Transform Your Finances with NTEK
              </h1>
              <p className="mt-6 text-lg text-gray-600 dark:text-gray-300">
                Experience the future of financial management. Smart tracking, real-time insights, and powerful analytics - all in one place.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  to="/register"
                  className="transform hover:scale-105 transition-all duration-300 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg hover:from-indigo-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Start Free Trial
                </Link>
                <Link
                  to="/login"
                  className="transform hover:scale-105 transition-all duration-300 rounded-lg bg-white/10 backdrop-blur-sm px-4 py-2.5 text-sm font-semibold text-gray-900 dark:text-white ring-1 ring-inset ring-gray-300 dark:ring-white/20 hover:bg-gray-50 dark:hover:bg-white/5"
                >
                  Sign in
                </Link>
              </div>
            </div>
            <div className="relative mt-10 sm:mt-20 lg:col-span-5 lg:row-span-2 lg:mt-0 xl:col-span-6">
              <div className="absolute -top-64 -right-64 opacity-50 dark:opacity-30">
                <div className="aspect-[1108/632] w-[69.25rem] bg-gradient-to-r from-blue-500 to-indigo-500 opacity-20 blur-3xl"></div>
              </div>
              <div className="relative aspect-[16/9] overflow-hidden rounded-2xl bg-gray-50 dark:bg-gray-800 shadow-2xl ring-1 ring-gray-900/10 dark:ring-white/10">
                <img
                  src="https://images.pexels.com/photos/7567434/pexels-photo-7567434.jpeg"
                  alt="App screenshot"
                  className="absolute inset-0 h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section ref={featuresRef} className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Powerful Features for Modern Finance
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Everything you need to take control of your financial future
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="feature-card relative overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg ring-1 ring-gray-900/10 dark:ring-white/10 transition-all duration-300 hover:shadow-xl"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {feature.title}
                </h3>
                <p className="mt-4 text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews Section */}
      <section ref={reviewsRef} className="py-20 sm:py-32 bg-gray-50 dark:bg-gray-800/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Loved by Users Worldwide
            </h2>
          </div>
          <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-8 lg:mt-20 lg:max-w-none lg:grid-cols-3">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="review-card flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-900/10 dark:ring-white/10 transition-all duration-300 hover:shadow-xl"
              >
                <div className="p-8">
                  <div className="flex items-center gap-x-2 mb-4">
                    {[...Array(review.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="flex-1">
                    <p className="text-lg leading-8 text-gray-900 dark:text-white">
                      {review.content}
                    </p>
                  </blockquote>
                  <div className="mt-6 border-t border-gray-900/10 dark:border-gray-600 pt-6">
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {review.name}
                    </p>
                    <p className="mt-1 text-gray-600 dark:text-gray-300">
                      {review.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Roadmap Section */}
      <section ref={roadmapRef} className="py-20 sm:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Development Roadmap
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Our journey to build the ultimate financial management platform
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {roadmap.map((section, index) => (
              <div
                key={index}
                className="roadmap-card overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg ring-1 ring-gray-900/10 dark:ring-white/10"
              >
                <div className="p-8">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    {section.title}
                  </h3>
                  <ul className="space-y-4">
                    {section.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-center gap-x-3">
                        <CheckCircle
                          className={`h-5 w-5 ${
                            index === 0
                              ? "text-green-500"
                              : "text-gray-400 dark:text-gray-500"
                          }`}
                        />
                        <span className="text-gray-700 dark:text-gray-300">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-blue-500 opacity-10 dark:opacity-20"></div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              Ready to Transform Your Finances?
            </h2>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Join thousands of users who are already managing their finances smarter with NTEK.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link
                to="/register"
                className="transform hover:scale-105 transition-all duration-300 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-500 px-6 py-3 text-base font-semibold text-white shadow-lg hover:from-indigo-500 hover:to-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Get Started Now
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;