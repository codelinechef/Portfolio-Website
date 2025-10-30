# Portfolio Features & Setup

## 🎨 New Features

### Theme System
- **Dark Theme**: Neon cyberpunk aesthetic with blue/purple/cyan accents
- **Light Theme**: Soft pink gradient with warm, accessible colors
- **Auto-detection**: Follows system preference by default
- **Persistence**: User choice saved to localStorage
- **Toggle**: Beautiful animated theme switcher in navbar

### 3D Elements
- **Hero Sphere**: Shader-driven 3D sphere with mouse interaction
- **Parallax Background**: 2000+ particles responding to theme
- **Floating Shapes**: Low-poly geometric shapes with depth layering
- **Performance**: Optimized with reduced DPR and lazy loading

### Interactive Features
- **Draggable Figures**: Mini icons that can be placed anywhere
  - Add/remove figures with toolbar
  - Lock/unlock placement
  - Positions persist to localStorage
  - Double-click to remove individual figures
- **Smooth Scroll**: Lenis-powered inertia scrolling
- **Magnetic CTAs**: Buttons with spring animations
- **Project Modal**: Animated modal with layoutId transitions

### Content Sections
- **Hero**: 3D sphere, animated text, scroll indicator
- **About**: Skill cards with hover effects
- **Projects**: Category filters, modal previews, featured badges
- **Resume**: Experience, education, certifications with download
- **Contact**: Form validation (Zod), copy email, social links

### Accessibility
- **Keyboard Navigation**: Full keyboard support
- **Reduced Motion**: Respects prefers-reduced-motion
- **ARIA Labels**: Proper semantic HTML and ARIA
- **Color Contrast**: 4.5:1 minimum for text
- **Focus Indicators**: Clear focus outlines

### Performance Optimizations
- Lazy-loaded 3D components with Suspense
- Dynamic DPR clamping for low-end devices
- Tree-shaken imports
- Optimized particle counts
- Efficient re-renders with React.memo where needed

## 🚀 Quick Start

\`\`\`bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
\`\`\`

## 🎯 Configuration

### Theme Customization
Edit `src/index.css` to customize colors:
- Light theme: Lines 10-52
- Dark theme: Lines 54-97

### Draggable Figures
- Data stored in `localStorage` key: `draggable-figures`
- Clear storage to reset: `localStorage.removeItem('draggable-figures')`

### Content Updates
- **Projects**: Edit `src/components/Projects.tsx` (line 7+)
- **Resume**: Edit `src/components/Resume.tsx` (line 5+)
- **Contact**: Update email in `src/components/Contact.tsx` (line 20)

## 📱 Responsive Design
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🔧 Tech Stack
- **React 18** + **TypeScript**
- **Vite** for blazing fast builds
- **Tailwind CSS** for utility-first styling
- **Three.js** + **React Three Fiber** for 3D
- **Framer Motion** for animations
- **Lenis** for smooth scrolling
- **Zod** + **React Hook Form** for forms
- **React Helmet Async** for SEO

## 🌐 Deployment
Built with GitHub Pages support. The app works with any static hosting:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

## 🎨 Design Tokens

### Light Theme Colors
- Background: `#fff5f8` → `#ffd6e7` (soft pink gradient)
- Primary: `#ff6fa3` (accent pink)
- Text: High contrast dark gray

### Dark Theme Colors
- Background: `#0a0b12` → `#12141f` (deep blue-black)
- Primary: `#60a5fa` (neon blue)
- Accent: `#c084fc` (neon purple)
- Secondary: `#22d3ee` (neon cyan)

## 📊 Performance Targets
- Lighthouse Performance: 90+
- Lighthouse Accessibility: 95+
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s

## 🔐 Accessibility Checklist
- ✅ Semantic HTML
- ✅ ARIA labels on interactive elements
- ✅ Keyboard navigation
- ✅ Focus indicators
- ✅ Color contrast 4.5:1+
- ✅ Reduced motion support
- ✅ Screen reader tested

## 💡 Optional Upgrades
- **PWA**: Add manifest.json and service worker
- **Analytics**: Google Analytics or Plausible
- **AI Chat Widget**: Integrate chatbot for visitor engagement
- **Blog Section**: Add MDX blog with CMS
- **Case Studies**: Detailed project breakdowns
- **Testimonials**: Client feedback carousel
- **Multi-language**: i18n support

## 📝 Notes
- Resume PDF parsing failed - update content manually in Resume.tsx
- 3D elements automatically disable on low-GPU devices
- All animations respect system preferences
- localStorage used for theme and figure persistence
