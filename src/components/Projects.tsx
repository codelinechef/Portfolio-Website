import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { ProjectModal } from './ProjectModal';
import { useAudio } from '@/contexts/AudioContext';
import { trackProjectView } from '@/utils/analytics';

const categories = ['All', 'AI/ML', 'Backend', 'Computer Vision', 'Data Science'];

const projects = [
  {
    id: 1,
    title: 'NSC Awards - Internship',
    category: 'Backend',
    description: 'Django-based workflow system processing 500+ company submissions with automated reporting',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?w=800&h=600&fit=crop',
    tags: ['Django', 'Django Rest Frameworks', 'Restful APIs', 'ORM', 'DRF', 'MySql', 'ReportLab', 'Graph API', 'SMTP'],
    github: '',
    live: 'https://award.nsc.org.in/',
    featured: true,
  },
  {
    id: 2,
    title: 'DeepWeave',
    category: 'AI/ML',
    description: 'DeepAgents-based research agent with planning, filesystem, and subagent orchestration',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
    tags: ['LangGraph', 'Agent Middleware', 'LLM APIs', 'Python'],
    github: 'https://github.com/codelinechef/DeepWeave',
    live: '',
    featured: true,
  },
  {
    id: 3,
    title: 'RemembrAI',
    category: 'AI/ML',
    description: 'ReAct-style memory agent with persistent user preferences and semantic search',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=600&fit=crop',
    tags: ['LangGraph', 'LangChain', 'Vector Embeddings', 'LangSmith'],
    github: 'https://github.com/codelinechef/Remember-AI',
    live: '',
    featured: true,
  },
  {
    id: 4,
    title: 'AI Query Chatbot',
    category: 'AI/ML',
    description: 'This project combines web scraping, vector databases, and Large Language Models specifically Google Gemini to deliver context-aware answers directly from official API docs.',
    image: 'https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=600&fit=crop',
    tags: ['RAG Model (Retrieval-Augmented Generation)', 'Beautifulsoup', 'requests', 'VectorDB', 'ChromaDB', 'Embedding Model', 'LLM', 'FastAPI', 'Guardrails'],
    github: 'https://github.com/codelinechef/AI_Query_ChatBot',
    live: '',
    featured: false,
  },
  {
    id: 5,
    title: 'E-Commerce Recommendation System',
    category: 'Data Science',
    description: 'Content-based recommendation engine using TF-IDF vectorization and cosine similarity',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=600&fit=crop',
    tags: ['Scikit-learn', 'Pandas', 'TF-IDF', 'Python'],
    github: 'https://github.com/codelinechef/eE-Commerce-Recommendation-System',
    live: '',
    featured: false,
  },
  {
    id: 6,
    title: 'Mental Fitness Tracker',
    category: 'Data Science',
    description: 'Automated mental health data analysis with predictive stress level modeling',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=600&fit=crop',
    tags: ['Python', 'Seaborn', 'Matplotlib', 'Linear Regression'],
    github: 'https://github.com/codelinechef/Track-Your-Mental-Fitness',
    live: '',
    featured: false,
  },
];

export const Projects = () => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedProject, setSelectedProject] = useState<typeof projects[0] | null>(null);
  const { playSound } = useAudio();

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(p => p.category === selectedCategory);

  const handleProjectClick = (project: typeof projects[0]) => {
    playSound('click');
    trackProjectView(project.title);
    setSelectedProject(project);
  };

  const handleCategoryChange = (category: string) => {
    playSound('navigation');
    setSelectedCategory(category);
  };

  return (
    <section id="projects" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Projects</h2>
          <p className="text-xl text-muted-foreground">
            A showcase of my recent work and experiments
          </p>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-3 mb-12"
        >
          {categories.map((category) => (
            <motion.button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-6 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category
                  ? 'bg-primary text-primary-foreground shadow-lg'
                  : 'glass-card hover:bg-primary/10'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {category}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ y: -8 }}
                className="glass-card rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => handleProjectClick(project)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  {project.featured && (
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                      Featured
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="text-sm text-primary font-semibold mb-2">
                    {project.category}
                  </div>
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  <p className="text-muted-foreground text-sm mb-4">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-full bg-primary/10 text-primary"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-3">
                    {project.github && (
                      <a
                        href={project.github}
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noopener noreferrer"
                        referrerPolicy="no-referrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Github size={16} />
                        Code
                      </a>
                    )}
                    {project.live && (
                      <a
                        href={project.live}
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noopener noreferrer"
                        referrerPolicy="no-referrer"
                        className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                      >
                        <ExternalLink size={16} />
                        Live Demo
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Project Modal */}
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      </div>
    </section>
  );
};
