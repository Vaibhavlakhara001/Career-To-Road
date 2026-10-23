export interface AssessmentOption {
  text: string;
  category: string;
  weights: Record<string, number>;
}

export interface Question {
  id: number;
  prompt: string;
  subtitle: string;
  options: AssessmentOption[];
}

export interface TrackCourse {
  title: string;
  provider: string;
  url: string;
  free: boolean;
}

export interface TrackProject {
  title: string;
  description: string;
  deliverable: string;
  skills: string[];
}

export const TRACK_DETAILS: Record<string, {
  title: string;
  domain: string;
  summary: string;
  typicalRoles: string[];
  salaryRange: string;
  growthOutlook: string;
  keySkills: string[];
  alternativeTracks: string[];
  beginnerCourses: TrackCourse[];
  practicalProjects: TrackProject[];
}> = {
  game_development: {
    title: "Game Designer & Unity / Unreal Developer",
    domain: "Game Development & Interactive Media",
    summary: "Designs captivating game mechanics, programs interactive 2D/3D physics in Unity/Unreal Engine, sculpts level experiences, and builds immersive player gameplay loops.",
    typicalRoles: ["Gameplay Programmer", "Game Designer", "Unity / Unreal Developer", "Level Designer", "Technical Artist"],
    salaryRange: "$80,000 - $145,000",
    growthOutlook: "22% rapid growth fueled by the global $200B+ gaming, VR/AR, and interactive simulation industry",
    keySkills: ["Unity (C#)", "Unreal Engine 5 (C++ / Blueprints)", "3D Math & Physics Mechanics", "Gameplay Level & Quest Design", "Blender & 3D Asset Pipeline"],
    alternativeTracks: ["AR/VR Interactive Specialist", "3D Technical Artist", "Full-Stack Software Engineer"],
    beginnerCourses: [
      { title: "CS50's Introduction to Game Development", provider: "Harvard University / edX", url: "https://cs50.harvard.edu/games/", free: true },
      { title: "Unity Essentials & Junior Programmer Pathway", provider: "Unity Official Learn", url: "https://learn.unity.com/pathway/junior-programmer", free: true },
      { title: "Unreal Engine 5: Fundamentals for Beginners", provider: "Epic Games Dev Community", url: "https://dev.epicgames.com/community/learning", free: true },
      { title: "Blender 3D Modeling for Game Assets", provider: "Blender Studio / Open Tutorials", url: "https://cloud.blender.org/training/", free: true }
    ],
    practicalProjects: [
      {
        title: "2D Physics Platformer with Custom Boss Fight Mechanics",
        description: "Build a responsive 2D platformer in Unity or Godot with wall-jumping, particle effects, hazard obstacles, and an animated boss phase loop.",
        deliverable: "Playable WebGL game build on Itch.io with clean GitHub repository containing typed C# scripts.",
        skills: ["Unity (C#)", "Physics 2D", "State Machines", "Game Feel"]
      },
      {
        title: "3D Action-Adventure Prototype in Unreal Engine 5",
        description: "Create a 3D exploration prototype featuring character locomotion, inventory item pickup, atmospheric lighting (Lumen), and enemy AI behavior.",
        deliverable: "Packaged Windows/Mac demo build, video gameplay walkthrough, and Blueprint/C++ architecture documentation.",
        skills: ["Unreal Engine 5", "Blueprints", "Lumen & Nanite", "Enemy AI"]
      }
    ]
  },

  business_management: {
    title: "Business Management & Operations Strategist",
    domain: "Business Administration & Strategy (BBA/MBA)",
    summary: "Orchestrates corporate growth, optimizes organizational operations, develops go-to-market strategies, and leads cross-functional commercial initiatives.",
    typicalRoles: ["Business Operations Manager", "Management Consultant", "Strategy & Operations Lead", "General Management Associate", "Corporate Development Analyst"],
    salaryRange: "$75,000 - $140,000",
    growthOutlook: "18% steady expansion as enterprises prioritize operational agility and strategic efficiency",
    keySkills: ["Strategic Planning & Execution", "Operations Optimization", "Financial Modeling & Budgeting", "Leadership & Team Management", "Market Feasibility & GTM Strategy"],
    alternativeTracks: ["Associate Product Manager (APM)", "Management Consultant", "Business Analyst"],
    beginnerCourses: [
      { title: "Introduction to Operations Management", provider: "Wharton / Univ. of Pennsylvania / Coursera", url: "https://www.coursera.org/learn/wharton-operations", free: true },
      { title: "Strategic Leadership and Business Execution", provider: "Univ. of Illinois / Coursera", url: "https://www.coursera.org/specializations/strategic-leadership", free: true },
      { title: "Corporate Financial Decision Making & Valuation", provider: "Yale University / Coursera", url: "https://www.coursera.org/learn/financial-markets-global", free: true },
      { title: "Foundations of Business Strategy", provider: "Univ. of Virginia / Coursera", url: "https://www.coursera.org/learn/uva-darden-business-strategy", free: true }
    ],
    practicalProjects: [
      {
        title: "Comprehensive 3-Year Strategic Business & Expansion Plan",
        description: "Develop an investor-ready business plan for a commercial venture including market size (TAM/SAM/SOM), competitive matrix, GTM strategy, and 3-year P&L model.",
        deliverable: "Structured 15-page Business Plan document (PDF/Notion) with an executive pitch slide deck.",
        skills: ["Business Planning", "Financial Modeling", "GTM Strategy", "Market Sizing"]
      },
      {
        title: "Operational Bottleneck Audit & Workflow Automation Case",
        description: "Analyze a business operational process (e.g. supply chain or customer onboarding), map workflow bottlenecks, and propose an automation blueprint with cost ROI payback.",
        deliverable: "Process flow diagram (BPMN), executive summary report, and spreadsheet payback calculation model.",
        skills: ["Operations Audit", "Process Mapping", "Cost-Benefit Analysis", "Executive Writing"]
      }
    ]
  },

  business_analytics: {
    title: "Business Analyst & Commercial Intelligence Lead",
    domain: "Business Analytics & Decision Science",
    summary: "Bridges the gap between business stakeholders and data, translating operational metrics, sales forecasts, and market trends into actionable executive decisions.",
    typicalRoles: ["Business Analyst (BA)", "Commercial Intelligence Analyst", "Operations Data Analyst", "Business Systems Analyst"],
    salaryRange: "$78,000 - $135,000",
    growthOutlook: "23% growth as businesses across all sectors shift to data-driven operational decision making",
    keySkills: ["Advanced Excel & Financial Modeling", "Power BI / Tableau Visual Analytics", "SQL for Business Intelligence", "Process Flow Diagramming", "Requirement Gathering & User Stories"],
    alternativeTracks: ["Data Analyst", "Product Operations Manager", "Management Consultant"],
    beginnerCourses: [
      { title: "Google Business Intelligence Professional Certificate", provider: "Google / Coursera", url: "https://www.coursera.org/professional-certificates/google-business-intelligence", free: true },
      { title: "Business Analytics: Decision Making Specialization", provider: "Wharton / Coursera", url: "https://www.coursera.org/specializations/business-analytics", free: true },
      { title: "Microsoft Power BI Data Analyst Certification Prep", provider: "Microsoft Learn", url: "https://learn.microsoft.com/en-us/training/paths/data-analytics-microsoft/", free: true },
      { title: "SQL for Business Decision Makers", provider: "Mode Analytics Open Tutorials", url: "https://mode.com/sql-tutorial/", free: true }
    ],
    practicalProjects: [
      {
        title: "Executive KPI & Sales Performance Dashboard in Power BI",
        description: "Build an interactive multi-page Power BI dashboard modeling monthly recurring revenue (MRR), regional cohort performance, and pipeline conversion rates.",
        deliverable: "Public Power BI / Tableau dashboard link with accompanying executive summary highlighting top 3 growth opportunities.",
        skills: ["Power BI", "Data Modeling", "Executive Storytelling", "KPI Architecture"]
      },
      {
        title: "Customer Churn & Unit Economics Financial Model",
        description: "Build a spreadsheet financial model calculating Customer Acquisition Cost (CAC), Lifetime Value (LTV), payback period, and recommendations to reduce churn.",
        deliverable: "Structured Excel / Google Sheets calculation model with dynamic sensitivity toggles and executive report.",
        skills: ["Excel Financial Modeling", "Unit Economics", "Cohort Analysis", "SQL Data Extraction"]
      }
    ]
  },

  digital_marketing_growth: {
    title: "Digital Marketing & Growth Strategist",
    domain: "Marketing, Growth & Brand Strategy",
    summary: "Spearheads digital customer acquisition, optimizes performance marketing funnels across search and social, and scales organic brand presence.",
    typicalRoles: ["Growth Marketer", "Digital Marketing Specialist", "Performance Marketing Lead", "Brand Strategist", "SEO/SEM Manager"],
    salaryRange: "$70,000 - $125,000",
    growthOutlook: "20% growth driven by the digital-first commerce transition and omnichannel branding needs",
    keySkills: ["Performance Marketing (Meta/Google Ads)", "Search Engine Optimization (SEO/SEM)", "Conversion Rate Optimization (CRO)", "Google Analytics 4 & Attribution", "Content & Copywriting Strategy"],
    alternativeTracks: ["Product Marketing Manager", "Social Media Strategist", "E-Commerce Manager"],
    beginnerCourses: [
      { title: "Google Digital Marketing & E-Commerce Certificate", provider: "Google / Coursera", url: "https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce", free: true },
      { title: "Meta Certified Digital Marketing Associate Training", provider: "Meta / Coursera", url: "https://www.coursera.org/learn/meta-social-media-marketing", free: true },
      { title: "Inbound Marketing & Growth Flywheel Certification", provider: "HubSpot Academy", url: "https://academy.hubspot.com/courses/inbound-marketing", free: true },
      { title: "Google Analytics 4 (GA4) Certification", provider: "Google Skillshop", url: "https://skillshop.docebosaas.com/learn/course/overview/ga4", free: true }
    ],
    practicalProjects: [
      {
        title: "Omnichannel Go-To-Market Digital Marketing Campaign",
        description: "Design a full-funnel digital campaign for a consumer product including target customer personas, ad creative copy, channel budget allocation, and target ROAS goals.",
        deliverable: "Comprehensive campaign slide deck with creative ad mockups, keyword plan, and budget forecast sheet.",
        skills: ["Paid Ads Strategy", "Copywriting", "Audience Targeting", "Budget Allocation"]
      },
      {
        title: "Comprehensive SEO & Conversion Audit for an E-Commerce Brand",
        description: "Audit a real-world web platform for on-page SEO, technical indexability, keyword ranking opportunities, and checkout funnel conversion rate optimizations.",
        deliverable: "Documented SEO & CRO audit report with prioritization matrix and wireframe proposals for checkout improvements.",
        skills: ["Technical SEO", "Keyword Research", "CRO & A/B Testing", "GA4 Analytics"]
      }
    ]
  },

  software_engineering: {
    title: "Full-Stack Software Engineer",
    domain: "Software & Web Development",
    summary: "Builds modern, reliable, and scalable web, mobile, and enterprise applications that solve real-world problems for end users.",
    typicalRoles: ["Full-Stack Developer", "Frontend Engineer", "Backend Engineer", "Mobile App Developer"],
    salaryRange: "$85,000 - $145,000",
    growthOutlook: "25% growth over the next decade (Much faster than average)",
    keySkills: ["TypeScript", "React / Next.js", "Node.js", "SQL & Database Design", "Git & REST APIs"],
    alternativeTracks: ["Cloud DevOps Engineer", "Mobile Application Specialist", "Game Designer & Unity / Unreal Developer"],
    beginnerCourses: [
      { title: "CS50: Introduction to Computer Science", provider: "Harvard University / edX", url: "https://cs50.harvard.edu/x/", free: true },
      { title: "Responsive Web Design Certification", provider: "freeCodeCamp", url: "https://www.freecodecamp.org/learn/2022/responsive-web-design/", free: true },
      { title: "The Modern JavaScript Tutorial", provider: "javascript.info", url: "https://javascript.info/", free: true }
    ],
    practicalProjects: [
      {
        title: "Responsive Task & Analytics Dashboard",
        description: "Build an accessible, responsive dashboard in React or Next.js with state filtering, search, and dark mode.",
        deliverable: "Live web application URL and clean GitHub repository with typed components.",
        skills: ["React", "TypeScript", "Tailwind CSS"]
      },
      {
        title: "Secure REST API with JWT Auth and Database",
        description: "Create an Express or Next.js backend with user registration, bcrypt password hashing, JWT tokens, and CRUD endpoints.",
        deliverable: "Working GitHub repository with automated tests and API documentation.",
        skills: ["Node.js", "PostgreSQL / SQLite", "JWT Authentication", "REST APIs"]
      }
    ]
  },

  data_ai: {
    title: "AI & Machine Learning Specialist",
    domain: "Artificial Intelligence & Data Science",
    summary: "Designs predictive models, processes large datasets, and integrates cutting-edge Generative AI and LLM agents into modern workflows.",
    typicalRoles: ["Machine Learning Engineer", "Data Scientist", "AI Application Developer", "Data Analyst"],
    salaryRange: "$95,000 - $160,000",
    growthOutlook: "35% growth (Extremely high demand across all industries)",
    keySkills: ["Python", "PyTorch / TensorFlow", "Pandas & Data Pipelines", "Generative AI / LLMs", "Vector Databases"],
    alternativeTracks: ["Business Analyst & Commercial Intelligence Lead", "Data Platform Engineer", "Quantitative Analyst"],
    beginnerCourses: [
      { title: "Python for Everybody Specialization", provider: "Univ. of Michigan / Coursera", url: "https://www.coursera.org/specializations/python", free: true },
      { title: "Machine Learning Specialization", provider: "DeepLearning.AI / Andrew Ng", url: "https://www.coursera.org/specializations/machine-learning-introduction", free: true },
      { title: "Practical Deep Learning for Coders", provider: "fast.ai", url: "https://course.fast.ai/", free: true }
    ],
    practicalProjects: [
      {
        title: "Exploratory Data Analysis (EDA) on Real-World Dataset",
        description: "Clean messy real-world data, identify statistical patterns, and generate 5 clear insight visualizations.",
        deliverable: "Jupyter Notebook published on GitHub with visual findings and README summary.",
        skills: ["Python", "Pandas", "Matplotlib", "Data Cleaning"]
      },
      {
        title: "Predictive Churn Classification Pipeline",
        description: "Build an end-to-end classifier comparing Random Forest and XGBoost with cross-validation and ROC-AUC metrics.",
        deliverable: "Working Python script with pipeline, model persistence, and evaluation report.",
        skills: ["Scikit-Learn", "Model Evaluation", "Python"]
      }
    ]
  },

  ui_ux_design: {
    title: "Product Designer (UI/UX)",
    domain: "Design & Human-Computer Interaction",
    summary: "Crafts delightful, accessible, and intuitive user experiences, conducting user research and producing beautiful responsive design systems.",
    typicalRoles: ["Product Designer", "UI/UX Designer", "Design Systems Lead", "User Researcher"],
    salaryRange: "$80,000 - $135,000",
    growthOutlook: "18% steady expansion as digital product quality becomes a key differentiator",
    keySkills: ["Figma & Wireframing", "User Research & Usability Testing", "Design Systems", "Prototyping", "HTML/CSS Basics"],
    alternativeTracks: ["Design Technologist", "Frontend UI Developer", "Associate Product Manager (APM)"],
    beginnerCourses: [
      { title: "Google UX Design Professional Certificate (Audit)", provider: "Google / Coursera", url: "https://www.coursera.org/professional-certificates/google-ux-design", free: true },
      { title: "Figma for UI Design Masterclass", provider: "Figma Official Academy", url: "https://help.figma.com/hc/en-us/categories/360002051613-Figma-Design", free: true },
      { title: "Laws of UX Principles", provider: "Jon Yablonski / Open Guide", url: "https://lawsofux.com/", free: true }
    ],
    practicalProjects: [
      {
        title: "Comprehensive Design System & UI Component Kit",
        description: "Create a reusable component kit in Figma featuring auto-layout buttons, modal dialogs, and accessible color tokens.",
        deliverable: "Public Figma community file with components, variants, and documentation.",
        skills: ["Figma", "Design Systems", "Auto-Layout", "Accessibility"]
      },
      {
        title: "User Research Case Study & Interactive Prototype",
        description: "Interview 3 users, create personas and user journey maps, and build a high-fidelity interactive prototype.",
        deliverable: "Case study presentation deck and clickable prototype link ready for review.",
        skills: ["User Research", "Interactive Prototyping", "Wireframing"]
      }
    ]
  },

  cloud_devops: {
    title: "Cloud & DevOps Architect",
    domain: "Infrastructure & Systems Reliability",
    summary: "Automates deployments, orchestrates containerized cloud microservices, and guarantees 99.99% system resilience and continuous delivery.",
    typicalRoles: ["Cloud Engineer", "DevOps Specialist", "Site Reliability Engineer (SRE)", "Platform Engineer"],
    salaryRange: "$90,000 - $155,000",
    growthOutlook: "28% growth due to worldwide enterprise cloud transformation",
    keySkills: ["Docker & Kubernetes", "AWS / GCP Cloud Services", "CI/CD Pipelines (GitHub Actions)", "Terraform (IaC)", "Linux & Networking"],
    alternativeTracks: ["Site Reliability Engineer", "Cybersecurity Specialist", "Systems Administrator"],
    beginnerCourses: [
      { title: "Docker Essentials & Containers for Beginners", provider: "Docker Official Docs", url: "https://docs.docker.com/get-started/", free: true },
      { title: "AWS Cloud Practitioner Essentials", provider: "Amazon Web Services (AWS Skill Builder)", url: "https://aws.amazon.com/training/digital/aws-cloud-practitioner-essentials/", free: true },
      { title: "GitHub Actions CI/CD Workshop", provider: "GitHub Skills", url: "https://skills.github.com/", free: true }
    ],
    practicalProjects: [
      {
        title: "Automated Multi-Stage CI/CD Pipeline",
        description: "Configure GitHub Actions to automatically run unit tests, build a Docker image, and push to container registry.",
        deliverable: "GitHub repository with passing workflow status badge and YAML configs.",
        skills: ["GitHub Actions", "Docker", "CI/CD", "Linux"]
      },
      {
        title: "Infrastructure as Code (IaC) with Terraform",
        description: "Write modular Terraform code to provision a virtual cloud server, security groups, and automated backups.",
        deliverable: "GitHub repository with Terraform configuration files and architecture diagram.",
        skills: ["Terraform", "AWS / Cloud", "Infrastructure as Code"]
      }
    ]
  },

  cybersecurity: {
    title: "Cybersecurity Analyst & Defender",
    domain: "Information Security & Defense",
    summary: "Protects applications, cloud networks, and confidential databases against modern adversarial cyber threats, vulnerabilities, and attacks.",
    typicalRoles: ["Security Analyst", "Penetration Tester", "SOC Analyst", "Cloud Security Engineer"],
    salaryRange: "$88,000 - $150,000",
    growthOutlook: "32% massive growth driven by cyber threats and strict compliance",
    keySkills: ["Network Security & Protocols", "Vulnerability Scanning", "Threat Modeling", "Incident Response", "Linux Forensics"],
    alternativeTracks: ["DevSecOps Engineer", "Compliance & Risk Auditor", "Cloud Security Specialist"],
    beginnerCourses: [
      { title: "Introduction to Cybersecurity", provider: "Cisco Networking Academy", url: "https://www.netacad.com/courses/cybersecurity/introduction-cybersecurity", free: true },
      { title: "Pre-Security Fundamentals Pathway", provider: "TryHackMe", url: "https://tryhackme.com/path/outline/presec", free: true },
      { title: "OWASP Top 10 Web Application Security", provider: "OWASP Foundation", url: "https://owasp.org/www-project-top-ten/", free: true }
    ],
    practicalProjects: [
      {
        title: "Vulnerability Assessment & Network Traffic Audit",
        description: "Scan a simulated local network using Wireshark and Nmap to identify insecure ports and protocols.",
        deliverable: "Comprehensive security audit report with remediation recommendations.",
        skills: ["Nmap", "Wireshark", "Network Security", "Vulnerability Auditing"]
      },
      {
        title: "Web Application Authentication & OWASP Top 10 Defense",
        description: "Audit an intentionally vulnerable web application, demonstrate SQL injection / XSS vulnerabilities, and patch them.",
        deliverable: "GitHub repository with secure patched code and proof-of-defense write-up.",
        skills: ["AppSec", "OWASP Top 10", "SQL Injection Defense", "Security Hardening"]
      }
    ]
  },

  product_management: {
    title: "Associate Product Manager (APM)",
    domain: "Product Strategy & Leadership",
    summary: "Guides product vision from concept to launch, aligning customer desires with engineering execution and business viability.",
    typicalRoles: ["Technical Product Manager", "Associate Product Manager", "Product Owner", "Scrum Master"],
    salaryRange: "$90,000 - $150,000",
    growthOutlook: "20% growth as tech companies prioritize cross-functional velocity",
    keySkills: ["Product Strategy & Roadmapping", "Agile & Scrum Methodologies", "User Discovery", "Data Analytics (SQL/Mixpanel)", "Stakeholder Management"],
    alternativeTracks: ["Business Management & Operations Strategist", "Product Operations Manager", "UX Strategist"],
    beginnerCourses: [
      { title: "Digital Product Management: Modern Fundamentals", provider: "Univ. of Virginia / Coursera", url: "https://www.coursera.org/learn/uva-darden-digital-product-management", free: true },
      { title: "Agile with Atlassian Jira", provider: "Atlassian / Coursera", url: "https://www.coursera.org/learn/agile-atlassian-jira", free: true },
      { title: "Product Analytics Certification", provider: "Mixpanel Official", url: "https://mixpanel.com/learn/", free: true }
    ],
    practicalProjects: [
      {
        title: "End-to-End Product Requirement Document (PRD)",
        description: "Write a comprehensive PRD for a mobile feature, complete with user stories, acceptance criteria, and success metrics.",
        deliverable: "Structured PRD document (Markdown/Notion) detailing user problem, specs, and telemetry KPIs.",
        skills: ["PRD Writing", "User Stories", "Agile Specs", "KPI Definition"]
      },
      {
        title: "RICE Feature Prioritization Framework & Release Roadmap",
        description: "Evaluate 10 feature requests using Reach, Impact, Confidence, and Effort (RICE) to create an MVP release roadmap.",
        deliverable: "Spreadsheet calculation model and executive slide deck justifying roadmap decisions.",
        skills: ["RICE Prioritization", "Roadmapping", "Stakeholder Presentation"]
      }
    ]
  }
};

