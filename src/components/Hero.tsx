import React from 'react';
import { useTheme } from '@/contexts/ThemeContext';

export const Hero = () => {
  const { theme } = useTheme();

  return (
    <section className="relative min-h-screen flex items-center justify-center">
      <div className="container mx-auto px-4 z-10 relative">
        <div className="text-center">
          <div className="mb-4">
            <h2 
              className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-neon-cyan via-primary to-neon-pink bg-clip-text text-transparent"
              style={{ fontFamily: '"Orbitron", sans-serif' }}
            >
              CodeLineChef
            </h2>
          </div>
          <h1
            className={`text-6xl md:text-8xl font-bold mb-6 ${
              theme === 'dark' ? 'neon-glow' : 'neon-glow-pink'
            }`}
          >
            Anant Sharma
          </h1>
          <p className="text-2xl md:text-3xl mb-4 text-muted-foreground">
            Software Developer with specialization in AI and Machine Learning
          </p>
          <div className="flex gap-3 justify-center flex-wrap mb-8">
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              #SoftwareDeveloper
            </span>
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              #AIEngineer
            </span>
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              #AIML
            </span>
          </div>
          <div className="flex gap-4 justify-center flex-wrap">
            <a
              href="#projects"
              className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold hover:shadow-lg transition-shadow"
            >
              View Projects
            </a>
            <a
              href="#contact"
              className="px-8 py-4 rounded-full glass-card font-semibold hover:shadow-lg transition-shadow"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
