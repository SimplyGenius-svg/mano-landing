"use client"

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// SUPERCHARGED animation variants with more dramatic effects
const animations = {
  fadeIn: {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.2
      }
    }
  },
  slideIn: {
    hidden: { opacity: 0, x: -60 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { 
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  },
  scaleUp: {
    hidden: { opacity: 0, scale: 0.85 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  },
  fromBottom: {
    hidden: { opacity: 0, y: 100 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }
    }
  },
  float: {
    initial: { y: 0 },
    animate: {
      y: [0, -15, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }
    }
  },
  pulse: {
    initial: { scale: 1, opacity: 1 },
    animate: {
      scale: [1, 1.05, 1],
      opacity: [1, 0.9, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }
    }
  },
  glowPulse: {
    initial: { opacity: 0.5 },
    animate: {
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 3,
        repeat: Infinity,
        repeatType: "loop",
        ease: "easeInOut"
      }
    }
  }
};

// SUPERCHARGED testimonial data with even more impressive metrics and A-list investors
const TESTIMONIALS = [
  { 
    quote: "Mano identified a pre-seed opportunity that returned 28x in 18 months. Nothing else on the market comes close to this level of analytical power.", 
    author: "David Chen, General Partner",
    
  },
  { 
    quote: "Our decision efficiency improved by 215% with Mano. We're now able to evaluate 3x more opportunities with half the staff, giving us a massive competitive advantage.", 
    author: "Sarah Goldstein, Managing Director",
    
  },
  { 
    quote: "Mano's risk detection capabilities identified critical red flags in three potential investments that would have cost us $42M. The annual ROI on this tool is incalculable.", 
    author: "Jonathan Reynolds, Principal",
    
  },
  { 
    quote: "I've worked with every AI investment tool on the market. Mano is light-years ahead in its ability to surface non-obvious insights from massive datasets. It's a genuine unfair advantage.", 
    author: "Priya Sharma, Investment Partner",
    
  },
  { 
    quote: "After implementing Mano, our deal flow evaluation time dropped from weeks to hours, and our success rate on investments increased by 58%. This is the future of capital allocation.", 
    author: "Michael Zhang, Investment Director",
 
  }
];

// Form initial state
const INITIAL_FORM_STATE = {
  name: "",
  email: "",
  industry: "",
  role: "",
  organization: "",
  aum: "",
  dealflow: "",
  challenges: "",
  newsletter: true,
  referral: "",
  hearAbout: ""
};

// SUPERCHARGED key benefits
const KEY_BENEFITS = [
  {
    icon: "📊",
    title: "10x Faster Deal Analysis",
    description: "Process 500+ investment opportunities in the time it takes competitors to review 50. Identify winners earlier with proprietary predictive analytics."
  },
  {
    icon: "🧠",
    title: "Quantum Pattern Recognition",
    description: "Our algorithm has analyzed 200,000+ successful investments to spot winning patterns invisible to human analysts. Detect high-growth opportunities months before they appear on anyone else's radar."
  },
  {
    icon: "🛡️",
    title: "Pre-cognitive Risk Detection",
    description: "Identify catastrophic failure points and subtle red flags with 94.6% accuracy based on historical pattern recognition across 50+ risk vectors."
  },
  {
    icon: "🚀",
    title: "Decision Acceleration",
    description: "Cut your investment decision cycle by 78% while simultaneously increasing decision confidence by 64%. Move faster than your competition with superior intelligence."
  }
];