// ============================================================================
// DOMAIN-SPECIFIC QUESTION BANKS (TAILORED TO STUDENT QUALIFICATION & KEYWORDS)
// ============================================================================

export const BUSINESS_QUESTIONS: Question[] = [
  {
    id: 1,
    prompt: "When an organization faces stagnant growth or declining sales, what is your immediate natural instinct?",
    subtitle: "Understanding your strategic and operational problem-solving style in business",
    options: [
      {
        text: "Analyze financial unit economics, cohort retention, and cost inefficiencies to spot margin leaks.",
        category: "analytics",
        weights: { business_analytics: 3, business_management: 2 }
      },
      {
        text: "Restructure operational workflows, align department leaders, and pitch an expansion roadmap to stakeholders.",
        category: "management",
        weights: { business_management: 3, product_management: 1 }
      },
      {
        text: "Audit marketing channels, revamp ad campaigns, and launch viral social funnels to drive customer acquisition.",
        category: "marketing",
        weights: { digital_marketing_growth: 3, business_management: 1 }
      },
      {
        text: "Interview churned customers, pinpoint product shortcomings, and redesign customer onboarding.",
        category: "product",
        weights: { product_management: 3, business_management: 1 }
      }
    ]
  },
  {
    id: 2,
    prompt: "Which weekend business challenge sounds most energizing and rewarding to you?",
    subtitle: "Identifying your genuine commercial passions and personal drive",
    options: [
      {
        text: "Building an interactive Power BI dashboard tracking sales conversion funnels and customer lifetime value.",
        category: "analytics",
        weights: { business_analytics: 3, business_management: 1 }
      },
      {
        text: "Drafting a comprehensive 3-year strategic business plan for a startup with revenue forecasts and ROI projections.",
        category: "management",
        weights: { business_management: 3, product_management: 1 }
      },
      {
        text: "Running a live performance ad campaign with A/B copy tests to see which headline drives the highest ROAS.",
        category: "marketing",
        weights: { digital_marketing_growth: 3 }
      },
      {
        text: "Drafting a Product Requirement Document (PRD) for a new viral mobile feature and presenting it to engineers.",
        category: "product",
        weights: { product_management: 3, ui_ux_design: 1 }
      }
    ]
  },
  {
    id: 3,
    prompt: "What daily business environment brings out your highest performance?",
    subtitle: "Matching your personal rhythm with commercial workplace roles",
    options: [
      {
        text: "Executive leadership: cross-departmental coordination, stakeholder negotiations, and organizational roadmaps.",
        category: "management",
        weights: { business_management: 3 }
      },
      {
        text: "Analytical deep-dive: dissecting market metrics, building spreadsheet valuation models, and forecasting trends.",
        category: "analytics",
        weights: { business_analytics: 3 }
      },
      {
        text: "High-velocity marketing: launching search and social campaigns, optimizing SEO, and tracking conversions.",
        category: "marketing",
        weights: { digital_marketing_growth: 3 }
      },
      {
        text: "Agile product development: collaborating with designers, developers, and users to ship innovative features.",
        category: "product",
        weights: { product_management: 3 }
      }
    ]
  },
  {
    id: 4,
    prompt: "How do you feel about working with numbers, business metrics, and data spreadsheets?",
    subtitle: "Gauging quantitative comfort for management & analytical roles",
    options: [
      {
        text: "I thrive on financial ratios, CAC/LTV calculations, statistical regression, and balance sheets.",
        category: "analytics",
        weights: { business_analytics: 3, business_management: 2 }
      },
      {
        text: "I prefer using numbers as strategic compass points to make big-picture executive decisions.",
        category: "management",
        weights: { business_management: 3 }
      },
      {
        text: "I focus on marketing telemetry: click-through rates, conversion rates, cost-per-click, and ROAS.",
        category: "marketing",
        weights: { digital_marketing_growth: 3 }
      },
      {
        text: "I focus on user engagement metrics: daily active users (DAU), retention cohorts, and feature adoption.",
        category: "product",
        weights: { product_management: 3 }
      }
    ]
  },
  {
    id: 5,
    prompt: "When an e-commerce platform sees shoppers abandon their carts without purchasing, what bothers you first?",
    subtitle: "Understanding your problem-solving lens for commercial bottlenecks",
    options: [
      {
        text: "The checkout drop-off analytics haven't been tracked or segmented by traffic source.",
        category: "analytics",
        weights: { business_analytics: 3, digital_marketing_growth: 1 }
      },
      {
        text: "Inefficient logistics operations, delayed fulfillment promises, or poor supply chain reliability.",
        category: "management",
        weights: { business_management: 3 }
      },
      {
        text: "Weak retargeting ad funnels, ineffective email recovery drips, and lack of urgency marketing.",
        category: "marketing",
        weights: { digital_marketing_growth: 3 }
      },
      {
        text: "Confusing payment UI, cluttered checkout steps, and lack of intuitive payment options.",
        category: "design",
        weights: { ui_ux_design: 2, product_management: 2 }
      }
    ]
  },
  {
    id: 6,
    prompt: "Which tool or software would you be most eager to spend 10 hours mastering this week?",
    subtitle: "Technical affinity and skill acquisition preference in business",
    options: [
      {
        text: "Microsoft Power BI, advanced Excel financial modeling, and SQL for business queries.",
        category: "analytics",
        weights: { business_analytics: 3 }
      },
      {
        text: "Strategic management frameworks, corporate valuation models, and executive pitch decks.",
        category: "management",
        weights: { business_management: 3 }
      },
      {
        text: "Google Analytics 4, Meta Ads Manager, and modern SEO keyword intelligence platforms.",
        category: "marketing",
        weights: { digital_marketing_growth: 3 }
      },
      {
        text: "Figma design systems, Jira agile roadmapping, and Mixpanel user journey funnels.",
        category: "product",
        weights: { product_management: 3, ui_ux_design: 1 }
      }
    ]
  },
  {
    id: 7,
    prompt: "What type of project deliverable would you feel proudest showcasing to a recruiter or investor?",
    subtitle: "Practical evidence and deliverable alignment",
    options: [
      {
        text: "A comprehensive 15-page Strategic Business Plan with competitive analysis and operational P&L.",
        category: "management",
        weights: { business_management: 3 }
      },
      {
        text: "An interactive commercial intelligence dashboard with drill-down KPIs and revenue scenario models.",
        category: "analytics",
        weights: { business_analytics: 3 }
      },
      {
        text: "A documented growth marketing case study that scaled customer acquisition with a verified 4x ROAS.",
        category: "marketing",
        weights: { digital_marketing_growth: 3 }
      },
      {
        text: "A complete Product Requirement Document (PRD) with user journey maps and release milestones.",
        category: "product",
        weights: { product_management: 3 }
      }
    ]
  },
  {
    id: 8,
    prompt: "What kind of career legacy or long-term achievement excites you most?",
    subtitle: "Long-term ambition and intrinsic motivation",
    options: [
      {
        text: "Leading and scaling a company as a general manager, COO, or strategic business consultant.",
        category: "management",
        weights: { business_management: 3 }
      },
      {
        text: "Uncovering transformative market insights through data that guide multi-million-dollar investments.",
        category: "analytics",
        weights: { business_analytics: 3 }
      },
      {
        text: "Building an iconic brand whose marketing campaigns are celebrated across the global digital landscape.",
        category: "marketing",
        weights: { digital_marketing_growth: 3 }
      },
      {
        text: "Launching iconic digital products that millions of customers rely on every single day.",
        category: "product",
        weights: { product_management: 3 }
      }
    ]
  }
];

