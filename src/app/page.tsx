// app/page.tsx

"use client"

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function HomePage() {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    industry: "",
    role: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, "waitlist"), formData);
      alert("Thanks for joining the waitlist!");
      setFormData({ name: "", email: "", industry: "", role: "" });
      setShowForm(false);
    } catch (err) {
      console.error("Firestore submission failed:", err);
      alert("Something went wrong. Please try again.");
    }
    
  };

  const borderAnimation = {
    hidden: { pathLength: 0 },
    visible: {
      pathLength: 1,
      transition: {
        duration: 1.2,
        ease: "easeInOut"
      }
    }
  };

  return (
    <main className="min-h-screen bg-white text-black font-sans px-6 py-12 sm:px-12 md:px-24 relative overflow-hidden">
      {/* Hero Section */}
      <section className="text-center space-y-8 pt-32 pb-48 relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight">Mano</h1>
        <p className="text-xl md:text-2xl text-gray-700 max-w-xl mx-auto">
          Your Chief of Staff for Capital Deployment.
        </p>

        <div className="relative mx-auto max-w-md w-full">
          {!showForm && (
            <motion.button
              initial={{ opacity: 1 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowForm(true)}
              className="bg-black text-white px-6 py-3 rounded-full font-semibold hover:bg-gray-800 transition relative z-10"
            >
              Get Early Access
            </motion.button>
          )}

          <AnimatePresence>
            {showForm && (
              <motion.svg
                initial="hidden"
                animate="visible"
                viewBox="0 0 550 350"
                className="absolute top-0 left-0 w-full h-full"
              >
                <motion.rect
                  x="1"
                  y="1"
                  width="548"
                  height="348"
                  rx="20"
                  fill="none"
                  stroke="black"
                  strokeWidth="2"
                  variants={borderAnimation}
                />
              </motion.svg>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showForm && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ delay: 1.2 }}
                onSubmit={handleSubmit}
                className="relative z-10 mt-4 w-full space-y-4 px-6 pt-10"
              >
                <input
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
                <input
                  name="email"
                  type="email"
                  placeholder="Your email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
                <select
                  name="industry"
                  value={formData.industry}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                >
                  <option value="">Select your industry</option>
                  <option value="vc">Venture Capital</option>
                  <option value="pe">Private Equity</option>
                  <option value="fo">Family Office</option>
                  <option value="pension">Pension Fund</option>
                  <option value="other">Other</option>
                </select>
                <input
                  name="role"
                  type="text"
                  placeholder="Your role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button
                  type="submit"
                  className="w-full bg-black text-white px-4 py-3 rounded-md font-semibold hover:bg-gray-800 transition"
                >
                  Submit
                </button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* One-liner Power Section */}
      <section className="text-center max-w-3xl mx-auto space-y-8 relative z-10">
        <p className="text-2xl text-gray-600">
          Capital is abundant.
        </p>
        <p className="text-3xl font-semibold">
          Time, focus, and leverage are not.
        </p>
        <p className="text-xl text-gray-600">
          Mano quietly handles the decks, the threads, the chaos.
        </p>
        <p className="text-black font-medium">
          So you can decide—faster, clearer, and earlier.
        </p>
      </section>
    </main>
  );
}
