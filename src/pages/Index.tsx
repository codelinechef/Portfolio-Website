import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Projects } from "@/components/Projects";
import { Resume } from "@/components/Resume";
import { Contact } from "@/components/Contact";
import { SEO } from "@/components/SEO";
import { AccessibilityControls } from "@/components/AccessibilityControls";

const Index = () => {
  return (
    <>
      <SEO />
      <Navbar />
      <AccessibilityControls />
      <main id="home">
        <Hero />
        <About />
        <Projects />
        <Resume />
        <Contact />
        {/* Spacer to ensure last content is fully visible and extra scroll room */}
        <div className="h-24 md:h-40" aria-hidden="true" />
      </main>
      <footer className="py-8 text-center text-muted-foreground border-t border-border">
        <p>© 2025 Anant Sharma. Crafted with passion and code.</p>
      </footer>
    </>
  );
};

export default Index;