export const GAMING_QUESTIONS: Question[] = [
  {
    id: 1,
    prompt: "When playing or analyzing a video game, what instantly grabs your creative attention?",
    subtitle: "Understanding your natural instincts in interactive game design & development",
    options: [
      {
        text: "The physics, player movement mechanics, hitboxes, and code responsiveness.",
        category: "programming",
        weights: { game_development: 3, software_engineering: 2 }
      },
      {
        text: "The visual art direction, 3D character models, atmospheric lighting, and environment textures.",
        category: "art",
        weights: { game_development: 2, ui_ux_design: 3 }
      },
      {
        text: "The progression system, level balancing, reward loops, and quest economy.",
        category: "design",
        weights: { game_development: 3, product_management: 2 }
      },
      {
        text: "The enemy AI decision trees, procedural map generation, and performance optimization.",
        category: "ai_systems",
        weights: { game_development: 2, data_ai: 2, software_engineering: 2 }
      }
    ]
  },
  {
    id: 2,
    prompt: "Which weekend interactive project sounds most exciting to build?",
    subtitle: "Identifying your genuine creative drive in gaming",
    options: [
      {
        text: "Creating a 2D action-platformer in Unity with responsive wall-jumps, particle effects, and combat.",
        category: "programming",
        weights: { game_development: 3, software_engineering: 2 }
      },
      {
        text: "Sculpting a high-detail 3D game asset in Blender and importing it into Unreal Engine 5 with custom shaders.",
        category: "art",
        weights: { game_development: 3, ui_ux_design: 2 }
      },
      {
        text: "Writing a comprehensive Game Design Document (GDD) with level maps, boss mechanics, and lore.",
        category: "design",
        weights: { game_development: 3, product_management: 2 }
      },
      {
        text: "Programming a tactical multiplayer server or live matchmaking leaderboard for a gaming community.",
        category: "systems",
        weights: { software_engineering: 3, cloud_devops: 2 }
      }
    ]
  },
  {
    id: 3,
    prompt: "When you play a poorly crafted game, what ruins the experience first?",
    subtitle: "Understanding your quality standards and attention to detail in games",
    options: [
      {
        text: "Clunky controls, buggy collision detection, and unresponsive character physics.",
        category: "programming",
        weights: { game_development: 3, software_engineering: 1 }
      },
      {
        text: "Cluttered HUD interfaces, ugly fonts, and disorienting camera movements.",
        category: "art",
        weights: { ui_ux_design: 3, game_development: 1 }
      },
      {
        text: "Unfair difficulty spikes, repetitive grinding, and lack of satisfying progression incentives.",
        category: "design",
        weights: { game_development: 3, product_management: 2 }
      },
      {
        text: "Unstable frame rates, stuttering draw calls, and long loading screens.",
        category: "optimization",
        weights: { game_development: 2, cloud_devops: 2, software_engineering: 2 }
      }
    ]
  },
  {
    id: 4,
    prompt: "Which game industry technical skill would you most enjoy mastering over the next month?",
    subtitle: "Skill acquisition preference in game development",
    options: [
      {
        text: "C# scripting in Unity or C++ / Blueprints in Unreal Engine 5 for gameplay mechanics.",
        category: "programming",
        weights: { game_development: 3 }
      },
      {
        text: "3D modeling, texturing, character rigging, and lighting in Blender.",
        category: "art",
        weights: { game_development: 2, ui_ux_design: 3 }
      },
      {
        text: "Level design, spatial layout, storytelling pacing, and player psychological motivation.",
        category: "design",
        weights: { game_development: 3, product_management: 1 }
      },
      {
        text: "Multiplayer netcode, game server architecture, and cloud deployment on AWS/Steam.",
        category: "systems",
        weights: { cloud_devops: 3, software_engineering: 2, game_development: 1 }
      }
    ]
  },
  {
    id: 5,
    prompt: "How do you feel about 3D vectors, physics math, and geometric transformations in games?",
    subtitle: "Gauging quantitative & geometric comfort for game programming vs design",
    options: [
      {
        text: "I enjoy applying vector math, trigonometry, raycasting, and velocity calculations to gameplay.",
        category: "programming",
        weights: { game_development: 3, software_engineering: 2 }
      },
      {
        text: "I prefer visual sculpting, color palettes, aesthetic atmosphere, and sound design over heavy math.",
        category: "art",
        weights: { ui_ux_design: 3, game_development: 2 }
      },
      {
        text: "I prefer calculating player economy spreadsheets, weapon damage scaling, and drop chances.",
        category: "design",
        weights: { game_development: 2, business_analytics: 2, product_management: 2 }
      },
      {
        text: "I enjoy discrete logic, state machines, algorithmic pathfinding (A*), and AI decision algorithms.",
        category: "ai_systems",
        weights: { software_engineering: 2, data_ai: 2, game_development: 2 }
      }
    ]
  },
  {
    id: 6,
    prompt: "What kind of portfolio piece would you feel most accomplished showing to a game studio?",
    subtitle: "Practical evidence deliverable preference in game dev",
    options: [
      {
        text: "A playable WebGL game published on Itch.io with crisp combat mechanics and clean GitHub C# source code.",
        category: "programming",
        weights: { game_development: 3, software_engineering: 2 }
      },
      {
        text: "A 3D playable demo level in Unreal Engine 5 featuring custom lighting, particle FX, and asset shaders.",
        category: "art",
        weights: { game_development: 3, ui_ux_design: 2 }
      },
      {
        text: "A complete Game Design Document (GDD) with weapon balance sheets, level progression, and enemy specs.",
        category: "design",
        weights: { game_development: 3, product_management: 2 }
      },
      {
        text: "A full-stack gaming portal with user authentication, custom player profiles, and real-time leaderboards.",
        category: "systems",
        weights: { software_engineering: 3, cloud_devops: 1 }
      }
    ]
  },
  {
    id: 7,
    prompt: "In an indie or AAA game development studio, which role feels most natural to you?",
    subtitle: "Professional studio team alignment",
    options: [
      {
        text: "Gameplay Programmer: coding character controllers, abilities, weapons, and physics interactions.",
        category: "programming",
        weights: { game_development: 3, software_engineering: 2 }
      },
      {
        text: "Technical Artist / UI Designer: crafting game UI, environmental assets, and immersive visual effects.",
        category: "art",
        weights: { game_development: 2, ui_ux_design: 3 }
      },
      {
        text: "Lead Game Designer / Producer: directing product vision, balancing gameplay loops, and keeping milestones on track.",
        category: "design",
        weights: { game_development: 2, product_management: 3 }
      },
      {
        text: "Engine & Backend Engineer: building smooth network replication, save systems, and platform integrations.",
        category: "systems",
        weights: { software_engineering: 2, cloud_devops: 3, game_development: 1 }
      }
    ]
  },
  {
    id: 8,
    prompt: "What gives you the greatest rush of satisfaction in game creation?",
    subtitle: "Intrinsic motivation and creative payoff",
    options: [
      {
        text: "Watching a player test your prototype, crack a smile, and say 'the controls feel amazing!'",
        category: "programming",
        weights: { game_development: 3 }
      },
      {
        text: "Writing clean, modular code that seamlessly coordinates animations, sound, and physics triggers.",
        category: "engineering",
        weights: { game_development: 3, software_engineering: 2 }
      },
      {
        text: "Seeing a visual world that you dreamed up and sculpted come to life with lighting and sound.",
        category: "art",
        weights: { game_development: 2, ui_ux_design: 3 }
      },
      {
        text: "Balancing a complex game economy so that every decision feels meaningful and thrilling.",
        category: "design",
        weights: { game_development: 2, product_management: 2, business_analytics: 1 }
      }
    ]
  }
];

