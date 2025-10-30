import { motion } from 'framer-motion';
import { Code2, Brain, Rocket, Database } from 'lucide-react';

const skills = [
  {
    icon: Brain,
    title: 'AI/ML Engineering',
    description: 'RAG, Agentic AI, LangGraph, LangChain, TensorFlow, PyTorch, NLP, OpenAI API',
  },
  {
    icon: Code2,
    title: 'Backend Development',
    description: 'Django, DRF, RESTful APIs, GraphQL, Python, C/C++, PostgreSQL, MySQL',
  },
  {
    icon: Database,
    title: 'Cloud & DevOps',
    description: 'AWS (EC2, S3, RDS), Docker, Git, Nginx, Prometheus, Grafana',
  },
  {
    icon: Rocket,
    title: 'Computer Vision',
    description: 'OpenCV, Dlib, Facial Recognition, Object Detection, Real-time Processing',
  },
];

export const About = () => {
  return (
    <section id="about" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">About Me</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Building intelligent AI systems and scalable backend solutions that drive real-world impact
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill, index) => (
            <motion.div
              key={skill.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -5, scale: 1.02 }}
              className="glass-card p-6 rounded-2xl"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <skill.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">{skill.title}</h3>
              <p className="text-muted-foreground">{skill.description}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 glass-card p-8 rounded-2xl"
        >
          <h3 className="text-2xl font-bold mb-4">My Journey</h3>
          <p className="text-muted-foreground leading-relaxed">
            As a Software Developer and AI/ML Engineer, I specialize in building intelligent AI systems 
            and scalable backend solutions. I'm passionate about creating innovative 
            solutions using cutting-edge technologies like RAG, Langchain, LangGraph, Django, Restful APIs, FastAPI, LLMs, MLMs, OpenAI. My work spans from 
            building agentic AI systems to engineering production-grade APIs that serve real-world applications.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