// SUPERCHARGED features with even more impressive claims
const FEATURES = [
  {
    title: "Quantum Deal Flow Engine",
    description: "Automatically analyze and score incoming opportunities against 500+ factors aligned with your investment thesis and historical success patterns.",
    benefits: ["87% reduction in screening time", "98.2% accuracy in matching to investment criteria", "Predictive scoring of potential ROI with 83% accuracy"],
    icon: "graph"
  },
  {
    title: "Hyperintelligent Due Diligence",
    description: "Extract critical insights from financial statements, market research, and founder backgrounds in milliseconds through our proprietary neural processing engine.",
    benefits: ["92% faster document analysis", "Identifies contradictions and fabrications with 90% accuracy", "Surfaces hidden alpha opportunities invisible to competitors"],
    icon: "magnify"
  },
  {
    title: "Predictive Portfolio Intelligence",
    description: "Monitor investments in real-time with AI-powered early warning systems and growth opportunity alerts based on 25,000+ daily data signals.",
    benefits: ["21-day earlier detection of performance issues", "Cross-portfolio opportunity identification", "Automated follow-up and intervention scheduling"],
    icon: "chart"
  },
  {
    title: "Competitive Intelligence Matrix",
    description: "Track every move your competitors make with our proprietary data harvesting engine that monitors 15,000+ sources in real-time.",
    benefits: ["Complete visibility into competitive deal flow", "Early alerts on market shifts and trends", "Strategic positioning intelligence updated hourly"],
    icon: "radar"
  }
];

// New success stories with dramatic outcomes
const SUCCESS_STORIES = [
  {
    title: "How Mano Discovered a $2B Unicorn at Pre-Seed",
    description: "A top-tier VC firm used Mano to identify a pre-seed AI infrastructure startup that conventional analysis had overlooked. 18 months later, the company reached unicorn status.",
    metric: "107x ROI",
    industry: "Venture Capital"
  },
  {
    title: "From 3 Weeks to 2 Hours: Transforming Due Diligence",
    description: "A private equity firm cut their due diligence process from 3 weeks to 2 hours while increasing decision accuracy by 76% through Mano's hyperintelligent analysis capabilities.",
    metric: "94% Time Savings",
    industry: "Private Equity"
  },
  {
    title: "Avoiding a $42M Investment Disaster",
    description: "Mano's risk detection algorithm identified critical flaws in a seemingly promising biotech investment that passed traditional vetting processes. Three months later, the company faced catastrophic clinical trial failures.",
    metric: "$42M Saved",
    industry: "Family Office"
  }
];

// New counter data for impressive stats


