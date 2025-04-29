"use client"

import React, { useState, useEffect, useRef } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

// Form initial state
const INITIAL_FORM_STATE = {
  name: "",
  email: "",
  organization: ""
};

// Stats with striking numbers
const STATS = [
  { value: "93%", label: "Faster Analysis" },
  { value: "82%", label: "More Accurate" },
  { value: "3.7×", label: "ROI Improvement" }
];

export default function HomePage() {
  // State management
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [activeSection, setActiveSection] = useState(0);
  
  
  // Refs for scroll animations
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const featureRef = useRef(null);
  const ctaRef = useRef(null);
  
  // Parallax scroll effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start", "end"]
  });
  
  const yCircle = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '25%']);
  
  // Initialize cursor effect
  useEffect(() => {
    const handleMouseMove = (e: { clientX: number; clientY: number; }) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  // Set mouse enter delay effect
  useEffect(() => {
    const timer = setTimeout(() => {
      setMouseEnterDelay();
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle form input changes
  const handleChange = (e: { target: { name: string; value: string; }; }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  // Form submission
  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setFormSubmitted(true);
      
      // Reset form and close modal after delay
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData(INITIAL_FORM_STATE);
        setShowForm(false);
        setIsSubmitting(false);
      }, 3000);
    }, 1000);
  };

  return (
    <main ref={containerRef} className="font-sans text-zinc-900 bg-white overflow-hidden">
      {/* Custom Cursor */}
      <motion.div 
        className="fixed w-12 h-12 rounded-full border-2 border-blue-600 pointer-events-none z-50 mix-blend-difference hidden md:block"
        style={{
          left: `${cursorPosition.x}px`,
          top: `${cursorPosition.y}px`,
          transform: 'translate(-50%, -50%)'
        }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.8, 1]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Bold navigation */}
      <nav className="fixed top-0 left-0 right-0 z-40 py-8 px-8 md:px-16 flex justify-between items-center backdrop-blur-sm bg-white/80">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-2xl font-bold tracking-tight flex items-center"
        >
          <span className="text-zinc-900">mano</span>
          <span className="text-blue-600">.</span>
        </motion.div>
        
        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          onClick={() => setShowForm(true)}
          className="text-sm px-8 py-3 border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors duration-300 font-medium tracking-wider uppercase"
        >
          Get Access
        </motion.button>
      </nav>

      {/* Dynamic Hero Section */}
      <section ref={heroRef} className="min-h-screen pt-32 md:pt-0 flex flex-col justify-center relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-blue-50 to-transparent"></div>
          <motion.div 
            style={{ y: backgroundY }}
            className="absolute -bottom-1/2 -right-1/4 w-3/4 h-3/4 bg-gradient-to-tl from-blue-50 via-blue-100 to-transparent rounded-full opacity-50 blur-xl"
          ></motion.div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-8 md:px-16 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left column with powerful headline */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="mb-6"
            >
              <span className="bg-blue-100 text-blue-600 px-4 py-1 text-sm font-medium tracking-wider">
                INVESTMENT INTELLIGENCE
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-6xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8"
            >
              Decision<br />
              <span className="text-blue-600">Accelerated.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="text-lg text-zinc-600 mb-12 max-w-lg"
            >
              Mano is the AI Chief of Staff for capital allocators.
              Streamline dealflow, diligence, and portfolio ops—without the overhead.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex items-center space-x-6"
            >
              <button
                onClick={() => setShowForm(true)}
                className="px-10 py-4 bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300 font-medium tracking-wider uppercase shadow-lg shadow-blue-200"
              >
                Get VIP Access
              </button>
              
              <a 
                href="#features" 
                className="text-zinc-900 font-medium flex items-center group"
                onClick={(e) => {
                  e.preventDefault();
                  const featuresElement = document.getElementById('features');
                  if (featuresElement) {
                    featuresElement.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                <span>Explore</span>
                <span className="ml-2 transform group-hover:translate-x-1 transition-transform duration-300">→</span>
              </a>
            </motion.div>
          </div>
          
          {/* Right column with dynamic visual */}
          <div className="relative flex justify-center">
            <motion.div 
              style={{ y: yCircle, scale }}
              className="relative"
            >
              {/* Animated graph nodes */}
              <div className="relative w-96 h-96">
                {/* Center circle */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <motion.div 
                    className="w-32 h-32 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xl"
                    animate={{
                      boxShadow: [
                        "0 0 0 0 rgba(37, 99, 235, 0.4)",
                        "0 0 0 20px rgba(37, 99, 235, 0)",
                        "0 0 0 0 rgba(37, 99, 235, 0)"
                      ]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  >
                    mano
                  </motion.div>
                </div>
                
                {/* Circular elements */}
                <motion.div 
                  className="absolute inset-0 border-2 border-blue-200 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 150, repeat: Infinity, ease: "linear" }}
                ></motion.div>
                
                <motion.div 
                  className="absolute inset-12 border-2 border-blue-200 rounded-full"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 120, repeat: Infinity, ease: "linear" }}
                ></motion.div>
                
                <motion.div 
                  className="absolute inset-24 border-2 border-blue-200 rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
                ></motion.div>
                
                {/* Animated nodes */}
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute w-4 h-4 bg-blue-600 rounded-full"
                    style={{
                      top: `${50 + 42 * Math.sin((i / 4) * Math.PI)}%`,
                      left: `${50 + 42 * Math.cos((i / 4) * Math.PI)}%`,
                    }}
                    animate={{
                      scale: [1, 1.5, 1],
                      opacity: [0.6, 1, 0.6]
                    }}
                    transition={{
                      duration: 3,
                      delay: i * 0.4,
                      repeat: Infinity,
                      repeatType: "reverse"
                    }}
                  ></motion.div>
                ))}
                
                {/* Connection lines - using SVG */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400">
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
                    <motion.line
                      key={i}
                      x1="200"
                      y1="200"
                      x2={200 + 168 * Math.cos((i / 4) * Math.PI)}
                      y2={200 + 168 * Math.sin((i / 4) * Math.PI)}
                      stroke="rgba(37, 99, 235, 0.3)"
                      strokeWidth="1"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ 
                        duration: 1.5, 
                        delay: i * 0.2,
                        repeat: Infinity,
                        repeatType: "loop",
                        repeatDelay: 5
                      }}
                    />
                  ))}
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
        
        {/* Performance metrics strip */}
        <div className="absolute bottom-0 left-0 right-0 bg-zinc-900 py-8 px-8 md:px-16">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {STATS.map((stat, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="text-zinc-400 uppercase tracking-wider text-sm">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Bold Feature Section */}
      <section id="features" ref={featureRef} className="py-32 px-8 md:px-16 relative">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-50 to-transparent"></div>
        </div>
        
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-6xl font-bold mb-6"
            >
              Weaponized <span className="text-blue-600">Intelligence</span>
            </motion.h2>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: "120px" }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.2 }}
              className="h-1 bg-blue-600 mx-auto mb-8"
            ></motion.div>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-xl text-zinc-600 max-w-3xl mx-auto"
            >
              Our platform combines complex algorithms with intuitive design
              to deliver intelligence that outperforms human analysis.
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
            {/* Feature Image */}
            <div className="relative">
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="relative z-10"
              >
                <img 
                  src="/main.png" 
                  alt="Mano Dashboard" 
                  className="w-full rounded-xl shadow-2xl border-2 border-zinc-100"
                />
              </motion.div>
              
              {/* Decorative elements */}
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-blue-100 rounded-full filter blur-3xl opacity-50 -z-10"></div>
              <div className="absolute -top-24 -right-24 w-40 h-40 border-8 border-blue-200 rounded-full -z-10"></div>
            </div>
            
            {/* Feature Details */}
            <div>
              <div className="space-y-12">
                {[
                  {
                    number: "01",
                    title: "Quantum Pattern Recognition",
                    description: "Identify investment patterns invisible to human analysts through our proprietary neural network trained on 200,000+ successful investments."
                  },
                  {
                    number: "02",
                    title: "Pre-cognitive Risk Detection",
                    description: "Anticipate catastrophic failure points before they emerge with 94.6% accuracy based on multi-dimensional risk analysis."
                  },
                  {
                    number: "03",
                    title: "Decision Acceleration",
                    description: "Cut investment decision cycles by 78% while simultaneously increasing decision confidence by 64%."
                  }
                ].map((feature, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.2 * index }}
                    className="group"
                  >
                    <div className="flex items-start">
                      <div className="text-5xl font-bold text-blue-100 group-hover:text-blue-200 transition-colors duration-300">
                        {feature.number}
                      </div>
                      <div className="ml-6">
                        <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-600 transition-colors duration-300">
                          {feature.title}
                        </h3>
                        <motion.div 
                          initial={{ width: 0 }}
                          whileInView={{ width: "60px" }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.6, delay: 0.4 + 0.2 * index }}
                          className="h-1 bg-blue-600 mb-4"
                        ></motion.div>
                        <p className="text-zinc-600">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Demonstration Section */}
      <section className="py-32 px-8 md:px-16 bg-zinc-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="text-5xl font-bold mb-6"
              >
                Intelligence in <span className="text-blue-400">Action</span>
              </motion.h2>
              
              <motion.div 
                initial={{ width: 0 }}
                whileInView={{ width: "120px" }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.2 }}
                className="h-1 bg-blue-400 mb-8"
              ></motion.div>
              
              <motion.p 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="text-xl text-zinc-300 mb-12"
              >
                Watch how Mano processes complex investment data in real-time, identifying opportunities
                and risks invisible to human analysts.
              </motion.p>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex flex-wrap gap-6"
              >
                {["Pattern Detection", "Risk Analysis", "Opportunity Scoring"].map((tab, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveSection(index)}
                    className={`px-6 py-3 border-2 transition-colors duration-300 ${
                      activeSection === index 
                        ? "border-blue-400 bg-blue-400/10 text-white" 
                        : "border-zinc-700 text-zinc-400 hover:border-zinc-500"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.5 }}
                className="mt-12"
              >
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowForm(true)}
                  className="px-10 py-4 bg-blue-600 text-white hover:bg-blue-500 transition-colors duration-300 font-medium tracking-wider uppercase shadow-lg shadow-blue-900/50 flex items-center"
                >
                  <span>Request Demo</span>
                  <svg className="ml-2 w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </motion.button>
              </motion.div>
            </div>
            
            <div className="relative min-h-[500px] flex items-center justify-center">
              {/* Interactive visualization */}
              <div className="relative w-full h-full">
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="relative z-10 bg-zinc-800 border border-zinc-700 rounded-xl p-8 h-full"
                >
                  <div className="h-64 mb-6 bg-zinc-900 rounded-lg overflow-hidden relative">
                    {/* Pattern Detection Graph */}
                    {activeSection === 0 && (
                      <svg className="w-full h-full" viewBox="0 0 400 200">
                        <motion.path 
                          d="M0,150 C50,120 100,170 150,120 C200,70 250,180 300,100 C350,20 400,80 400,60" 
                          fill="none" 
                          stroke="#3b82f6" 
                          strokeWidth="3"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, delay: 0.5 }}
                        />
                        
                        <motion.path 
                          d="M0,180 C50,160 100,140 150,160 C200,180 250,100 300,140 C350,180 400,120 400,140" 
                          fill="none" 
                          stroke="#60a5fa" 
                          strokeWidth="2"
                          strokeDasharray="5,5"
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 2, delay: 0.8 }}
                        />
                        
                        {/* Highlight points */}
                        <motion.circle 
                          cx="150" cy="120" r="6" 
                          fill="#3b82f6"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, delay: 1.5 }}
                        />
                        
                        <motion.circle 
                          cx="300" cy="100" r="6" 
                          fill="#3b82f6"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.5, delay: 1.7 }}
                        />
                      </svg>
                    )}
                    
                    {/* Risk Analysis Visualization */}
                    {activeSection === 1 && (
                      <svg className="w-full h-full" viewBox="0 0 400 200">
                        <defs>
                          <linearGradient id="riskGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                            <stop offset="50%" stopColor="#eab308" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="#22c55e" stopOpacity="0.4" />
                          </linearGradient>
                        </defs>
                        
                        {/* Risk heatmap */}
                        <motion.rect 
                          x="50" y="30" width="300" height="140" 
                          fill="url(#riskGradient)"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 1, delay: 0.5 }}
                        />
                        
                        {/* Risk markers */}
                        {[
                          { x: 100, y: 50, r: 8, color: "#ef4444" },
                          { x: 180, y: 100, r: 6, color: "#eab308" },
                          { x: 250, y: 150, r: 10, color: "#22c55e" },
                          { x: 320, y: 60, r: 7, color: "#ef4444" }
                        ].map((marker, i) => (
                          <motion.circle
                            key={i}
                            cx={marker.x}
                            cy={marker.y}
                            r={marker.r}
                            fill={marker.color}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.4, delay: 0.8 + i * 0.2 }}
                          />
                        ))}
                      </svg>
                    )}
                    
                    {/* Opportunity Scoring */}
                    {activeSection === 2 && (
                      <svg className="w-full h-full" viewBox="0 0 400 200">
                        {[
                          { x: 50, height: 80 },
                          { x: 100, height: 120 },
                          { x: 150, height: 60 },
                          { x: 200, height: 180 },
                          { x: 250, height: 90 },
                          { x: 300, height: 140 }
                        ].map((bar, i) => (
                          <motion.rect
                            key={i}
                            x={bar.x}
                            y={200 - bar.height}
                            width="30"
                            height={bar.height}
                            fill={bar.height > 130 ? "#3b82f6" : "#94a3b8"}
                            initial={{ height: 0, y: 200 }}
                            animate={{ height: bar.height, y: 200 - bar.height }}
                            transition={{ duration: 1, delay: 0.3 + i * 0.1 }}
                          />
                        ))}
                        
                        {/* Highlight the best opportunity */}
                        <motion.rect
                          x={195}
                          y={15}
                          width="40"
                          height="40"
                          fill="none"
                          stroke="#3b82f6"
                          strokeWidth="2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 1.5 }}
                        />
                        
                        <motion.text
                          x="200"
                          y="40"
                          fontSize="12"
                          fill="#ffffff"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.5, delay: 1.7 }}
                        >
                          94%
                        </motion.text>
                      </svg>
                    )}
                  </div>
                  
                  {/* Data points below chart */}
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Confidence", value: "92%" },
                      { label: "Data Points", value: "127.8K" },
                      { label: "Time", value: "1.2s" }
                    ].map((data, i) => (
                      <motion.div 
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1 + i * 0.1 }}
                        className="bg-zinc-800 p-4 border border-zinc-700 rounded-lg"
                      >
                        <div className="text-sm text-zinc-500 mb-1">{data.label}</div>
                        <div className="text-xl font-bold text-white">{data.value}</div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                
                {/* Background elements */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-900/20 rounded-full filter blur-3xl -z-10"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 border-2 border-blue-800/30 rounded-full -z-10"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Powerful CTA Section */}
      <section ref={ctaRef} className="py-32 px-8 md:px-16 relative overflow-hidden">
        {/* Background gradient elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-gradient-to-b from-blue-50 to-transparent"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-gradient-to-t from-blue-50 to-transparent"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center relative">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-bold mb-8"
          >
            Gain Your Unfair <span className="text-blue-600">Advantage</span>
          </motion.h2>
          
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: "160px" }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.2 }}
            className="h-1 bg-blue-600 mx-auto mb-10"
          ></motion.div>
          
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="text-xl text-zinc-600 mb-12 max-w-3xl mx-auto"
          >
            Join elite investment professionals already using Mano to identify opportunities
            others miss and make decisions with extraordinary confidence.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowForm(true)}
              className="px-12 py-6 bg-blue-600 text-white text-lg hover:bg-blue-700 transition-colors duration-300 font-medium tracking-wider uppercase shadow-xl shadow-blue-300/20 group"
            >
              <span>Request Exclusive Access</span>
              <svg className="inline-block ml-2 w-6 h-6 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </motion.button>
            
            <div className="mt-8 text-zinc-500 text-sm">
              Limited to 50 firms this quarter
            </div>
          </motion.div>
        </div>
      </section>

      {/* Modern Footer */}
      <footer className="py-16 px-8 md:px-16 bg-zinc-900 text-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="text-2xl font-bold tracking-tight flex items-center mb-6">
              <span className="text-white">mano</span>
              <span className="text-blue-400">.</span>
            </div>
            <p className="text-zinc-400 mb-6">
              Investment intelligence for elite professionals.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-zinc-400 hover:text-white transition-colors">
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6">Platform</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Features</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Resources</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Roadmap</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-bold mb-6">Company</h3>
            <ul className="space-y-4">
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">About</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Careers</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Contact</a></li>
              <li><a href="#" className="text-zinc-400 hover:text-white transition-colors">Privacy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto border-t border-zinc-800 mt-16 pt-8 text-zinc-500 text-sm">
          © 2025 Mano Technologies, Inc. All rights reserved.
        </div>
      </footer>

      {/* High-impact Access Request Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-zinc-900/90 backdrop-blur-md flex items-center justify-center z-50 px-6"
            onClick={(e) => {
              if (e.target === e.currentTarget) setShowForm(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-lg max-w-md w-full relative overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close button */}
              <button 
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-zinc-500 hover:text-zinc-700 transition-colors z-10"
                aria-label="Close form"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              
              {/* Decorative element */}
              <div className="h-2 bg-blue-600 w-full absolute top-0 left-0"></div>
              
              {/* Modal content */}
              <div className="p-10">
                {formSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center py-8"
                  >
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <h4 className="text-2xl font-bold text-zinc-900 mb-4">Request Submitted</h4>
                    <p className="text-zinc-600">
                      Thank you for your interest in Mano. Our team will review your application and contact you shortly.
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <div className="text-center mb-8">
                      <h3 className="text-3xl font-bold text-zinc-900 mb-2">Request VIP Access</h3>
                      <p className="text-zinc-600">Join elite firms gaining an unfair advantage with Mano.</p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-zinc-700 mb-1">Full Name</label>
                        <input
                          id="name"
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full p-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-zinc-700 mb-1">Work Email</label>
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full p-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="organization" className="block text-sm font-medium text-zinc-700 mb-1">Organization</label>
                        <input
                          id="organization"
                          type="text"
                          name="organization"
                          value={formData.organization}
                          onChange={handleChange}
                          required
                          className="w-full p-3 border border-zinc-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full p-4 rounded-lg font-medium tracking-wider uppercase transition-colors duration-300 ${
                          isSubmitting
                            ? "bg-zinc-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 text-white"
                        }`}
                      >
                        {isSubmitting ? "Processing..." : "Submit Request"}
                      </button>
                      
                      <div className="text-center text-zinc-500 text-sm">
                        By submitting, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.
                      </div>
                    </form>
                  </>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

function setMouseEnterDelay() {
  // Implement the function or remove it if not needed
  console.log("Mouse enter delay set.");
}
