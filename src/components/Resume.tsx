import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, Award, Download } from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import { trackDownload } from '@/utils/analytics';

const experiences = [
  {
    title: 'CanopusGBS: Software Development Engineer',
    company: ' NSC Awards- National Safety Council',
    period: 'March 2025 - Present',
    description: 'Leading development of NSC Awards platform serving National Safety Council of India',
    achievements: [
      'Engineered RESTful APIs using Django and DRF for dynamic assessor assignments, reducing manual coordination by over 70%',
      'Automated end-to-end documentation processes using Pandas and ReportLab, cutting report generation time from hours to under 2 minutes',
      'Integrated Microsoft Graph API to automate secure email delivery, improving user response rates by 60%',
      'Designed scalable data models with UUIDs and JSON fields, enabling 40% reduction in data redundancy',
    ],
  },
];

const education = [
  {
    degree: 'Bachelor of Computer Science and Engineering (AI-ML)',
    institution: 'SRM Institute Of Science and Technology',
    period: '2021 - 2025',
    description: 'Specialization in Artificial Intelligence and Machine Learning, Chennai, Tamil Nadu',
  },
];

const certifications = [
  'Oracle Cloud Infrastructure 2024 Generative AI Professional',
  'AWS Certified Machine Learning Foundations',
];

export const Resume = () => {
  const { playSound } = useAudio();

  const handleDownload = () => {
    playSound('click');
    trackDownload('Anant_Sharma_Resume.pdf');
  };

  return (
    <section id="resume" className="py-20 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Resume</h2>
          <p className="text-xl text-muted-foreground mb-8">
            My professional journey and qualifications
          </p>
          <motion.a
            href={`${import.meta.env.BASE_URL}resume.pdf`}
            download
            onClick={handleDownload}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold hover:shadow-lg transition-shadow"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download size={20} />
            Download Resume
          </motion.a>
        </motion.div>

        {/* Experience */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Briefcase className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">Experience</h3>
          </div>
          <div className="space-y-6">
            {experiences.map((exp, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="glass-card p-6 rounded-2xl"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                  <div>
                    <h4 className="text-xl font-bold mb-1">{exp.title}</h4>
                    <p className="text-primary font-semibold">{exp.company}</p>
                  </div>
                  <span className="text-sm text-muted-foreground mt-2 md:mt-0">
                    {exp.period}
                  </span>
                </div>
                <p className="text-muted-foreground mb-4">{exp.description}</p>
                <ul className="space-y-2">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">•</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Education */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">Education</h3>
          </div>
          <div className="space-y-6">
            {education.map((edu, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="glass-card p-6 rounded-2xl"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-3">
                  <div>
                    <h4 className="text-xl font-bold mb-1">{edu.degree}</h4>
                    <p className="text-primary font-semibold">{edu.institution}</p>
                  </div>
                  <span className="text-sm text-muted-foreground mt-2 md:mt-0">
                    {edu.period}
                  </span>
                </div>
                <p className="text-muted-foreground">{edu.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Award className="w-6 h-6 text-primary" />
            </div>
            <h3 className="text-2xl font-bold">Certifications</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="glass-card p-4 rounded-xl text-center"
              >
                <p className="font-semibold">{cert}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