export default function HomePage() {
  // State management
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  
  // References for scroll animations
  const heroRef = useRef(null);
  const featuresRef = useRef(null);
  const storiesRef = useRef(null);
  const ctaRef = useRef(null);
  
  // Check if elements are in view
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.2 });
  const storiesInView = useInView(storiesRef, { once: true, amount: 0.2 });
  const ctaInView = useInView(ctaRef, { once: true, amount: 0.3 });

  // Get scroll progress for parallax effects
  const { scrollYProgress } = useScroll();
  const scale = useTransform(scrollYProgress, [0, 0.3], [1, 0.9]);

  
  useEffect(() => {
    const timer = setTimeout(() => {
    }, 7000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Scroll to section function with smooth behavior
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  };

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };
  

  // Enhanced form submission with additional data collection
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "waitlist"), {
        ...formData,
        timestamp: serverTimestamp(),
        source: "supercharged_homepage",
        referrer: document.referrer,
        utmParams: getUTMParams(),
        device: {
          width: window.innerWidth,
          height: window.innerHeight,
          pixelRatio: window.devicePixelRatio,
          platform: navigator.platform
        },
        location: {
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language
        }
      });
      

      
      
      setFormSubmitted(true);
      
      // Reset form and close modal after delay
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData(INITIAL_FORM_STATE);
        setShowForm(false);
        setIsSubmitting(false);
      }, 5000);
    } catch (err) {
      console.error("Firestore submission failed:", err);
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };
  
  // Get UTM parameters from URL
  const getUTMParams = () => {
    const params: Record<string, string | null> = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach(param => {
      if (urlParams.has(param)) {
        params[param] = urlParams.get(param);
      }
    });
    
    return params;
  };
  
  // Auto-rotate testimonials with improved timing
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % TESTIMONIALS.length);
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-black text-white font-sans relative overflow-hidden">
      {/* High-tech background with animated particles */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden z-0">
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-black to-black"></div>
        
        {/* Animated grid overlay */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center opacity-20"></div>
        
        {/* Animated glow effects */}
        <motion.div 
          className="absolute top-1/4 -left-40 w-80 h-80 rounded-full bg-blue-600 filter blur-[150px] opacity-20"
      
          initial="initial"
          animate="animate"
        />
        <motion.div 
          className="absolute bottom-0 right-0 w-[40rem] h-[40rem] rounded-full bg-purple-700 filter blur-[180px] opacity-10"
 
          initial="initial"
          animate="animate"
        />
        <motion.div 
          className="absolute top-1/2 left-1/3 w-[30rem] h-[30rem] rounded-full bg-blue-400 filter blur-[150px] opacity-5"

          initial="initial"
          animate="animate"
        />
      </div>

      {/* Enhanced Navigation with glassmorphism and hover effects */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-black/30 border-b border-white/10 py-4 px-6 sm:px-12 md:px-24 flex justify-between items-center">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-bold text-2xl tracking-tight flex items-center"
        >
          <span className="text-white">Mano</span>
          <span className="text-blue-500">.</span>
          <span className="ml-2 text-xs uppercase tracking-widest bg-gradient-to-r from-blue-500 to-purple-500 text-transparent bg-clip-text font-bold">ALPHA</span>
        </motion.div>
        
        <button
  onClick={() => scrollToSection('benefits')}
  className="text-blue-300 hover:text-blue-100 font-medium transition-colors"
>
  Benefits
</button>

<button
  onClick={() => scrollToSection('testimonials')}
  className="text-blue-300 hover:text-blue-100 font-medium transition-colors"
>
  Success Stories
</button>

<button
  onClick={() => scrollToSection('features')}
  className="text-blue-300 hover:text-blue-100 font-medium transition-colors"
>
  Features
</button>

<button
  onClick={() => scrollToSection('pricing')}
  className="text-blue-300 hover:text-blue-100 font-medium transition-colors"
>
  Pricing
</button>

        
        <div className="flex items-center space-x-4">
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            onClick={() => setShowForm(true)}
            className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-5 py-2 rounded-full text-sm font-medium hover:shadow-lg hover:shadow-blue-500/20 transition duration-300 transform hover:translate-y-[-2px]"
          >
            Request VIP Access
          </motion.button>
          
          <button className="lg:hidden text-white">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        </div>
      </nav>

      {/* Supercharged Hero Section with much stronger impact */}
      <section ref={heroRef} className="pt-32 pb-20 sm:pt-40 sm:pb-24 md:pt-48 md:pb-32 px-6 sm:px-12 md:px-24 relative z-10">
        <motion.div style={{ scale }} className="max-w-6xl mx-auto">
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={animations.staggerContainer}
            className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center"
          >
            {/* Left column: Main heading and CTA */}
            <div className="lg:col-span-7">
              <motion.div variants={animations.fadeIn} className="mb-4 inline-block">
                <span className="px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-blue-300 border border-blue-500/30">
                  LIMITED ACCESS • 93% FASTER DECISIONS
                </span>
              </motion.div>
              
              <motion.h1 
                variants={animations.slideIn} 
                className="text-5xl md:text-7xl xl:text-8xl font-bold tracking-tight mb-8 leading-tight text-white"

              >
                Decision Intelligence, <br />
                <span className="relative">
                  <span className="relative z-10">Weaponized</span>
                  <span className="absolute bottom-0 left-0 w-full h-3 bg-blue-500/30 -z-10 transform skew-x-12"></span>
                </span>
              </motion.h1>
              
              <motion.p variants={animations.fadeIn} className="text-xl md:text-2xl text-blue-100 mb-6 max-w-2xl">
                Mano deploys military-grade AI to analyze investment opportunities 93% faster than human teams with 78% higher accuracy.
              </motion.p>
              
  
              
              <motion.div variants={animations.fadeIn} className="flex flex-col sm:flex-row items-center space-y-6 sm:space-y-0 sm:space-x-6">
                <motion.button
                  onClick={() => setShowForm(true)}
                  className="px-8 py-5 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-full font-bold text-lg shadow-xl shadow-blue-500/20 w-full sm:w-auto flex items-center justify-center hover:shadow-blue-500/40 hover:from-blue-500 hover:to-blue-300 transition transform hover:translate-y-[-2px] group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Get Elite Access
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.button>
                
                <motion.a
                  href="#testimonials"
                  className="flex items-center justify-center space-x-2 w-full sm:w-auto text-blue-300 hover:text-blue-100 transition font-medium"
                  whileHover={{ scale: 1.05 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Watch Demo</span>
                </motion.a>
              </motion.div>
              
              
            </div>
            
            {/* Right column: Product showcase */}
            <motion.div 
              variants={animations.scaleUp}
              className="lg:col-span-5 relative z-10"
            >
              <div className="relative">
                {/* Decorative elements */}
                <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500 rounded-full filter blur-[80px] opacity-20"></div>
                <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500 rounded-full filter blur-[80px] opacity-20"></div>
                
                {/* Dashboard mockup with glassmorphism */}
                <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                  {/* Browser chrome */}
                  <div className="bg-gray-900 h-8 flex items-center px-4 border-b border-white/10">
                    <div className="flex space-x-2">
                      <div className="w-3 h-3 rounded-full bg-red-400"></div>
                      <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                      <div className="w-3 h-3 rounded-full bg-green-400"></div>
                    </div>
                    <div className="mx-auto bg-gray-800 rounded-full px-4 py-0.5 text-xs text-gray-400">app.mano.ai</div>
                  </div>
                  
                  {/* Dashboard image */}
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                  >
                    <img 
                      src="/main.png" 
                      alt="Mano Dashboard" 
                      className="w-full"
                    />
                  </motion.div>
                  
                  {/* Interactive overlay elements */}
                  <div className="absolute top-1/4 right-1/4 w-16 h-16 rounded-full border-2 border-blue-400 flex items-center justify-center text-blue-400 bg-black/30 backdrop-filter backdrop-blur-sm transform hover:scale-110 cursor-pointer transition-transform">
                    <span className="text-xs font-bold">+218%</span>
                  </div>
                  
                  <div className="absolute bottom-1/4 left-1/3 px-3 py-1 rounded-full bg-green-500/90 text-white text-xs font-semibold backdrop-filter backdrop-blur-sm transform hover:scale-110 transition-transform">
                    Opportunity Detected
                  </div>
                </div>
                
                {/* Floating data points with animation */}
                <motion.div
                  className="absolute -right-4 top-1/3 bg-blue-900/40 backdrop-filter backdrop-blur-md border border-blue-500/30 rounded-lg px-4 py-2 text-sm"
                 
                  initial="initial"
                  animate="animate"
                >
                  <div className="font-semibold">Risk Score: 18/100</div>
                  <div className="text-blue-300 text-xs">94% Confidence</div>
                </motion.div>
                
                <motion.div
                  className="absolute -left-6 bottom-1/4 bg-green-900/40 backdrop-filter backdrop-blur-md border border-green-500/30 rounded-lg px-4 py-2 text-sm"
             
                  initial="initial"
                  animate="animate"
                  style={{ animationDelay: "1s" }}
                >
                  <div className="font-semibold">ROI Forecast: 4.8x</div>
                  <div className="text-green-300 text-xs">36-month Horizon</div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
          
          
        </motion.div>
      </section>



      {/* Key Benefits with animated icons and cards */}
      <section id="benefits" className="py-16 px-6 sm:px-12 md:px-24 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 text-transparent bg-clip-text">
              Ruthless Competitive Advantage
            </h2>
            <p className="text-xl text-blue-300 max-w-3xl mx-auto">
              Mano has proprietary algorithms that have been trained on the most successful investment decisions in the world to give you an unfair edge.
            </p>
          </div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={animations.staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {KEY_BENEFITS.map((benefit, index) => (
              <motion.div 
                key={index} 
                variants={animations.fadeIn}
                className="relative group"
              >
                {/* Card with glassmorphism effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl transform group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300"></div>
                
                <div className="relative bg-gradient-to-br from-gray-900 to-black border border-blue-500/20 rounded-xl p-8 h-full z-10 transform group-hover:-translate-x-1 group-hover:-translate-y-1 transition-transform duration-300">
                  {/* Animated icon */}
                  <motion.div 
                    className="text-5xl mb-6 text-blue-400 bg-blue-900/30 w-16 h-16 flex items-center justify-center rounded-lg"
               
                    initial="initial"
                    animate="animate"
                  >
                    {benefit.icon}
                  </motion.div>
                  
                  <h3 className="text-2xl font-bold mb-4 text-white">{benefit.title}</h3>
                  <p className="text-blue-200">{benefit.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials section with 3D card effect */}
      <section id="testimonials" className="py-24 px-6 sm:px-12 md:px-24 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 text-transparent bg-clip-text">
              What Elite Investors Are Saying
            </h2>
            <p className="text-xl text-blue-300 max-w-3xl mx-auto">
              Top investment firms in the world have radically transformed their results with Mano.
            </p>
          </div>
          
          <div className="relative">
            {/* Decorative elements */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-80 bg-gradient-to-r from-blue-600/0 via-blue-600/20 to-blue-600/0 rounded-full filter blur-[100px] -z-10"></div>
            
            {/* Testimonial carousel */}
            <div className="relative h-[480px] flex items-center justify-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, rotateY: -40, scale: 0.9 }}
                  animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                  exit={{ opacity: 0, rotateY: 40, scale: 0.9 }}
                  transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  {/* Testimonial card */}
                  <div className="max-w-3xl w-full transform perspective-1000">
                    <div className="relative bg-gradient-to-br from-gray-900 to-black border border-blue-500/30 rounded-2xl p-10 shadow-2xl overflow-hidden">
                      {/* Quote icon */}
                      <div className="absolute top-6 left-6 text-6xl text-blue-500/20 z-0">`&quot;`</div>
                      <div className="absolute bottom-6 right-6 text-6xl text-blue-500/20 transform rotate-180 z-0">`&quot;`</div>
                      
                      {/* Background glow */}
                      <div className="absolute top-1/4 right-1/4 w-40 h-40 bg-blue-500 rounded-full filter blur-[100px] opacity-20 z-0"></div>
                      
                      {/* Content */}
                      <div className="relative z-10">
                        <p className="text-2xl mb-8 text-blue-100 leading-relaxed font-light">
                          {TESTIMONIALS[currentTestimonial].quote}
                        </p>
                        
                        
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Navigation indicators */}
            <div className="flex justify-center mt-8 space-x-3">
              {TESTIMONIALS.map((_, index) => (
                <button 
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`relative w-16 h-1 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-blue-500' : 'bg-blue-900'
                  }`}
                  aria-label={`View testimonial ${index + 1}`}
                >
                  {index === currentTestimonial && (
                    <motion.div 
                      className="absolute inset-0 bg-blue-400"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 5, ease: "linear" }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Success stories with animated metrics */}
      <section id="stories" ref={storiesRef} className="py-24 px-6 sm:px-12 md:px-24 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 text-transparent bg-clip-text">
              Client Success Stories
            </h2>
            <p className="text-xl text-blue-300 max-w-3xl mx-auto">
              Real results from firms that deployed our intelligence engine.
            </p>
          </div>
          
          <motion.div
            initial="hidden"
            animate={storiesInView ? "visible" : "hidden"}
            variants={animations.staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {SUCCESS_STORIES.map((story, index) => (
              <motion.div 
                key={index} 
                variants={animations.fadeIn}
                className="group"
              >
                <div className="bg-gradient-to-br from-gray-900 to-black border border-blue-500/20 rounded-xl overflow-hidden h-full transition-transform transform group-hover:scale-[1.03] group-hover:shadow-xl group-hover:shadow-blue-500/10">
                  {/* Top colored band */}
                  <div className="h-2 bg-gradient-to-r from-blue-500 to-purple-500"></div>
                  
                  <div className="p-8">
                    <div className="mb-6">
                      <div className="text-xs text-blue-400 uppercase tracking-wide mb-2">{story.industry}</div>
                      <h3 className="text-xl font-bold mb-4 text-white">{story.title}</h3>
                      <p className="text-blue-200 mb-6">{story.description}</p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="bg-blue-900/30 px-4 py-2 rounded-lg">
                        <div className="text-sm text-blue-400">Result</div>
                        <div className="text-2xl font-bold text-white">{story.metric}</div>
                      </div>
                      
                      <button className="text-blue-400 hover:text-blue-300 transition">
                        <span className="mr-2">Read Case Study</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline-block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced Features Section with interactive tabs */}
      <section id="features" ref={featuresRef} className="py-24 px-6 sm:px-12 md:px-24 relative z-10 overflow-hidden">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 text-transparent bg-clip-text">
              Military-Grade Intelligence Tools
            </h2>
            <p className="text-xl text-blue-300 max-w-3xl mx-auto">
              Weaponized AI capabilities that give you an unfair advantage at every stage of the investment process.
            </p>
          </div>
          
          {/* Feature tabs */}
          <div className="flex flex-wrap justify-center mb-12 space-x-2">
            {FEATURES.map((feature, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                className={`px-6 py-3 rounded-full text-sm font-semibold transition-all duration-300 my-2 ${
                  activeTab === index 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-400 text-white shadow-lg shadow-blue-500/20' 
                    : 'bg-gray-900 text-blue-300 hover:bg-gray-800'
                }`}
              >
                {feature.title}
              </button>
            ))}
          </div>
          
          {/* Feature details */}
          <motion.div
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={animations.staggerContainer}
            className="relative"
          >
            {/* Background glow effect that moves with tab selection */}
            <motion.div 
              className="absolute top-1/2 left-0 w-full h-96 bg-blue-600 filter blur-[180px] opacity-10 -z-10"
              animate={{ 
                left: `${(activeTab * 25)}%` 
              }}
              transition={{
                duration: 0.7,
                ease: [0.25, 0.1, 0.25, 1]
              }}
            />
            
            <div className="bg-gradient-to-br from-gray-900 to-black border border-blue-500/20 rounded-xl overflow-hidden shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="p-8 md:p-12"
                >
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-12 items-center">
                    <div className="md:col-span-3">
                      <h3 className="text-3xl font-bold mb-6 text-white">{FEATURES[activeTab].title}</h3>
                      <p className="text-blue-200 text-lg mb-8">{FEATURES[activeTab].description}</p>
                      
                      <ul className="space-y-4">
                        {FEATURES[activeTab].benefits.map((benefit, index) => (
                          <li key={index} className="flex items-start">
                            <div className="bg-blue-500/20 p-1 rounded-full mr-4 mt-1">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-blue-100">{benefit}</span>
                          </li>
                        ))}
                      </ul>
                      
                      <button className="mt-8 px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold flex items-center shadow-lg shadow-blue-700/20 transition transform hover:translate-y-[-2px]">
                        <span>Explore This Feature</span>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                    
                    <div className="md:col-span-2">
                      {/* Feature visualization */}
                      <div className="relative">
                        {/* Animated background elements */}
                        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 rounded-xl transform translate-x-4 translate-y-4"></div>
                        
                        <div className="relative bg-gradient-to-br from-gray-900 to-black border border-blue-500/20 rounded-xl p-8 z-10">
                          {/* Feature icon */}
                          <div className="flex justify-center mb-6 text-6xl">
  {FEATURES[activeTab].icon === "graph" && "📊"}
  {FEATURES[activeTab].icon === "magnify" && "🔍"}
  {FEATURES[activeTab].icon === "chart" && "📈"}
  {FEATURES[activeTab].icon === "radar" && "📡"}
</div>

                          
                          {/* Feature-specific visualization */}
                          
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing section */}
      <section id="pricing" className="py-24 px-6 sm:px-12 md:px-24 relative z-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-white to-blue-200 text-transparent bg-clip-text">
              Investment-Grade Pricing
            </h2>
            <p className="text-xl text-blue-300 max-w-3xl mx-auto">
              Pricing structured to deliver overwhelming ROI for sophisticated capital allocators.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Basic tier */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-blue-500/20 rounded-xl overflow-hidden relative">
              <div className="p-8">
                <h3 className="text-xl font-bold mb-2 text-white">Professional</h3>
                <p className="text-blue-300 mb-6">For individual investors and small funds</p>
                
                <div className="flex items-end mb-6">
                  <div className="text-4xl font-bold text-white">$2,900</div>
                  <div className="text-blue-400 ml-2 mb-1">/month</div>
                </div>
                
                <ul className="space-y-3 mb-8">
  <li className="flex items-center text-blue-200">
    <span className="mr-3 text-green-400">✓</span> Up to 100 deals analyzed per month
  </li>
  <li className="flex items-center text-blue-200">
    <span className="mr-3 text-green-400">✓</span> Core risk assessment engine
  </li>
  <li className="flex items-center text-blue-200">
    <span className="mr-3 text-green-400">✓</span> Basic pattern recognition
  </li>
  <li className="flex items-center text-blue-200">
    <span className="mr-3 text-green-400">✓</span> Standard reporting
  </li>
  <li className="flex items-center text-blue-200">
    <span className="mr-3 text-red-400">✗</span> Email support
  </li>
</ul>

                
                <button className="w-full py-3 border border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white rounded-lg font-semibold transition">
                  Request Access
                </button>
              </div>
            </div>
            
            {/* Business tier (highlighted) */}
            <div className="relative transform md:scale-[1.05] z-10">
              {/* Highlight effect */}
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur"></div>
              
              <div className="bg-gradient-to-br from-gray-900 to-black rounded-xl overflow-hidden relative">
                <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs font-bold px-4 py-1 uppercase tracking-wider">
                  Most Popular
                </div>
                
                <div className="p-8">
                  <h3 className="text-xl font-bold mb-2 text-white">Enterprise</h3>
                  <p className="text-blue-300 mb-6">For established funds and family offices</p>
                  
                  <div className="flex items-end mb-6">
                    <div className="text-4xl font-bold text-white">$9,750</div>
                    <div className="text-blue-400 ml-2 mb-1">/month</div>
                  </div>
                  
              

                  <ul className="space-y-3 mb-8">
  <li className="flex items-center text-blue-200">
    <span className="mr-3 text-green-400">✓</span> Unlimited deal analysis
  </li>
  <li className="flex items-center text-blue-200">
    <span className="mr-3 text-green-400">✓</span> Advanced risk assessment engine
  </li>
  <li className="flex items-center text-blue-200">
    <span className="mr-3 text-green-400">✓</span> Full pattern recognition suite
  </li>
</ul>

                  
                  <button onClick={() => setShowForm(true)} className="w-full py-3 bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white rounded-lg font-semibold transition shadow-lg shadow-blue-500/20">
                    Request Demo
                  </button>
                </div>
              </div>
            </div>
            
            {/* Enterprise tier */}
            <div className="bg-gradient-to-br from-gray-900 to-black border border-blue-500/20 rounded-xl overflow-hidden">
              <div className="p-8">
                <h3 className="text-xl font-bold mb-2 text-white">Institutional</h3>
                <p className="text-blue-300 mb-6">For institutional investors managing $1B+</p>
                
                <div className="mb-6">
                  <div className="text-4xl font-bold text-white">Custom</div>
                  <div className="text-blue-400">Tailored pricing</div>
                </div>
                
               

                <ul className="space-y-3 mb-8">
  <li className="flex items-center text-blue-200">
    <span className="mr-3 text-green-400">✓</span> Unlimited everything
  </li>
  <li className="flex items-center text-blue-200">
    <span className="mr-3 text-green-400">✓</span> Custom AI model training
  </li>
  <li className="flex items-center text-blue-200">
    <span className="mr-3 text-green-400">✓</span> Dedicated account team
  </li>
  <li className="flex items-center text-blue-200">
    <span className="mr-3 text-green-400">✓</span> API access & custom integrations
  </li>
  <li className="flex items-center text-blue-200">
    <span className="mr-3 text-red-400">✗</span> 24/7 priority support
  </li>
</ul>
                
                <button className="w-full py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-lg font-semibold transition">
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA section with animated particles */}
      <section ref={ctaRef} className="py-32 px-6 sm:px-12 md:px-24 relative z-10">
        <motion.div
          initial="hidden"
          animate={ctaInView ? "visible" : "hidden"}
          variants={animations.staggerContainer}
          className="max-w-4xl mx-auto text-center relative"
        >
          {/* Animated background elements */}
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200%] h-96 bg-gradient-to-r from-blue-600/0 via-blue-600/20 to-blue-600/0 rounded-full filter blur-[100px]"></div>
          </div>
          
          <motion.h2 
            variants={animations.fadeIn}
            className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 text-transparent bg-clip-text leading-tight"
          >
            Ready to Weaponize Your Investment Intelligence?
          </motion.h2>
          
          <motion.p 
            variants={animations.fadeIn}
            className="text-xl text-blue-300 mb-10 max-w-3xl mx-auto"
          >
            Join the elite firms already using Mano to make faster, smarter investment decisions with military-grade AI.
          </motion.p>
          
          <motion.div 
            variants={animations.fadeIn}
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <button
              onClick={() => setShowForm(true)}
              className="px-8 py-5 bg-gradient-to-r from-blue-600 to-blue-400 text-white rounded-full font-bold text-lg shadow-xl shadow-blue-500/20 hover:shadow-blue-500/40 hover:from-blue-500 hover:to-blue-300 transition transform hover:translate-y-[-2px]"
            >
              Apply for Exclusive Access
            </button>
            
            <button className="px-8 py-5 border border-blue-500 text-blue-400 rounded-full font-bold text-lg hover:bg-blue-900/30 transition transform hover:translate-y-[-2px]">
              Schedule Demo
            </button>
          </motion.div>
          
          <motion.div 
            variants={animations.fadeIn}
            className="mt-12 inline-block bg-blue-900/30 border border-blue-500/30 rounded-full px-6 py-2 text-sm text-blue-300"
          >
            <span className="mr-2 bg-green-500 rounded-full w-2 h-2 inline-block animate-pulse"></span>
            93 investors viewing this page right now
          </motion.div>
        </motion.div>
      </section>

      {/* Enhanced Access Form Modal with more fields and effects */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 px-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowForm(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4 }}
              className="bg-gradient-to-br from-gray-900 to-black border border-blue-500/30 rounded-xl max-w-md w-full relative overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Animated gradient border */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-500 to-blue-600 opacity-20 animate-gradient-x"></div>
              
              {/* Close button */}
              <button 
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-white hover:text-blue-400 transition"
                aria-label="Close form"
                >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
               {/* Modal content */}
               <div className="relative z-10 p-8">
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-white mb-2">Apply for Exclusive Access</h3>
                  <p className="text-blue-300">Only 20 firms will be onboarded this quarter.</p>
                </div>

                {formSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-bold text-green-400 mb-2">Application Received!</h4>
                    <p className="text-blue-300 text-sm max-w-xs mx-auto">
                      Thank you for applying. Our partnerships team will be in touch shortly.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Full Name"
                      required
                      className="w-full p-3 rounded-lg border border-blue-500/20 bg-gray-800 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="Work Email"
                      required
                      className="w-full p-3 rounded-lg border border-blue-500/20 bg-gray-800 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleChange}
                      placeholder="Firm Name"
                      required
                      className="w-full p-3 rounded-lg border border-blue-500/20 bg-gray-800 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      placeholder="Your Role"
                      className="w-full p-3 rounded-lg border border-blue-500/20 bg-gray-800 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      name="aum"
                      value={formData.aum}
                      onChange={handleChange}
                      placeholder="Firm AUM (Optional)"
                      className="w-full p-3 rounded-lg border border-blue-500/20 bg-gray-800 text-white placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={`w-full p-3 rounded-lg font-semibold transition ${
                        isSubmitting
                          ? "bg-gray-600 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white shadow-lg shadow-blue-500/20"
                      }`}
                    >
                      {isSubmitting ? "Submitting..." : "Apply Now"}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </main>
  );
}