export const TECH_QUESTIONS: Question[] = [
  {
    id: 1,
    prompt: "When you encounter a technical mystery or system failure, what is your immediate instinct?",
    subtitle: "Core cognitive approach in engineering & computing",
    options: [
      {
        text: "Break it down into code, step through debuggers, and automate a reproducible test case.",
        category: "engineering",
        weights: { software_engineering: 3, cloud_devops: 2 }
      },
      {
        text: "Analyze logs, query data distributions, and calculate statistical probabilities of failure.",
        category: "data",
        weights: { data_ai: 3, software_engineering: 1 }
      },
      {
        text: "Inspect system security logs, identify attack surfaces, and patch vulnerable configurations.",
        category: "security",
        weights: { cybersecurity: 3, cloud_devops: 1 }
      },
      {
        text: "Check cloud infrastructure metrics, container health checks, and server load balancing.",
        category: "devops",
        weights: { cloud_devops: 3, cybersecurity: 1 }
      }
    ]
  },
  {
    id: 2,
    prompt: "Which weekend technical project sounds most exciting and energizing to you?",
    subtitle: "Identifying your genuine engineering passions and personal drive",
    options: [
      {
        text: "Building a full-stack web or mobile application from scratch and deploying it live with a database.",
        category: "engineering",
        weights: { software_engineering: 3, cloud_devops: 1 }
      },
      {
        text: "Training a custom Machine Learning or Generative AI model to analyze datasets or summarize documents.",
        category: "data",
        weights: { data_ai: 3, software_engineering: 1 }
      },
      {
        text: "Simulating a penetration test on a virtual machine and auditing vulnerabilities using OWASP standards.",
        category: "security",
        weights: { cybersecurity: 3, cloud_devops: 1 }
      },
      {
        text: "Configuring a Kubernetes cluster with Terraform and setting up an automated multi-stage CI/CD pipeline.",
        category: "devops",
        weights: { cloud_devops: 3, software_engineering: 1 }
      }
    ]
  },
  {
    id: 3,
    prompt: "What daily work environment allows you to do your highest-impact work?",
    subtitle: "Matching your personal rhythm with engineering demands",
    options: [
      {
        text: "Deep-focus coding sessions with clear specifications, typed schemas, and test suites.",
        category: "engineering",
        weights: { software_engineering: 3 }
      },
      {
        text: "Investigative data research: exploring big data pipelines, testing hypotheses, and training models.",
        category: "data",
        weights: { data_ai: 3 }
      },
      {
        text: "High-stakes infrastructure engineering: ensuring 99.99% uptime, scalability, and automated failover.",
        category: "devops",
        weights: { cloud_devops: 3 }
      },
      {
        text: "Security defense & incident response: auditing networks, hardening protocols, and hunting threats.",
        category: "security",
        weights: { cybersecurity: 3 }
      }
    ]
  },
  {
    id: 4,
    prompt: "How do you feel about mathematics, discrete logic, and quantitative algorithms?",
    subtitle: "Gauging technical depth preference",
    options: [
      {
        text: "I love linear algebra, probability, and calculus; transforming math into machine learning models is exciting.",
        category: "data",
        weights: { data_ai: 3 }
      },
      {
        text: "I enjoy discrete math, Boolean logic, data structures, and algorithmic complexity (Big-O).",
        category: "engineering",
        weights: { software_engineering: 3, cybersecurity: 1 }
      },
      {
        text: "I prefer networking protocols, IP routing, packet inspection, and cryptographic ciphers.",
        category: "security",
        weights: { cybersecurity: 3, cloud_devops: 1 }
      },
      {
        text: "I prefer systems automation, shell scripting, Linux kernel parameters, and infrastructure topologies.",
        category: "devops",
        weights: { cloud_devops: 3 }
      }
    ]
  },
  {
    id: 5,
    prompt: "When you visit a poorly engineered application, what bothers you first?",
    subtitle: "Attention to detail and quality standards in technology",
    options: [
      {
        text: "Laggy UI performance, slow API responses, and unhandled runtime exceptions in console.",
        category: "engineering",
        weights: { software_engineering: 3, cloud_devops: 1 }
      },
      {
        text: "Stale data, lack of personalization, and inaccurate recommendation algorithms.",
        category: "data",
        weights: { data_ai: 3 }
      },
      {
        text: "Insecure forms, lack of HTTPS, exposed auth tokens, or fishy session management.",
        category: "security",
        weights: { cybersecurity: 3 }
      },
      {
        text: "Server 502/504 Bad Gateway errors, downtime spikes, and poor geographical CDN caching.",
        category: "devops",
        weights: { cloud_devops: 3 }
      }
    ]
  },
  {
    id: 6,
    prompt: "Which technology stack would you most eagerly spend 10 hours learning this week?",
    subtitle: "Technical affinity and skill acquisition preference",
    options: [
      {
        text: "Next.js, TypeScript, PostgreSQL, Prisma ORM, and GraphQL API architectures.",
        category: "engineering",
        weights: { software_engineering: 3 }
      },
      {
        text: "PyTorch, Hugging Face Transformers, LangChain, and Vector Databases (pgvector).",
        category: "data",
        weights: { data_ai: 3 }
      },
      {
        text: "Docker, Kubernetes, Terraform Infrastructure as Code (IaC), and AWS Cloud Architecture.",
        category: "devops",
        weights: { cloud_devops: 3 }
      },
      {
        text: "Wireshark packet analysis, Nmap scanning, Metasploit, and OWASP defense hardening.",
        category: "security",
        weights: { cybersecurity: 3 }
      }
    ]
  },
  {
    id: 7,
    prompt: "What project deliverable would you feel proudest showcasing on your GitHub?",
    subtitle: "Practical portfolio evidence preference",
    options: [
      {
        text: "A production full-stack web application with secure auth, relational database, and live deployed URL.",
        category: "engineering",
        weights: { software_engineering: 3 }
      },
      {
        text: "An end-to-end Machine Learning pipeline with cross-validation, model persistence, and evaluation report.",
        category: "data",
        weights: { data_ai: 3 }
      },
      {
        text: "An automated GitHub Actions CI/CD pipeline deploying containerized microservices to cloud clusters.",
        category: "devops",
        weights: { cloud_devops: 3 }
      },
      {
        text: "A comprehensive vulnerability audit report and secure patch repository defending against OWASP Top 10.",
        category: "security",
        weights: { cybersecurity: 3 }
      }
    ]
  },
  {
    id: 8,
    prompt: "What gives you the highest feeling of accomplishment as a technologist?",
    subtitle: "Intrinsic motivation and personal satisfaction",
    options: [
      {
        text: "Shipping clean, bug-free code that executes rapidly, elegantly, and serves real users.",
        category: "engineering",
        weights: { software_engineering: 3 }
      },
      {
        text: "Training a model that uncovers non-obvious patterns in messy data with high predictive accuracy.",
        category: "data",
        weights: { data_ai: 3 }
      },
      {
        text: "Achieving 99.99% uptime on distributed cloud infrastructure during massive traffic spikes.",
        category: "devops",
        weights: { cloud_devops: 3 }
      },
      {
        text: "Defending mission-critical infrastructure against sophisticated penetration attempts and breaches.",
        category: "security",
        weights: { cybersecurity: 3 }
      }
    ]
  }
];

