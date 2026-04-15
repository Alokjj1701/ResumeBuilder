// Realistic dummy resume data — loaded when a user selects a template
// Follows the same shape as sections in ResumeContext

export const DUMMY_RESUME = {
  personalInfo: {
    firstName: 'Alok',
    lastName: 'Sharma',
    email: 'alok.sharma@email.com',
    phone: '+91 7000000000',
    location: 'Bangalore, India',
    linkedin: 'linkedin.com/in/aloksharma',
    github: 'github.com/aloksharma',
    website: 'aloksharma.dev',
  },
  summary:
    'Full-stack software engineer with 4+ years of experience building scalable web applications at Series B startups. Passionate about clean architecture, developer experience, and shipping products that users love. Proven track record of leading cross-functional teams and reducing system latency by 35%+.',
  experience: [
    {
      id: 'exp-1',
      title: 'Software Engineer II',
      company: 'Razorpay',
      location: 'Bangalore',
      startDate: '2022-06',
      endDate: '',
      current: true,
      description:
        '• Built high-throughput payment APIs handling ₹10 Cr+ daily transactions with 99.98% uptime.\n• Led migration of legacy PHP monolith to Node.js microservices — reduced p95 latency by 35%.\n• Introduced automated load testing, catching 3 critical regressions before production releases.\n• Mentored 3 junior engineers and drove bi-weekly system design tech talks.',
    },
    {
      id: 'exp-2',
      title: 'Software Engineer',
      company: 'Freshworks',
      location: 'Chennai',
      startDate: '2020-07',
      endDate: '2022-05',
      current: false,
      description:
        '• Developed React-based CRM dashboard used by 5,000+ daily active users across 40+ countries.\n• Reduced page load time by 42% through code splitting, lazy loading, and CDN optimisation.\n• Contributed to open-source customer support SDK — 1.2k GitHub stars, 200+ weekly downloads.',
    },
    {
      id: 'exp-3',
      title: 'Software Engineering Intern',
      company: 'Zoho Corporation',
      location: 'Chennai',
      startDate: '2020-01',
      endDate: '2020-06',
      current: false,
      description:
        '• Built internal analytics module using Vue.js and Python Flask, adopted by 2 product teams.\n• Automated daily reporting pipeline, saving 3 hours of manual work per week.',
    },
  ],
  education: [
    {
      id: 'edu-1',
      degree: 'B.Tech Computer Science',
      fieldOfStudy: 'Distributed Systems',
      institution: 'IIT Bombay',
      location: 'Mumbai, India',
      startDate: '2016-07',
      endDate: '2020-05',
      gpa: '8.7 / 10',
      description:
        'Relevant coursework: Distributed Systems, Algorithms, Database Engineering, Machine Learning. Final year thesis: "Optimising Consensus Algorithms in Permissioned Blockchain Networks."',
    },
  ],
  skills: [
    {
      id: 'sk-1',
      category: 'Frontend',
      items: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'Redux Toolkit'],
    },
    {
      id: 'sk-2',
      category: 'Backend',
      items: ['Node.js', 'Python', 'Java Spring Boot', 'REST APIs', 'GraphQL'],
    },
    {
      id: 'sk-3',
      category: 'Infrastructure',
      items: ['AWS (EC2, S3, Lambda)', 'Docker', 'Kubernetes', 'PostgreSQL', 'Redis'],
    },
  ],
  projects: [
    {
      id: 'proj-1',
      name: 'DevPulse — Open Source APM Tool',
      description:
        'Real-time application performance monitoring tool tracking latency, error rates, and throughput across microservices. 480+ GitHub stars, featured in Hacker News.',
      url: 'github.com/priyasharma/devpulse',
      technologies: ['React', 'Go', 'InfluxDB', 'Grafana', 'Docker'],
      startDate: '2023-01',
      endDate: '2023-08',
    },
    {
      id: 'proj-2',
      name: 'CodeCollab — Pair Programming Platform',
      description:
        'Browser-based collaborative code editor with real-time cursor sync using WebSockets and CRDT algorithms. Supports 10+ languages with syntax highlighting.',
      url: 'codecollab.dev',
      technologies: ['Next.js', 'WebSockets', 'Monaco Editor', 'CRDT', 'Node.js'],
      startDate: '2021-06',
      endDate: '2021-12',
    },
  ],
};

export const DUMMY_TITLE = 'Alok Sharma — Software Engineer';
