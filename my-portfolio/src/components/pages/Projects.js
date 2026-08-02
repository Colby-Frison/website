import React, { useEffect, useState } from 'react';
import PageAtmosphere from '../motif/PageAtmosphere';
import LeafAccent from '../motif/LeafAccent';
import SectionNav from '../SectionNav/SectionNav';
import './Projects.css';

const Projects = ({ deviceInfo }) => {
  const [expandedId, setExpandedId] = useState(null);
  const isMobile = Boolean(deviceInfo?.isMobile);

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
      navLabel: 'SimpleChef',
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
      navLabel: 'openpilot',
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
      name: 'Tensor Compiler Optimization Pipeline',
      navLabel: 'Tensor Opt',
      shortDescription:
        'Schedule-driven compiler pipeline that lowers YAML-defined tensor kernels through AST passes into executable C-built for Compiler Construction.',
      fullDescription: `For Compiler Construction (Fall 2025), I built a schedule-driven optimization pipeline that transforms YAML-defined tensor kernels through AST lowering passes into executable C. The system implements hoisting, modulo simplification, pointer-dereference lowering, and kernel-to-SSA passes to improve generated code quality, with CLI verification and benchmarking workflows to validate correctness and compare optimization variants reproducibly. A public repository is forthcoming.`,
      type: 'Academic Project',
      technologies: ['C', 'Python', 'YAML', 'AST', 'SSA', 'LLVM', 'CLI tooling'],
      links: [],
      features: [
        'YAML-defined tensor kernels lowered through AST transformation passes',
        'Hoisting, modulo simplification, and pointer-dereference lowering',
        'Kernel-to-SSA pass for improved generated code quality',
        'CLI verification and benchmarking across optimization variants',
      ],
      impact: [
        'Produced a reproducible optimization pipeline from schedule specs to executable C',
        'Enabled correctness checks and variant comparison via CLI workflows',
      ],
      role: 'Student Developer',
      contributions: [
        'Implemented AST lowering and SSA-oriented optimization passes',
        'Built verification and benchmarking tooling for the pipeline',
      ],
      architecture: [
        'Schedule-driven front end over YAML kernel definitions',
        'Multi-pass AST lowering into C codegen',
        'CLI harness for correctness and performance comparison',
      ],
    },
    {
      id: 4,
      name: 'Secure Instant Messaging',
      navLabel: 'Secure Chat',
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
      navLabel: 'Classroom',
      shortDescription:
        'Full-stack anonymous classroom Q&A app with real-time sync—deployed and used in a live university course.',
      fullDescription: `Developed and deployed a full-stack anonymous classroom Q&A app used in a live university course environment (March-May 2025). Started as practice with databases and real-time sync, then evolved into a practical tool that removes barriers to student participation while giving professors an efficient way to manage classroom questions.`,
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
      navLabel: 'FreshStart',
      shortDescription:
        'Award-winning MERN farm-planning app with interactive layout tools, ML yield prediction, and LLM task generation-2nd place at Hacklahoma 2024.',
      fullDescription: `FreshStart helps users plan, build, and maintain a home garden or small farm. Built at Hacklahoma 2024, it placed 2nd out of 200+ participants. The app combines a MERN stack with machine learning for crop yield prediction and an LLM for personalized farm task generation.`,
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
      achievements: ['2nd place at Hacklahoma 2024 (200+ participants)'],
      features: [
        'Farm Mapping Layout Tool with drag-and-drop functionality',
        'ML-powered crop yield prediction system',
        'Personalized task scheduling using LLM technology',
        'Equipment and resource recommendation engine',
        'Interactive farm creation and management dashboard',
      ],
      impact: [
        '2nd place out of 200+ participants at Hacklahoma 2024',
        'Helps users efficiently plan and manage gardens/farms',
        'Reduces research time through AI-powered recommendations',
      ],
      role: 'Front-end Lead Developer',
      contributions: [
        'Led front-end development for the award-winning farm planning web app',
        'Built interactive farm planning UI on the MERN stack',
        'Integrated machine learning for yield prediction and an LLM for task generation',
      ],
    },
    {
      id: 7,
      name: 'SmartWrite',
      navLabel: 'SmartWrite',
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

  const sectionNavItems = projects.map((project) => ({
    id: `project-${project.id}`,
    // Kept to at most 12 characters so labels fit the vertical nav cleanly.
    label: (project.navLabel || project.name).slice(0, 12),
  }));

  return (
    <div className="interior-page projects-page">
      <PageAtmosphere />
      {!isMobile && <SectionNav sections={sectionNavItems} ariaLabel="Project list" />}
      <div className="interior-page-inner projects-inner">
        <h1 className="interior-title">My Projects</h1>
        <div className="interior-title-rule">
          <LeafAccent size="sm" settle />
        </div>
        <p className="interior-lede">
          Recent work across automation, compilers, secure systems, and full-stack tools people
          can actually use.
        </p>

        <div className="projects-list">
          {projects.map((project, index) => {
            const isExpanded = expandedId === project.id;
            return (
              <article
                key={project.id}
                id={`project-${project.id}`}
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
