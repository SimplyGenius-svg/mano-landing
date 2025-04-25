"use client"

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

// Animation variants
const animations = {
  fadeIn: {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.8,
        ease: "easeOut"
      }
    }
  },
  staggerContainer: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  }
};

// Testimonial data
const TESTIMONIALS = [
  { quote: "Mano has transformed how we evaluate opportunities. We're closing deals 40% faster.", author: "Partner, Tier 1 VC" },
  { quote: "Our team's bandwidth has effectively doubled with Mano's assistance.", author: "Managing Director, PE" },
  { quote: "The insights Mano surfaces have helped us avoid at least two potentially costly investments.", author: "Family Office Principal" }
];

// Form initial state
const INITIAL_FORM_STATE = {
  name: "",
  email: "",
  industry: "",
  role: "",
  organization: ""
};

export default function HomePage() {
  const [showForm, setShowForm] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await addDoc(collection(db, "waitlist"), {
        ...formData,
        timestamp: serverTimestamp() // Using server timestamp for more accuracy
      });
      setFormSubmitted(true);
      
      // Reset form and close modal after delay
      setTimeout(() => {
        setFormSubmitted(false);
        setFormData(INITIAL_FORM_STATE);
        setShowForm(false);
        setIsSubmitting(false);
      }, 3000);
    } catch (err) {
      console.error("Firestore submission failed:", err);
      alert("Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  // Rotate testimonials automatically
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % TESTIMONIALS.length);
    }, 8000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <main className="min-h-screen bg-white text-black font-sans relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-full h-full overflow-hidden z-0 opacity-5">
        <svg viewBox="0 0 1000 1000" className="absolute top-0 right-0 w-full">
          <circle cx="750" cy="250" r="400" fill="black" />
          <circle cx="250" cy="750" r="300" fill="black" />
        </svg>
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm py-5 px-6 sm:px-12 md:px-24 flex justify-between items-center">
        <div className="font-bold text-2xl tracking-tight">Mano</div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-black text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-800 transition"
        >
          Get Early Access
        </button>
      </nav>

      {/* Hero Section */}
      <section className="px-6 pt-40 pb-24 sm:px-12 md:px-24 md:pt-48 relative z-10">
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={animations.staggerContainer}
          className="max-w-5xl mx-auto"
        >
          <motion.h1 
            variants={animations.fadeIn} 
            className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6"
          >
            Capital<span className="text-gray-300">.</span> Clarity<span className="text-gray-300">.</span> Confidence<span className="text-gray-300">.</span>
          </motion.h1>

          
          
          <motion.div variants={animations.fadeIn} className="max-w-3xl">
            <p className="text-xl md:text-2xl text-gray-700 mb-10">
              Your AI-powered Chief of Staff for streamlined capital deployment.
              Sift through the noise. Surface signal. Make decisions that matter.
            </p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
              {!showForm && (
                <motion.button
                  onClick={() => setShowForm(true)}
                  className="bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-gray-800 transition tracking-wide"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Request Access
                </motion.button>
              )}
              <motion.a
                href="#how-it-works"
                className="px-8 py-4 rounded-full border-2 border-black font-semibold hover:bg-black hover:text-white transition text-center tracking-wide"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                Learn More
              </motion.a>
            </div>
          </motion.div>
        </motion.div>
      </section>
      <motion.img 
  src="/main.png"
  alt="Hero Visual"
  initial={{ opacity: 0, y: 40, scale: 0.98, filter: "blur(8px)" }}
  animate={{ 
    opacity: 1, 
    y: 0, 
    scale: 1,
    filter: "blur(0px)",
    transition: {
      duration: 1.2,
      ease: "easeOut"
    }
  }}
  className="w-full max-w-4xl mx-auto rounded-xl shadow-2xl ring-4 ring-white/10 backdrop-blur-sm"

