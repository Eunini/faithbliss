"use client";

import Link from "next/link";
import { Heart } from "lucide-react";
import { useState, useEffect } from "react";

// Simple fade-in animation component
const FadeIn = ({ children, delay = 0 }: { children: React.ReactNode, delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`transition-all duration-1000 ease-out ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
    >
      {children}
    </div>
  );
};

export default function Home() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    let ticking = false;
    const smoothScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', smoothScroll, { passive: true });
    return () => window.removeEventListener('scroll', smoothScroll);
  }, []);

  // Tinder-style scroll calculations
  const heroHeight = typeof window !== 'undefined' ? window.innerHeight : 800;
  const scrollProgress = Math.min(scrollY / heroHeight, 1);
  
  // Background parallax - slower movement (Tinder style)
  const bgTransform = scrollY * 0.3;
  
  // Content fade and movement - faster than background
  const contentOpacity = Math.max(0, 1 - scrollProgress * 1.2);
  const contentTransform = scrollY * 0.6;
  
  // Headline scale effect (Tinder-style)
  const headlineScale = Math.max(0.8, 1 - scrollProgress * 0.3);
  const headlineOpacity = Math.max(0, 1 - scrollProgress * 1.5);
  
  // Sticky CTA button effect
  const buttonStickyThreshold = heroHeight * 0.7; // Start sticky at 70% scroll
  const buttonStickyEnd = heroHeight * 0.9; // End sticky at 90% scroll
  const isButtonSticky = scrollY > buttonStickyThreshold && scrollY < buttonStickyEnd;
  const buttonOpacity = scrollY < buttonStickyEnd ? 1 : Math.max(0, 1 - (scrollY - buttonStickyEnd) / 200);
  
  // Navigation background appears on scroll
  const navOpacity = Math.min(scrollY / 100, 0.95);

  return (
    <main className="bg-gray-900" style={{ scrollBehavior: 'smooth' }}>
      {/* Navigation */}
      <nav 
        className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
        style={{
          backgroundColor: `rgba(17, 24, 39, ${navOpacity})`,
          backdropFilter: navOpacity > 0.1 ? 'blur(10px)' : 'none',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-pink-500" />
              <span className="text-2xl font-bold text-white">FaithBliss</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-white hover:text-pink-400 transition-colors">Features</a>
              <a href="#stories" className="text-white hover:text-pink-400 transition-colors">Success Stories</a>
              <a href="#download" className="text-white hover:text-pink-400 transition-colors">Download</a>
            </div>
            <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-2 rounded-full hover:from-pink-600 hover:to-purple-700 transition-all">
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section with Tinder-Style Parallax */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Layer - Slower movement */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 will-change-transform"
          style={{
            backgroundImage: "url('/bgimage.jpg')",
            transform: `translate3d(0, ${bgTransform}px, 0) scale(1.1)`,
          }}
        >
          {/* Multi-layer Dark Overlay - Enhanced for text visibility */}
          <div className="absolute inset-0 bg-black/40"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/60 to-black/80"></div>
          {/* <div className="absolute inset-0 bg-gradient-to-r from-pink-900/20 to-purple-900/20"></div> */}
        </div>
        
        {/* Content Layer - Faster movement with fade */}
        <div 
          className="relative z-10 h-screen flex items-center justify-center px-4 will-change-transform"
          style={{
            opacity: contentOpacity,
            transform: `translate3d(0, ${contentTransform}px, 0)`,
          }}
        >
          <div className="text-center text-white max-w-4xl mx-auto flex flex-col items-center justify-center">
            {/* Headline with Tinder-style scale and fade effect */}
            <div 
              className="will-change-transform flex flex-col items-center"
              style={{
                opacity: headlineOpacity,
                transform: `scale(${headlineScale})`,
              }}
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-center">
                  Find Your Faithful
                <span className="block bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">
                  Connection
                </span>
              </h1>
              <p className="text-xl md:text-2xl mb-8 text-gray-200 max-w-2xl mx-auto text-center">
                Connect with like-minded Christians who share your values, faith, and desire for meaningful relationships.
              </p>
            </div>
          </div>
        </div>

        {/* Sticky CTA Button - Tinder Style */}
        <div 
          className={`${isButtonSticky ? 'fixed' : 'absolute'} bottom-20 left-1/2 z-30 will-change-transform flex items-center justify-center`}
          style={{
            opacity: buttonOpacity,
            transform: `translate(-50%, 0) scale(${isButtonSticky ? 1.05 : 1})`,
          }}
        >
          <button className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:from-pink-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-2xl hover:shadow-pink-500/25 backdrop-blur-sm border border-pink-400/20">
            Join the Family
          </button>
        </div>

        
      </section>

      {/* Success Stories Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 relative overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-10">
          <FadeIn>
            <div className="text-center mb-20">
              <h2 className="text-6xl md:text-7xl font-black mb-6 bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Love Stories
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Real couples who found their forever person through faith, love, and divine timing 
              </p>
            </div>
          </FadeIn>

          {/* Story Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FadeIn delay={300}>
              <div className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                        S&D
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Sarah & David</h3>
                        <p className="text-purple-300 text-sm"> Engaged 2025</p>
                      </div>
                    </div>
                    <div className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <blockquote className="text-gray-300 leading-relaxed text-sm">
                    Found my prayer partner and soulmate! We bonded over mission trips and now were planning to serve together in ministry.
                  </blockquote>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={400}>
              <div className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-blue-500/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold">
                        J&R
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">James & Rachel</h3>
                        <p className="text-blue-300 text-sm"> Dating 1 Year</p>
                      </div>
                    </div>
                    <div className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <blockquote className="text-gray-300 leading-relaxed text-sm">
                    What started as a conversation about favorite Bible verses turned into the most beautiful relationship. Thank you FaithBliss!
                  </blockquote>
                </div>
              </div>
            </FadeIn>

            <FadeIn delay={500}>
              <div className="group bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-green-500/50 transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-green-500/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center text-white font-bold">
                        M&L
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">Michael & Lisa</h3>
                        <p className="text-green-300 text-sm"> Married 2023</p>
                      </div>
                    </div>
                    <div className="text-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
                  </div>
                  <blockquote className="text-gray-300 leading-relaxed text-sm">
                    We discovered we both volunteer at the same shelter! Gods timing is perfect. Now we serve together as husband and wife.
                  </blockquote>
                </div>
              </div>
            </FadeIn>
          </div>

         
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="bg-gray-900 text-white py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-8 md:mb-0">
              <h3 className="text-2xl font-bold bg-gradient-to-r from-pink-400 to-blue-400 bg-clip-text text-transparent">
                FaithBliss 
              </h3>
              <p className="text-gray-400 mt-2">Building faithful connections</p>
            </div>
            
            <div className="flex space-x-8">
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors">About</Link>
              <Link href="/privacy" className="text-gray-300 hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="text-gray-300 hover:text-white transition-colors">Terms</Link>
              <Link href="/contact" className="text-gray-300 hover:text-white transition-colors">Contact</Link>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
               2025 FaithBliss. Built with  & faith.
            </p>
          </div>
        </div>
      </footer>
    </main>
  );
}