export const GENERAL_QUESTIONS: Question[] = [
  {
    id: 1,
    prompt: "When you encounter a new challenge or mystery, what is your immediate natural instinct?",
    subtitle: "Understanding your core cognitive problem-solving approach",
    options: [
      {
        text: "Break it down into code, logical steps, and build an automated tool to solve it.",
        category: "engineering",
        weights: { software_engineering: 3, game_development: 1, cloud_devops: 1 }
      },
      {
        text: "Analyze the business feasibility, evaluate market demand, and plan a commercial roadmap.",
        category: "business",
        weights: { business_management: 3, product_management: 2, business_analytics: 1 }
      },
      {
        text: "Design an interactive gameplay loop or creative prototype that engages people through play.",
        category: "gaming",
        weights: { game_development: 3, ui_ux_design: 1 }
      },
      {
        text: "Dig into the data, spot statistical patterns, and calculate empirical probabilities.",
        category: "data",
        weights: { data_ai: 3, business_analytics: 2 }
      }
    ]
  },
  {
    id: 2,
    prompt: "Which weekend project sounds most exciting and energizing to you?",
    subtitle: "Identifying your genuine passions and personal drive",
    options: [
      {
        text: "Building a playable 2D/3D game in Unity or Unreal Engine with custom physics and mechanics.",
        category: "gaming",
        weights: { game_development: 3 }
      },
      {
        text: "Drafting a business plan or marketing campaign for a new consumer brand or startup.",
        category: "business",
        weights: { business_management: 3, digital_marketing_growth: 2 }
      },
      {
        text: "Coding a full-stack web or mobile application from scratch and deploying it live.",
        category: "engineering",
        weights: { software_engineering: 3, cloud_devops: 1 }
      },
      {
        text: "Redesigning a clumsy app into an elegant, user-tested Figma prototype with micro-interactions.",
        category: "design",
        weights: { ui_ux_design: 3, product_management: 1 }
      }
    ]
  },
  {
    id: 3,
    prompt: "What type of daily work environment allows you to do your highest-impact work?",
    subtitle: "Matching your personal rhythm with workplace demands",
    options: [
      {
        text: "Creative studio environment: designing interactive game worlds, character loops, and gameplay.",
        category: "gaming",
        weights: { game_development: 3, ui_ux_design: 1 }
      },
      {
        text: "Cross-functional leadership: aligning business operations, pitching to clients, and driving growth.",
        category: "business",
        weights: { business_management: 3, digital_marketing_growth: 1 }
      },
      {
        text: "Deep-focus coding sessions: building scalable software architectures with clear specifications.",
        category: "engineering",
        weights: { software_engineering: 3, cloud_devops: 1 }
      },
      {
        text: "Quantitative investigation: building analytics dashboards and machine learning models from data.",
        category: "data",
        weights: { data_ai: 2, business_analytics: 3 }
      }
    ]
  },
  {
    id: 4,
    prompt: "When you visit a poorly designed digital product or website, what bothers you first?",
    subtitle: "Understanding your quality standards and instinctual attention to detail",
    options: [
      {
        text: "Laggy controls, clunky interaction responsiveness, or sluggish frame rates.",
        category: "gaming_eng",
        weights: { game_development: 2, software_engineering: 2 }
      },
      {
        text: "Poor business value proposition, lack of clear pricing, and weak marketing conversion funnels.",
        category: "business",
        weights: { business_management: 2, digital_marketing_growth: 3 }
      },
      {
        text: "Chaotic visual hierarchy, confusing navigation menus, and inaccessible color contrast.",
        category: "design",
        weights: { ui_ux_design: 3, product_management: 1 }
      },
      {
        text: "Lack of personalization, inaccurate search results, and missing data insights.",
        category: "analytics",
        weights: { business_analytics: 2, data_ai: 2 }
      }
    ]
  },
  {
    id: 5,
    prompt: "Which subject or tool would you most readily spend 10 hours learning this week?",
    subtitle: "Technical affinity and skill acquisition preference",
    options: [
      {
        text: "Unity (C#), Unreal Engine 5 (Blueprints), or 3D asset modeling in Blender.",
        category: "gaming",
        weights: { game_development: 3 }
      },
      {
        text: "Business Strategy, Financial Modeling, and Go-To-Market execution frameworks.",
        category: "business",
        weights: { business_management: 3, digital_marketing_growth: 1 }
      },
      {
        text: "Full-Stack Web Development: Next.js, TypeScript, PostgreSQL, and REST APIs.",
        category: "engineering",
        weights: { software_engineering: 3 }
      },
      {
        text: "Power BI dashboards, Google Analytics 4, and SQL data warehousing.",
        category: "analytics",
        weights: { business_analytics: 3, data_ai: 1 }
      }
    ]
  },
  {
    id: 6,
    prompt: "What type of project deliverable would you feel proudest showcasing to a hiring manager?",
    subtitle: "Practical evidence and deliverable alignment",
    options: [
      {
        text: "A playable game prototype published on Itch.io with crisp mechanics and player controls.",
        category: "gaming",
        weights: { game_development: 3 }
      },
      {
        text: "A strategic business expansion plan or high-converting digital marketing campaign case study.",
        category: "business",
        weights: { business_management: 2, digital_marketing_growth: 3 }
      },
      {
        text: "A deployed web application connected to a live database with automated test coverage.",
        category: "engineering",
        weights: { software_engineering: 3 }
      },
      {
        text: "An interactive analytics dashboard modeling revenue trends and key operational KPIs.",
        category: "analytics",
        weights: { business_analytics: 3, data_ai: 1 }
      }
    ]
  },
  {
    id: 7,
    prompt: "How do you prefer to communicate your ideas and persuade others?",
    subtitle: "Communication style and presentation affinity",
    options: [
      {
        text: "Through interactive playable demos, visual storyboards, and immersive experiences.",
        category: "gaming",
        weights: { game_development: 3, ui_ux_design: 1 }
      },
      {
        text: "Through structured business presentations, ROI projections, and strategic roadmaps.",
        category: "business",
        weights: { business_management: 3, digital_marketing_growth: 1 }
      },
      {
        text: "Through clean code pull requests, technical architecture diagrams, and system specs.",
        category: "engineering",
        weights: { software_engineering: 3, cloud_devops: 1 }
      },
      {
        text: "Through empirical charts, statistical correlation graphs, and data-backed reports.",
        category: "analytics",
        weights: { business_analytics: 2, data_ai: 3 }
      }
    ]
  },
  {
    id: 8,
    prompt: "What kind of long-term career accomplishment inspires you the most?",
    subtitle: "Intrinsic motivation and personal career aspirations",
    options: [
      {
        text: "Publishing a beloved video game or interactive title played by gaming fans worldwide.",
        category: "gaming",
        weights: { game_development: 3 }
      },
      {
        text: "Founding or leading an organization, driving commercial growth, and managing great teams.",
        category: "business",
        weights: { business_management: 3, product_management: 1 }
      },
      {
        text: "Engineering resilient, large-scale software systems that power millions of digital transactions.",
        category: "engineering",
        weights: { software_engineering: 3, cloud_devops: 1 }
      },
      {
        text: "Pioneering intelligent AI models or visual analytics that uncover breakthroughs in data.",
        category: "analytics",
        weights: { data_ai: 3, business_analytics: 2 }
      }
    ]
  }
];

