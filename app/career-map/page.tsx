'use client';

import { useState, useEffect } from 'react';
import type { CSSProperties } from 'react';
import { MapPin, TrendingUp, Target, BookOpen, CheckCircle, Circle, ArrowRight, Star, Award, Briefcase, Code, Palette, BarChart, Users } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface CareerPath {
  id: string;
  title: string;
  icon: any;
  color: string;
  levels: CareerLevel[];
}

interface CareerLevel {
  title: string;
  experience: string;
  skills: string[];
  salary: string;
  description: string;
}

export default function CareerMapPage() {
  const { user } = useAuth();
  const [isEntering, setIsEntering] = useState(true);
  const [selectedPath, setSelectedPath] = useState<string>('software-engineering');
  const [currentLevel, setCurrentLevel] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => setIsEntering(false), 900);
    return () => clearTimeout(timeout);
  }, []);

  const careerPaths: CareerPath[] = [
    {
      id: 'software-engineering',
      title: 'Software Engineering',
      icon: Code,
      color: 'blue',
      levels: [
        {
          title: 'Junior Developer',
          experience: '0-2 years',
          skills: ['HTML/CSS', 'JavaScript', 'Git', 'Basic Algorithms'],
          salary: '$50k - $70k',
          description: 'Entry-level position focusing on learning fundamentals and contributing to projects under supervision.',
        },
        {
          title: 'Mid-Level Developer',
          experience: '2-5 years',
          skills: ['React/Vue', 'Node.js', 'Databases', 'Testing', 'CI/CD'],
          salary: '$70k - $100k',
          description: 'Independent contributor working on features and collaborating with team members.',
        },
        {
          title: 'Senior Developer',
          experience: '5-8 years',
          skills: ['System Design', 'Architecture', 'Mentoring', 'Code Review', 'Performance'],
          salary: '$100k - $140k',
          description: 'Technical leader guiding architecture decisions and mentoring junior developers.',
        },
        {
          title: 'Tech Lead / Architect',
          experience: '8+ years',
          skills: ['Leadership', 'Strategic Planning', 'Cross-team Collaboration', 'Technical Vision'],
          salary: '$140k - $200k+',
          description: 'Leading technical direction for products and teams, making high-level architectural decisions.',
        },
      ],
    },
    {
      id: 'product-design',
      title: 'Product Design',
      icon: Palette,
      color: 'purple',
      levels: [
        {
          title: 'Junior Designer',
          experience: '0-2 years',
          skills: ['Figma/Sketch', 'UI Design', 'Prototyping', 'Design Systems'],
          salary: '$45k - $65k',
          description: 'Creating UI designs and prototypes under guidance of senior designers.',
        },
        {
          title: 'Product Designer',
          experience: '2-5 years',
          skills: ['UX Research', 'User Testing', 'Interaction Design', 'Wireframing'],
          salary: '$65k - $95k',
          description: 'Owning design for features and conducting user research.',
        },
        {
          title: 'Senior Designer',
          experience: '5-8 years',
          skills: ['Design Strategy', 'Stakeholder Management', 'Design Leadership', 'Accessibility'],
          salary: '$95k - $130k',
          description: 'Leading design initiatives and establishing design standards.',
        },
        {
          title: 'Design Lead / Director',
          experience: '8+ years',
          skills: ['Team Management', 'Design Vision', 'Business Strategy', 'Cross-functional Leadership'],
          salary: '$130k - $180k+',
          description: 'Setting design vision and managing design teams across products.',
        },
      ],
    },
    {
      id: 'data-science',
      title: 'Data Science',
      icon: BarChart,
      color: 'green',
      levels: [
        {
          title: 'Data Analyst',
          experience: '0-2 years',
          skills: ['SQL', 'Excel', 'Python/R', 'Data Visualization', 'Statistics'],
          salary: '$55k - $75k',
          description: 'Analyzing data and creating reports to support business decisions.',
        },
        {
          title: 'Data Scientist',
          experience: '2-5 years',
          skills: ['Machine Learning', 'Statistical Modeling', 'Feature Engineering', 'A/B Testing'],
          salary: '$80k - $120k',
          description: 'Building predictive models and conducting advanced analytics.',
        },
        {
          title: 'Senior Data Scientist',
          experience: '5-8 years',
          skills: ['Deep Learning', 'MLOps', 'Model Deployment', 'Team Leadership'],
          salary: '$120k - $160k',
          description: 'Leading data science projects and mentoring team members.',
        },
        {
          title: 'Principal Data Scientist',
          experience: '8+ years',
          skills: ['Research', 'Strategic Planning', 'Cross-functional Leadership', 'Innovation'],
          salary: '$160k - $220k+',
          description: 'Driving data science strategy and leading complex initiatives.',
        },
      ],
    },
    {
      id: 'product-management',
      title: 'Product Management',
      icon: Target,
      color: 'orange',
      levels: [
        {
          title: 'Associate PM',
          experience: '0-2 years',
          skills: ['Market Research', 'User Stories', 'Roadmapping', 'Analytics'],
          salary: '$60k - $85k',
          description: 'Supporting product initiatives and learning product management fundamentals.',
        },
        {
          title: 'Product Manager',
          experience: '2-5 years',
          skills: ['Product Strategy', 'Stakeholder Management', 'Prioritization', 'Go-to-Market'],
          salary: '$90k - $130k',
          description: 'Owning product features and driving product roadmap.',
        },
        {
          title: 'Senior PM',
          experience: '5-8 years',
          skills: ['Product Vision', 'Team Leadership', 'Business Strategy', 'Metrics'],
          salary: '$130k - $170k',
          description: 'Leading product strategy and managing product lines.',
        },
        {
          title: 'Director of Product',
          experience: '8+ years',
          skills: ['Executive Leadership', 'Portfolio Management', 'P&L', 'Organizational Strategy'],
          salary: '$170k - $250k+',
          description: 'Setting product vision and managing product teams.',
        },
      ],
    },
  ];

  const selectedCareerPath = careerPaths.find(p => p.id === selectedPath) || careerPaths[0];
  const IconComponent = selectedCareerPath.icon;

  return (
    <div className="hero-gradient relative min-h-screen overflow-hidden">
      <div className="auth-background-grid" aria-hidden="true" />
      {isEntering && <div className="auth-entry-overlay" />}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-64 w-64 -translate-x-1/2 rounded-full bg-yellow-500/20 blur-3xl"></div>
        <div className="absolute right-[-10%] top-20 h-72 w-72 rounded-full bg-amber-500/15 blur-3xl"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className={`mb-8 ${isEntering ? 'auth-panel-enter' : ''}`}>
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-500 to-amber-500 text-white">
              <MapPin className="h-7 w-7" />
            </div>
            <h1 className="auth-title text-3xl font-bold animate-[floatUp_0.85s_ease-out]">
              Career Map
            </h1>
          </div>
          <p className="auth-subtitle">
            Visualize your career path and plan your professional journey
          </p>
        </div>

        {/* Career Path Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {careerPaths.map((path, index) => {
            const PathIcon = path.icon;
            return (
              <button
                key={path.id}
                onClick={() => setSelectedPath(path.id)}
                className={`card p-6 text-left transition-all duration-300 ${
                  selectedPath === path.id
                    ? 'ring-2 ring-primary-500 shadow-xl'
                    : 'hover:shadow-lg'
                }`}
                style={{ '--float-delay': `${0.1 + index * 0.05}s` } as CSSProperties}
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-${path.color}-100 text-${path.color}-600 mb-3`}>
                  <PathIcon className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{path.title}</h3>
                <p className="text-sm text-secondary-600">{path.levels.length} levels</p>
              </button>
            );
          })}
        </div>

        {/* Career Progression */}
        <div className="card mb-8">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className={`flex h-14 w-14 items-center justify-center rounded-xl bg-${selectedCareerPath.color}-100 text-${selectedCareerPath.color}-600`}>
                <IconComponent className="h-7 w-7" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedCareerPath.title}</h2>
                <p className="text-secondary-600">Career Progression Path</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Your Progress</span>
                <span className="text-sm text-secondary-600">
                  Level {currentLevel + 1} of {selectedCareerPath.levels.length}
                </span>
              </div>
              <div className="flex gap-2">
                {selectedCareerPath.levels.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentLevel(index)}
                    className={`flex-1 h-2 rounded-full transition-all ${
                      index <= currentLevel
                        ? 'bg-gradient-to-r from-primary-500 to-secondary-500'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Career Levels */}
            <div className="space-y-6">
              {selectedCareerPath.levels.map((level, index) => (
                <div
                  key={index}
                  className={`relative ${
                    index < selectedCareerPath.levels.length - 1 ? 'pb-6' : ''
                  }`}
                >
                  {/* Connector Line */}
                  {index < selectedCareerPath.levels.length - 1 && (
                    <div className="absolute left-6 top-12 bottom-0 w-0.5 bg-gray-200" />
                  )}

                  <div className="flex gap-4">
                    {/* Level Indicator */}
                    <div className="relative flex-shrink-0">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-full border-2 ${
                          index <= currentLevel
                            ? 'border-primary-500 bg-primary-500 text-white'
                            : 'border-gray-300 bg-white text-gray-400'
                        }`}
                      >
                        {index <= currentLevel ? (
                          <CheckCircle className="h-6 w-6" />
                        ) : (
                          <Circle className="h-6 w-6" />
                        )}
                      </div>
                    </div>

                    {/* Level Content */}
                    <div className="flex-1 min-w-0">
                      <div className="feature-card p-6">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {level.title}
                            </h3>
                            <div className="flex flex-wrap items-center gap-3 text-sm text-secondary-600">
                              <span className="flex items-center gap-1">
                                <Briefcase className="w-4 h-4" />
                                {level.experience}
                              </span>
                              <span className="flex items-center gap-1">
                                <TrendingUp className="w-4 h-4" />
                                {level.salary}
                              </span>
                            </div>
                          </div>
                          {index === currentLevel && (
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary-100 text-primary-600 text-sm font-semibold whitespace-nowrap">
                              <Star className="w-4 h-4" />
                              Current Level
                            </span>
                          )}
                        </div>

                        <p className="text-secondary-700 mb-4">{level.description}</p>

                        <div>
                          <h4 className="text-sm font-semibold text-gray-900 mb-3">
                            Required Skills:
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {level.skills.map((skill, skillIndex) => (
                              <span
                                key={skillIndex}
                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {index < selectedCareerPath.levels.length - 1 && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <button
                              onClick={() => setCurrentLevel(index + 1)}
                              className="inline-flex items-center gap-2 text-sm font-medium text-primary-600 hover:text-primary-700"
                            >
                              Next: {selectedCareerPath.levels[index + 1].title}
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Resources */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="card">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
                  <BookOpen className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Learning Resources</h3>
              </div>
              <p className="text-secondary-600 mb-4">
                Explore courses and resources to advance your career
              </p>
              <button className="btn-primary w-full">Browse Resources</button>
            </div>
          </div>

          <div className="card">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100 text-green-600">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">Find a Mentor</h3>
              </div>
              <p className="text-secondary-600 mb-4">
                Connect with experienced professionals in your field
              </p>
              <button className="btn-secondary w-full">Find Mentors</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
