import React, { useEffect, useState } from 'react';
import PageAtmosphere from '../motif/PageAtmosphere';
import LeafAccent from '../motif/LeafAccent';
import './Projects.css';

const Projects = () => {
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const delay = entry.target.getAttribute('data-delay') || '0';
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, parseFloat(delay) * 1000);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px 80px 0px' }
    );

    const sections = document.querySelectorAll('.projects-page .section-animate');
    sections.forEach((section) => observer.observe(section));

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  const handleExpandClick = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const projects = [
    {
      id: 1,
      name: 'SimpleChef',
      shortDescription:
        'A full-stack cooking assistant with recipes, step-by-step cooking, meal planning, and grocery lists—built as an HCI course prototype.',
      fullDescription: `SimpleChef combines recipe management, guided cooking, meal planning, and grocery list generation in one system. Built for CS4063 Human–Computer Interaction (Spring 2026) as an academic prototype with a React + Vite web app, FastAPI backend, and PostgreSQL. Live demo available for evaluation.`,
      type: 'Academic Project',
      technologies: [
        'React',
        'TypeScript',
        'Vite',
        'FastAPI',
        'PostgreSQL',
        'SQLAlchemy',
        'Zustand',
        'Docker',
      ],
      links: [
        {
          type: 'github',
          url: 'https://github.com/Colby-Frison/SimpleChef',
          label: 'View Code',
        },
        {
          type: 'demo',
          url: 'https://simple-chef.vercel.app',
          label: 'Live Demo',
        },
      ],
      features: [
        'JWT authentication and protected API endpoints',
        'Recipe library with tags, filtering, and visibility rules',
        'Cooking mode with step navigation and timer dock',
        'Meal planner with month view and calorie summary',
        'Grocery list merge, categorization, and export/share',
        'Profile settings for dietary preferences and goals',
      ],
      impact: [
        'Delivered an end-to-end HCI prototype spanning design, API, and web UI',
        'Shipped a public live demo for course evaluation and code review',
      ],
      role: 'Team Member / Full-Stack Contributor',
      contributions: [
        'Contributed across recipe, cooking, planning, and grocery workflows',
        'Worked with FastAPI services, React TypeScript UI, and Docker-based local setup',
        'Supported authentication, persistence, and client session handling',
      ],
      architecture: [
        'FastAPI + SQLAlchemy + Alembic backend with PostgreSQL',
        'React + TypeScript + Vite primary web UI (figma_design)',
        'Zustand for client session and timer state',
        'Legacy Expo prototype retained for reference',
      ],
    },
    {
      id: 2,
      name: 'openpilot Testing Exploration',
      shortDescription:
        'Exploration and contribution to comma.ai openpilot focused on software quality—layered tests for modeld and pandad, shared harnesses, and course CI.',
      fullDescription: `Fork of openpilot (release 0.9.8) for CS4223 Software Quality and Testing at the University of Oklahoma. Our team scoped testing work around selfdrive/modeld, assignment-listed pandad files, and system/, adding unit/contract tests, shared pytest infrastructure, coverage tooling, and documentation under docs/testing.`,
      type: 'Academic / Open Source Contribution',
      technologies: ['Python', 'pytest', 'C++', 'Catch2', 'SCons', 'GitHub Actions', 'openpilot'],
      links: [
        {
          type: 'github',
          url: 'https://github.com/Colby-Frison/openpilot',
          label: 'View Code',
        },
        {
          type: 'docs',
          url: 'https://github.com/Colby-Frison/openpilot/tree/master/docs/testing',
          label: 'Testing Docs',
        },
      ],
      features: [
        'Unit and contract tests for modeld parser math and message population',
        'Extended modeld daemon integration and Phase C message contracts',
        'Pandad desktop tests: CAN serialization, flash/wrapper mocks, USB protocol gtests',
        'Shared selfdrive/system pytest support harnesses',
        'System contract suite and coverage comparison scripts',
        'Course-scoped CI workflow for reproducible verification on the team fork',
      ],
      impact: [
        'Raised scoped modeld coverage on parser and fill_model_msg targets',
        'Completed desktop pandad verification without requiring Panda hardware',
        'Documented plans, trackers, and run commands for the testing milestone',
      ],
      role: 'Team Member (Group C, Cluster 1)',
      contributions: [
        'Authored and extended modeld parser, fill, and daemon contract tests',
        'Contributed pandad desktop pytest and Catch2 USB protocol coverage',
        'Helped build shared testing harnesses and docs/testing documentation',
      ],
      architecture: [
        'Layered tests: unit math, message contracts, daemon integration',
        'Pytest plugins and support packages for params seeding and messaging',
        'Fork CI (our_tests) separate from full upstream selfdrive workflows',
      ],
    },
    {
      id: 3,
      name: 'Expression Optimizer',
      shortDescription:
        'Compiler Construction project that refactors and optimizes expressions in C before compilation, achieving about 50% speedup single-threaded.',
      fullDescription: `For Compiler Construction, I built a pre-compiler optimization pass over given expressions in C. The pipeline refactors expressions and applies optimization operations before the compiler runs, improving runtime by approximately 50% while remaining single-threaded. The repository is still private while a public fork is prepared; more details will follow.`,
      type: 'Academic Project',
      technologies: ['C', 'Python3', 'shell', 'OSACA', 'LLVM'],
      links: [],
      features: [
        'Expression refactoring prior to compilation',
        'Optimization operations in a single-threaded pipeline',
      ],
      impact: [
        'Approximately 50% runtime speedup on targeted workloads (single-threaded)',
      ],
      role: 'Student Developer',
      contributions: [
        'Implemented expression refactoring and optimization logic in C',
        'Measured single-threaded performance gains against the baseline',
      ],
    },
    {
      id: 4,
      name: 'Secure Instant Messaging',
      shortDescription:
        'Point-to-point encrypted chat with authenticated ECDH key agreement, AES-GCM, and rotating session keys—built for Computer Security.',
      fullDescription: `CS5173 Computer Security (Spring 2026) team project with Johnpaul Nguyen and Jacob Woolbright. We built a two-party secure messaging app in Python: authenticated ephemeral ECDH (P-384) with Ed25519 signatures derives a 256-bit AES-GCM session key via HKDF (no pre-shared passphrase). Per-message random nonces keep repeated plaintexts from producing identical ciphertext, and an HKDF ratchet rotates keys every five messages. A Tkinter GUI shows ciphertext and plaintext side by side for every send and receive.`,
      type: 'Academic Project',
      technologies: [
        'Python',
        'AES-GCM',
        'ECDH',
        'Ed25519',
        'HKDF',
        'Tkinter',
        'CustomTkinter',
        'sockets',
      ],
      links: [],
      features: [
        'Authenticated ECDH + Ed25519 handshake (bonus: no pre-shared passphrase)',
        '256-bit AES-GCM encryption with integrity via GCM tags',
        'Fresh ciphertext on repeated plaintexts via per-message nonces',
        'HKDF key rotation every five messages',
        'GUI bubbles showing ciphertext and plaintext for sent and received messages',
        'Threaded networking with a responsive three-layer architecture',
        'Automated integration tests for delivery and key rotation',
      ],
      impact: [
        'Met all assignment requirements plus authenticated key-agreement bonus',
        'Confidentiality, integrity, authenticity, and ciphertext non-determinism',
        'Session-level forward secrecy at handshake; bounded exposure under any single key',
      ],
      role: 'Team Member',
      contributions: [
        'Contributed to cryptographic design, networking, and GUI implementation',
        'Helped validate ciphertext uniqueness and key-rotation behavior',
        'Documented architecture, security analysis, and testing in the course report',
      ],
      architecture: [
        'Transport/crypto layer (simple_socket.py): handshake, encrypt/decrypt, rotation',
        'Controller layer (chat_controller.py): threads, queues, GUI-safe callbacks',
        'GUI layer (gui/chat_gui.py): connect/settings dialogs and message bubbles',
      ],
    },
    {
      id: 5,
      name: 'Classroom Q&A',
      shortDescription:
        'A web application enabling students to anonymously ask questions during class, enhancing classroom engagement through real-time interaction.',
      fullDescription: `Started as a side project for practicing databases and websockets, this application evolved into a practical tool used in actual classroom settings. It removes barriers to student participation by allowing anonymous questions while providing professors with an efficient way to manage classroom interactions.`,
      type: 'Personal/Academic Project',
      technologies: [
        'TypeScript',
        'React',
        'Next.js',
        'Firebase',
        'Firestore',
        'Node.js',
        'Tailwind CSS',
      ],
      links: [
        {
          type: 'github',
          url: 'https://github.com/Colby-Frison/Question-website',
          label: 'View Code',
        },
      ],
      features: [
        'Anonymous question submission system',
        'Real-time updates using websockets',
        'Professor dashboard for managing questions',
        'Student interface for asking and viewing questions',
        'Theme toggle support (light/dark modes)',
        'Responsive design for all devices',
      ],
      impact: [
        'Successfully implemented in actual classroom environment',
        'Improved student engagement by removing barriers to asking questions',
        'Enhanced learning experience through anonymous participation',
        'Collaborated with professor to integrate into classroom workflow',
      ],
      role: 'Solo Developer',
      contributions: [
        'Implemented Firebase/Firestore for real-time data synchronization',
        'Built with TypeScript for type safety and code reliability',
        'Used Next.js and React for optimal performance',
        'Integrated Tailwind CSS for responsive design',
        'Implemented caching and debouncing for performance optimization',
        'Created comprehensive security rules for Firebase',
      ],
      architecture: [
        'Real-time data synchronization with Firebase',
        'Type-safe codebase with TypeScript',
        'Optimized caching system for active questions',
        'Robust state management for session persistence',
        'Comprehensive error handling system',
      ],
    },
    {
      id: 6,
      name: 'FreshStart',
      shortDescription:
        'A comprehensive web application that helps users plan, build, and maintain home gardens or small farms, featuring AI-powered recommendations and interactive design tools.',
      fullDescription: `FreshStart is designed to make growing fresh food accessible to everyone by providing an intuitive platform for garden and farm planning. The application combines modern technology with practical farming knowledge to help users create successful growing spaces.`,
      type: 'Hackathon Project',
      technologies: [
        'MongoDB',
        'Express',
        'React',
        'Node.js',
        'Machine Learning',
        'LLM',
        'JavaScript',
      ],
      links: [
        {
          type: 'github',
          url: 'https://github.com/PravCoder/FarmStart',
          label: 'View Code',
        },
        {
          type: 'devpost',
          url: 'https://devpost.com/software/fresh-start-q5f92s#updates',
          label: 'View on Devpost',
        },
      ],
      achievements: ['2nd place at Hacklahoma 2024'],
      features: [
        'Farm Mapping Layout Tool with drag-and-drop functionality',
        'ML-powered crop yield prediction system',
        'Personalized task scheduling using LLM technology',
        'Equipment and resource recommendation engine',
        'Interactive farm creation and management dashboard',
      ],
      impact: [
        'Helps users efficiently plan and manage gardens/farms',
        'Reduces research time through AI-powered recommendations',
        'Makes agriculture more accessible to beginners',
      ],
      role: 'Front-end Lead Developer',
      contributions: [
        'Led front-end development efforts',
        'Implemented drag-and-drop farm layout system',
        'Integrated ML models for yield prediction',
        'Created intuitive user interface for farm planning',
      ],
    },
    {
      id: 7,
      name: 'SmartWrite',
      shortDescription:
        'An innovative note-taking application that combines handwriting recognition with AI-assisted writing features to transform and enhance the learning experience.',
      fullDescription: `SmartWrite is a sophisticated note-taking platform that bridges the gap between traditional handwritten notes and digital organization. The application uses advanced AI technology to help students and professionals better manage and understand their notes.`,
      type: 'Academic Project',
      technologies: [
        'HTML5',
        'JavaScript',
        'CSS3',
        'PDF.js',
        'AI Integration',
        'GitHub',
        'CI/CD',
      ],
      links: [
        {
          type: 'github',
          url: 'https://github.com/Colby-Frison/SmartWrite',
          label: 'View Code',
        },
      ],
      features: [
        'Advanced handwriting recognition system',
        'AI-powered note enhancement and summarization',
        'PDF document processing and organization',
        'Custom UI components for seamless interaction',
        'Theme system with dynamic switching',
        'Robust error recovery and fallback mechanisms',
      ],
      architecture: [
        'Event-driven system architecture',
        'Model-agnostic AI integration',
        'Layered component organization',
        'State persistence and recovery',
      ],
      impact: [
        'Enhanced note-taking efficiency and organization',
        'Improved accessibility of handwritten content',
        'Streamlined document management workflow',
      ],
      role: 'Team Member',
      contributions: [
        'Implemented core note-taking functionality',
        'Developed handwriting recognition integration',
        'Created document management system',
        'Contributed to UI/UX design',
      ],
    },
  ];

  return (
    <div className="interior-page projects-page">
      <PageAtmosphere />
      <div className="interior-page-inner projects-inner">
        <h1 className="interior-title">My Projects</h1>
        <div className="interior-title-rule">
          <LeafAccent size="sm" settle />
        </div>
        <p className="interior-lede">
          Recent work that reflects my interests in software development, AI, and building tools
          people can actually use.
        </p>

        <div className="projects-list">
          {projects.map((project, index) => {
            const isExpanded = expandedId === project.id;
            return (
              <article
                key={project.id}
                className="project-story section-animate"
                data-delay={0.08 + index * 0.08}
              >
                <header className="project-story-header">
                  <p className="project-type">{project.type}</p>
                  <h2 className="project-name">{project.name}</h2>
                </header>

                <p className="project-blurb">{project.shortDescription}</p>

                {project.achievements && (
                  <p className="project-achievement">{project.achievements.join(' · ')}</p>
                )}

                <p className="project-tech">{project.technologies.join(' · ')}</p>

                <div className="project-actions">
                  <div className="project-links">
                    {project.links.length > 0 ? (
                      project.links.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="project-link"
                        >
                          <span className="project-link-label">{link.label}</span>
                          <span className="project-link-arrow" aria-hidden="true">
                            ↗
                          </span>
                        </a>
                      ))
                    ) : (
                      <span className="project-link-pending">Public repository forthcoming</span>
                    )}
                  </div>

                  <button
                    type="button"
                    className={`project-expand ${isExpanded ? 'is-open' : ''}`}
                    onClick={() => handleExpandClick(project.id)}
                    aria-expanded={isExpanded}
                    aria-label={isExpanded ? 'Hide project details' : 'Show project details'}
                  >
                    <span>{isExpanded ? 'Less' : 'More'}</span>
                    <LeafAccent size="md" rotate rotated={isExpanded} />
                  </button>
                </div>

                <div
                  className={`project-details ${isExpanded ? 'is-open' : ''}`}
                  aria-hidden={!isExpanded}
                >
                  <p className="project-full">{project.fullDescription}</p>

                  <h3>Key Features</h3>
                  <ul>
                    {project.features.map((feature, idx) => (
                      <li key={idx}>{feature}</li>
                    ))}
                  </ul>

                  <h3>Impact &amp; Results</h3>
                  <ul>
                    {project.impact.map((impact, idx) => (
                      <li key={idx}>{impact}</li>
                    ))}
                  </ul>

                  <h3>My Role &amp; Contributions</h3>
                  <p className="project-role">{project.role}</p>
                  <ul>
                    {project.contributions.map((contribution, idx) => (
                      <li key={idx}>{contribution}</li>
                    ))}
                  </ul>

                  {project.architecture && (
                    <>
                      <h3>Technical Architecture</h3>
                      <ul>
                        {project.architecture.map((item, idx) => (
                          <li key={idx}>{item}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Projects;