// Default questions for backward compatibility
export const ASSESSMENT_QUESTIONS = GENERAL_QUESTIONS;

// ============================================================================
// PROFILE-AWARE QUESTION SELECTOR
// ============================================================================

export function getQuestionsForProfile(profile?: any): {
  questions: Question[];
  domainLabel: string;
  domainKey: 'business' | 'gaming' | 'tech' | 'general';
} {
  if (!profile) {
    return {
      questions: GENERAL_QUESTIONS,
      domainLabel: "Cross-Discipline Career Discovery Quiz",
      domainKey: 'general',
    };
  }

  const text = [
    profile.qualification || '',
    profile.ambitions || '',
    profile.futureGoals || '',
    ...(profile.skills || []),
    ...(profile.interests || []),
    ...(profile.hobbies || []),
  ].join(' ').toLowerCase();

  const gamingKeywords = [
    'game', 'gaming', 'game dev', 'game developer', 'game design', 'unity', 'unreal',
    'blender', 'gamer', 'playstation', 'level design', 'gameplay', '3d modeling', 'animation'
  ];

  const businessKeywords = [
    'bba', 'mba', 'b.com', 'bcom', 'commerce', 'business', 'management', 'finance',
    'marketing', 'sales', 'human resources', 'hr', 'operations', 'consulting',
    'startup', 'entrepreneur', 'strategy', 'market', 'digital marketing'
  ];

  const techKeywords = [
    'cs', 'cse', 'btech', 'bca', 'mca', 'software', 'coding', 'programmer',
    'full stack', 'fullstack', 'frontend', 'backend', 'developer', 'python',
    'java', 'web dev', 'cyber', 'devops', 'cloud', 'data science'
  ];

  const isGaming = gamingKeywords.some((k) => text.includes(k));
  const isBusiness = businessKeywords.some((k) => text.includes(k));
  const isTech = techKeywords.some((k) => text.includes(k));

  if (isGaming) {
    return {
      questions: GAMING_QUESTIONS,
      domainLabel: "Tailored for Game Development & Interactive Media",
      domainKey: 'gaming',
    };
  }

  if (isBusiness && !isTech) {
    return {
      questions: BUSINESS_QUESTIONS,
      domainLabel: "Tailored for Business, Management & Commerce (BBA / Strategy)",
      domainKey: 'business',
    };
  }

  if (isTech && !isBusiness) {
    return {
      questions: TECH_QUESTIONS,
      domainLabel: "Tailored for Software Engineering & Computing Systems",
      domainKey: 'tech',
    };
  }

  if (isBusiness) {
    return {
      questions: BUSINESS_QUESTIONS,
      domainLabel: "Tailored for Business, Management & Strategy",
      domainKey: 'business',
    };
  }

  if (isTech) {
    return {
      questions: TECH_QUESTIONS,
      domainLabel: "Tailored for Software & Systems Engineering",
      domainKey: 'tech',
    };
  }

  return {
    questions: GENERAL_QUESTIONS,
    domainLabel: "Cross-Discipline Career Discovery Quiz",
    domainKey: 'general',
  };
}
