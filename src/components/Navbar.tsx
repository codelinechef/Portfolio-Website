import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { ThemeToggle } from './ThemeToggle';
import { AudioControl } from './AudioControl';
import { VoiceMuteButton } from './VoiceMuteButton';
import { RedZoneTransition } from './RedZoneTransition';
import { useAudio } from '@/contexts/AudioContext';
import { Menu, X, Settings } from 'lucide-react';

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Projects', href: '#projects' },
  { name: 'Resume', href: '#resume' },
  { name: 'Contact', href: '#contact' },
  { name: 'FYI', href: '/fyi', isRoute: true },
];

export const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showTransition, setShowTransition] = useState(false);
  const { scrollY } = useScroll();
  const { playSound, playGlitchEffect } = useAudio();
  
  const blurValue = useTransform(scrollY, [0, 100], [0, 12]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (item: typeof navItems[0]) => {
    if (item.isRoute) {
      playGlitchEffect();
      setShowTransition(true);
    } else {
      playSound('navigation');
    }
  };

  const handleTransitionComplete = () => {
    navigate('/fyi');
    setShowTransition(false);
  };

  return (
    <motion.nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'glass-card py-4' : 'py-6'
      }`}
      style={{ backdropFilter: `blur(${blurValue}px)` }}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <motion.a
            href="#home"
            className="text-2xl font-bold text-primary"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            AS
          </motion.a>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  if (item.isRoute) {
                    e.preventDefault();
                    handleNavClick(item);
                  } else {
                    playSound('navigation');
                  }
                }}
                className="relative text-foreground hover:text-primary transition-colors font-medium"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                {item.name}
                <motion.span
                  className="absolute bottom-0 left-0 w-full h-0.5 bg-primary origin-left"
                  initial={{ scaleX: 0 }}
                  whileHover={{ scaleX: 1 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.a>
            ))}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-3">
            <AudioControl />
            <VoiceMuteButton />
            <ThemeToggle />
            
            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center"
              aria-label="Toggle menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={{ height: isOpen ? 'auto' : 0, opacity: isOpen ? 1 : 0 }}
          className="md:hidden overflow-hidden"
        >
          <div className="flex flex-col gap-4 pt-4 pb-2">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={(e) => {
                  if (item.isRoute) {
                    e.preventDefault();
                    handleNavClick(item);
                  } else {
                    playSound('navigation');
                  }
                  setIsOpen(false);
                }}
                className="text-foreground hover:text-primary transition-colors py-2"
              >
                {item.name}
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Red Zone Transition */}
      <AnimatePresence>
        {showTransition && (
          <RedZoneTransition onComplete={handleTransitionComplete} />
        )}
      </AnimatePresence>
    </motion.nav>
  );
};
