import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Resume } from "@/components/Resume";
import { Contact } from "@/components/Contact";
import { FloatingShapes } from "@/components/FloatingShapes";
import { DraggableFigures } from "@/components/DraggableFigure";
import { SEO } from "@/components/SEO";
import { AccessibilityControls } from "@/components/AccessibilityControls";
import { AudioEqualizer } from "@/components/AudioEqualizer";

const Index = () => {
  return (
    <>
      <SEO />
      <Navbar />
      <FloatingShapes />
      <DraggableFigures />
      <AccessibilityControls />
      <AudioEqualizer />
      <main id="home">
        <Hero />
        <About />
        <Projects />
        <Resume />
        <Contact />
      </main>
      <footer className="py-8 text-center text-muted-foreground border-t border-border">
        <p>© 2025 Anant Sharma. Crafted with passion and code.</p>
      </footer>
    </>
  );
};

export default Index;
