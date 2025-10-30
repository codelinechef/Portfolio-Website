import { motion, AnimatePresence } from 'framer-motion';
import { X, Github, ExternalLink } from 'lucide-react';

interface Project {
  id: number;
  title: string;
  category: string;
  description: string;
  image: string;
  tags: string[];
  github: string;
  live: string;
  featured: boolean;
}

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
}

export const ProjectModal = ({ project, onClose }: ProjectModalProps) => {
  // Allow background page to remain scrollable for seamless experience.
  // Modal itself constrains height and scrolls internally.
  if (!project) return null;

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-background/80 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div
            layoutId={`project-${project.id}`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="relative glass-card rounded-2xl overflow-hidden max-w-4xl w-full max-h-[90vh] flex flex-col"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full glass-card flex items-center justify-center hover:bg-destructive/10 transition-colors"
              aria-label="Close modal"
            >
              <X size={20} />
            </button>

            {/* Image */}
            <div className="relative h-64 md:h-96 flex-shrink-0">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              {project.featured && (
                <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-primary text-primary-foreground font-bold">
                  Featured Project
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto flex-1">
              <div className="text-primary font-semibold mb-2">{project.category}</div>
              <h2 className="text-3xl font-bold mb-4">{project.title}</h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                {project.description}
              </p>

              {/* Extended Description */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">Key Features</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Advanced machine learning algorithms with 95% accuracy</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Real-time processing with sub-100ms latency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Scalable architecture handling 10K+ requests per second</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span>Comprehensive testing with 95% code coverage</span>
                  </li>
                </ul>
              </div>

              {/* Tech Stack */}
              <div className="mb-6">
                <h3 className="text-xl font-bold mb-3">Tech Stack</h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-4 py-2 rounded-full bg-primary/10 text-primary font-medium"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Links */}
              <div className="flex gap-4">
                {project.github && (
                  <motion.a
                    href={project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    referrerPolicy="no-referrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full glass-card hover:bg-primary/10 transition-colors font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Github size={20} />
                    View Code
                  </motion.a>
                )}
                {project.live && (
                  <motion.a
                    href={project.live}
                    target="_blank"
                    rel="noopener noreferrer"
                    referrerPolicy="no-referrer"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground hover:shadow-lg transition-shadow font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <ExternalLink size={20} />
                    Live Demo
                  </motion.a>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