/>


      



      

      {/* Rotating Testimonials */}
      <section className="bg-gray-50 py-16 px-6 sm:px-12 md:px-24 relative z-10">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTestimonial}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="text-2xl md:text-3xl italic mb-6">&quot;{TESTIMONIALS[currentTestimonial].quote}&quot;</p>
              <p className="text-gray-600 font-medium">— {TESTIMONIALS[currentTestimonial].author}</p>
            </motion.div>
          </AnimatePresence>
          
          <div className="flex justify-center mt-8 space-x-2">
            {TESTIMONIALS.map((_, index) => (
              <button 
                key={index}
                onClick={() => setCurrentTestimonial(index)}
                className={`w-3 h-3 rounded-full ${index === currentTestimonial ? 'bg-black' : 'bg-gray-300'}`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section id="how-it-works" className="py-24 px-6 sm:px-12 md:px-24 relative z-10">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={animations.staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 gap-16"
          >
            <motion.div variants={animations.fadeIn} className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Capital is abundant.</h2>
              <p className="text-xl text-gray-700">Time, focus, and leverage are not.</p>
              <p className="text-gray-600">
                In a world drowning in information but starving for insight, Mano stands as your exclusive filter—identifying patterns, surfacing opportunities, and handling the administrative chaos that distracts from decision-making.
              </p>
            </motion.div>
            
            <motion.div variants={animations.fadeIn} className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Decide faster. Earlier. Better.</h2>
              <p className="text-xl text-gray-700">While others are still reviewing decks.</p>
              <p className="text-gray-600">
                Mano processes thousands of signals to identify the opportunities that match your investment thesis, monitors portfolio performance, and automates follow-ups—giving you back the hours in your day for high-value relationship building.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-24 px-6 sm:px-12 md:px-24 relative z-10">
        <div className="max-w-5xl mx-auto space-y-16">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">How Mano Works For You</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">
              Your artificial intelligence-powered chief of staff that handles the mundane so you can focus on what matters.
            </p>
          </div>
          
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={animations.staggerContainer}
            className="grid grid-cols-1 md:grid-cols-3 gap-12"
          >
            {[
              {
                title: "Deal Flow Management",
                description: "Analyze incoming pitches, categorize opportunities, and prioritize based on your investment criteria—all within seconds."
              },
              {
                title: "Market Intelligence",
                description: "Stay ahead with real-time market insights, competitive analysis, and trend identification customized to your portfolio."
              },
              {
                title: "Portfolio Monitoring",
                description: "Track performance metrics, identify early warning signals, and get actionable recommendations for your investments."
              }
            ].map((feature, index) => (
              <motion.div key={index} variants={animations.fadeIn} className="space-y-4">
                <div className="bg-black text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-semibold mb-4">
                  {index + 1}
                </div>
                <h3 className="text-2xl font-semibold">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Early Access CTA */}
      <section className="py-24 px-6 sm:px-12 md:px-24 relative z-10 bg-black text-white text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-5xl font-bold">Gain the Mano advantage</h2>
          <p className="text-xl opacity-90">
            Currently in beta with select partners. Limited spots available for our next cohort.
          </p>
          
          {!showForm && (
            <motion.button
              onClick={() => setShowForm(true)}
              className="bg-white text-black px-8 py-4 rounded-full font-semibold hover:bg-gray-200 transition inline-block"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Request Beta Access
            </motion.button>
          )}
        </div>
      </section>

      {/* Access Form Modal */}
      <AnimatePresence>
        {showForm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 px-6"
            onClick={(e) => {
              // Close modal when clicking outside the form
              if (e.target === e.currentTarget) setShowForm(false);
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-8 max-w-md w-full relative"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-black"
                aria-label="Close form"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
              
              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">Request Early Access</h3>
                <p className="text-gray-600">Join our exclusive beta program</p>
              </div>
              
              {formSubmitted ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600">
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                  <h4 className="text-xl font-semibold mb-2">Thank you!</h4>
                  <p className="text-gray-600">We have received your request. Our team will be in touch shortly.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <FormField
                    id="name"
                    label="Full Name"
                    type="text"
                    placeholder="Jane Smith"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  
                  <FormField
                    id="email"
                    label="Work Email"
                    type="email"
                    placeholder="jane@company.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  
                  <FormField
                    id="organization"
                    label="Organization"
                    type="text"
                    placeholder="Acme Capital"
                    value={formData.organization}
                    onChange={handleChange}
                    required
                  />
                  
                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-1">Industry</label>
                    <select
                      id="industry"
                      name="industry"
                      required
                      value={formData.industry}
                      onChange={handleChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    >
                      <option value="">Select your industry</option>
                      <option value="vc">Venture Capital</option>
                      <option value="pe">Private Equity</option>
                      <option value="fo">Family Office</option>
                      <option value="pension">Pension Fund</option>
                      <option value="endowment">Endowment</option>
                      <option value="sovereign">Sovereign Wealth Fund</option>
                      <option value="asset">Asset Management</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  
                  <FormField
                    id="role"
                    label="Your Role"
                    type="text"
                    placeholder="Partner, Associate, etc."
                    value={formData.role}
                    onChange={handleChange}
                    required
                  />
                  
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-black text-white px-4 py-3 rounded-md font-semibold hover:bg-gray-800 transition mt-4 ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                  
                  <p className="text-xs text-gray-500 text-center mt-4">
                    By submitting, you agree to our Terms of Service and Privacy Policy.
                  </p>
                </form> 
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="py-12 px-6 sm:px-12 md:px-24 text-center">
        <div className="font-bold text-xl mb-4">Mano</div>
        <p className="text-gray-600 mb-6">© {new Date().getFullYear()} Mano AI. All rights reserved.</p>
        <div className="flex justify-center space-x-6">
          <a href="#" className="text-gray-600 hover:text-black">Privacy</a>
          <a href="#" className="text-gray-600 hover:text-black">Terms</a>
          <a href="mailto:info@mano.ai" className="text-gray-600 hover:text-black">Contact</a>
        </div>
      </footer>
    </main>
  );
}

// Reusable form field component
type FormFieldProps = {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
};

const FormField = ({ id, label, type, placeholder, value, onChange, required = false }: FormFieldProps) => (
  <div>
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      id={id}
      name={id}
      type={type}
      required={required}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
    />
  </div>
);