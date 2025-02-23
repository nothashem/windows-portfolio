'use client'

import { motion } from 'framer-motion'
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa'

export const HomePage = () => {
  const quickLinks = [
    { icon: <FaGithub />, title: 'GitHub', url: 'https://github.com' },
    { icon: <FaLinkedin />, title: 'LinkedIn', url: 'https://linkedin.com' },
    { icon: <FaEnvelope />, title: 'Gmail', url: 'https://gmail.com' },
  ]

  return (
    <div className="w-full h-full bg-[#1a1a1a] text-white overflow-y-auto p-8">
      {/* Search Section */}
      <div className="max-w-2xl mx-auto mt-12 text-center">
        <h1 className="text-4xl font-bold mb-8">Web Browser</h1>
        <div className="relative">
          <input
            type="text"
            placeholder="Search or enter web address"
            className="w-full px-6 py-4 bg-[#2a2a2a] rounded-full
                     text-lg outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Quick Links */}
      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-xl font-semibold mb-6 text-center">Quick Links</h2>
        <div className="grid grid-cols-3 gap-4">
          {quickLinks.map((link, index) => (
            <motion.a
              key={index}
              href={link.url}
              className="flex items-center gap-3 p-4 bg-[#2a2a2a] rounded-lg
                       hover:bg-[#3a3a3a] transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="text-2xl text-blue-400">{link.icon}</div>
              <span className="text-lg">{link.title}</span>
            </motion.a>
          ))}
        </div>
      </div>

      {/* Recently Visited */}
      <div className="max-w-4xl mx-auto mt-12">
        <h2 className="text-xl font-semibold mb-6">Recently Visited</h2>
        <div className="grid grid-cols-2 gap-4">
          {/* Add your recently visited sites here */}
        </div>
      </div>
    </div>
  )
} 