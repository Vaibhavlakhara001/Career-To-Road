import {
  StudentProfile,
  AssessmentResult,
  CareerRecommendation,
  PersonalizedRoadmap,
  RoadmapMilestone,
} from './types';
import { TRACK_DETAILS } from './assessment-data';

export interface AiGenerationResult<T> {
  data: T;
  engineUsed: 'gemini' | 'heuristic';
  isRealAi: boolean;
  label: string;
}

// Check for live AI key
function getGeminiApiKey(): string | null {
  return process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY || null;
}

async function callGemini(prompt: string, apiKey: string): Promise<string | null> {
  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      console.warn('Gemini API call failed with status:', response.status);
      return null;
    }

    const json = await response.json();
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || null;
  } catch (error) {
    console.error('Gemini call error:', error);
    return null;
  }
}

// ---------------- 1. CAREER RECOMMENDATIONS GENERATOR ----------------
export async function generateCareerRecommendations(
  profile: StudentProfile,
  assessment?: AssessmentResult
): Promise<AiGenerationResult<CareerRecommendation[]>> {
  const apiKey = getGeminiApiKey();

  // If Gemini API is available, try generating tailored advice
  if (apiKey) {
    const prompt = `You are a high-level career counselor for students.
Student Profile:
- Qualification: ${profile.qualification}
- Skills: ${profile.skills.join(', ')}
- Interests: ${profile.interests.join(', ')}
- Hobbies: ${profile.hobbies.join(', ')}
- Ambition: ${profile.ambitions}
- Future Goals: ${profile.futureGoals}
- Dominant Assessment Traits: ${assessment?.dominantTraits?.join(', ') || 'None provided'}

Generate a JSON array of 3 top career recommendations matching this student.
Each item must strictly match this JSON shape:
{
  "id": "string",
  "title": "string",
  "matchScore": number (80-99),
  "domain": "string",
  "explanation": "2-3 sentences explaining why this matches their specific skills and goals",
  "reasons": ["Reason 1 connecting to profile", "Reason 2 connecting to skills", "Reason 3 connecting to ambition/assessment"],
  "requiredSkills": ["skill1", "skill2", "skill3", "skill4"],
  "beginnerCourses": [
    { "title": "string", "provider": "string", "url": "https://...", "free": true }
  ],
  "practicalProjects": [
    { "title": "string", "description": "string", "deliverable": "string", "skills": ["skill1", "skill2"] }
  ],
  "typicalRoles": ["role1", "role2"],
  "salaryRange": "e.g. $80,000 - $130,000",
  "growthOutlook": "e.g. 25% growth over next 10 years",
  "alternativeOptions": ["alt1", "alt2"]
}
Return ONLY valid JSON array without any markdown wrappers or backticks.`;

    const rawResponse = await callGemini(prompt, apiKey);
    if (rawResponse) {
      try {
        const cleaned = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned) as CareerRecommendation[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          return {
            data: parsed,
            engineUsed: 'gemini',
            isRealAi: true,
            label: 'AI Recommendation (Powered by Gemini 1.5 Flash)',
          };
        }
      } catch (e) {
        console.warn('Failed parsing Gemini recommendations JSON, falling back to heuristic engine.');
      }
    }
  }

  // HEURISTIC DETERMINISTIC ENGINE (Keyword-Aware & Domain-Adaptive)
  const skillsLower = (profile.skills || []).map((s) => s.toLowerCase());
  const interestsLower = (profile.interests || []).map((i) => i.toLowerCase());
  const hobbiesLower = (profile.hobbies || []).map((h) => h.toLowerCase());
  const qualificationLower = (profile.qualification || '').toLowerCase();
  const ambitionsLower = (profile.ambitions || '').toLowerCase();
  const futureGoalsLower = (profile.futureGoals || '').toLowerCase();

  const allProfileKeywords = [
    qualificationLower,
    ambitionsLower,
    futureGoalsLower,
    ...skillsLower,
    ...interestsLower,
    ...hobbiesLower,
  ].join(' ');

  const scoredTracks: { trackKey: string; score: number }[] = [];

  for (const [key, track] of Object.entries(TRACK_DETAILS)) {
    let score = 65; // base baseline

    // 1. KEYWORD & QUALIFICATION DOMAIN RECOGNITION
    if (key === 'game_development') {
      const gameKeywords = ['game', 'gaming', 'unity', 'unreal', 'blender', 'gamer', 'level design', 'gameplay', 'game dev', 'game developer', '3d modeling', 'animation'];
      if (gameKeywords.some((k) => allProfileKeywords.includes(k))) score += 20;
      if (ambitionsLower.includes('game') || ambitionsLower.includes('gaming')) score += 12;
      if (interestsLower.some((i) => i.includes('game'))) score += 10;
      if (skillsLower.some((s) => s.includes('game') || s.includes('gaming') || s.includes('graphic'))) score += 8;
      if (hobbiesLower.some((h) => h.includes('game') || h.includes('gaming'))) score += 6;
    }

    if (key === 'business_management') {
      const bizKeywords = ['bba', 'mba', 'b.com', 'bcom', 'commerce', 'business', 'management', 'operations', 'finance', 'strategy', 'consulting', 'startup', 'entrepreneur', 'corporate'];
      if (bizKeywords.some((k) => allProfileKeywords.includes(k))) score += 20;
      if (qualificationLower.includes('bba') || qualificationLower.includes('mba') || qualificationLower.includes('b.com')) score += 14;
      if (ambitionsLower.includes('business') || ambitionsLower.includes('manager') || ambitionsLower.includes('management') || ambitionsLower.includes('entrepreneur')) score += 12;
      if (interestsLower.some((i) => i.includes('business') || i.includes('management') || i.includes('startup'))) score += 8;
    }

    if (key === 'business_analytics') {
      const baKeywords = ['analytics', 'analyst', 'power bi', 'tableau', 'excel', 'data', 'bi', 'business intelligence', 'market research'];
      if (baKeywords.some((k) => allProfileKeywords.includes(k))) score += 20;
      if (qualificationLower.includes('bba') || qualificationLower.includes('b.com') || qualificationLower.includes('economics')) score += 10;
      if (skillsLower.some((s) => s.includes('excel') || s.includes('analytics') || s.includes('power bi') || s.includes('sql'))) score += 10;
    }

    if (key === 'digital_marketing_growth') {
      const mktKeywords = ['marketing', 'digital marketing', 'growth', 'brand', 'seo', 'advertising', 'social media', 'content', 'sem', 'sales'];
      if (mktKeywords.some((k) => allProfileKeywords.includes(k))) score += 20;
      if (qualificationLower.includes('bba') || qualificationLower.includes('mass com') || qualificationLower.includes('media')) score += 10;
      if (interestsLower.some((i) => i.includes('marketing') || i.includes('social media') || i.includes('brand'))) score += 10;
    }

    if (key === 'product_management') {
      const pmKeywords = ['product', 'pm', 'apm', 'agile', 'scrum', 'user research', 'feature', 'startup'];
      if (pmKeywords.some((k) => allProfileKeywords.includes(k))) score += 16;
      if (qualificationLower.includes('bba') || qualificationLower.includes('btech') || qualificationLower.includes('mba')) score += 6;
      if (ambitionsLower.includes('product') || ambitionsLower.includes('startup')) score += 10;
    }

    if (key === 'software_engineering') {
      const seKeywords = ['cs', 'cse', 'btech', 'bca', 'mca', 'software', 'coding', 'programmer', 'full stack', 'fullstack', 'frontend', 'backend', 'web dev', 'developer', 'react', 'javascript', 'python', 'java'];
      if (seKeywords.some((k) => allProfileKeywords.includes(k))) score += 20;
      if (qualificationLower.includes('cs') || qualificationLower.includes('cse') || qualificationLower.includes('btech') || qualificationLower.includes('bca')) score += 12;
      if (ambitionsLower.includes('software') || ambitionsLower.includes('developer') || ambitionsLower.includes('engineer')) score += 10;
    }

    if (key === 'data_ai') {
      const aiKeywords = ['ai', 'machine learning', 'data science', 'deep learning', 'pytorch', 'python', 'pandas', 'neural'];
      if (aiKeywords.some((k) => allProfileKeywords.includes(k))) score += 20;
      if (interestsLower.some((i) => i.includes('ai') || i.includes('machine learning') || i.includes('data science'))) score += 12;
    }

    if (key === 'ui_ux_design') {
      const designKeywords = ['design', 'graphic', 'ui', 'ux', 'figma', 'art', 'creative', 'visual'];
      if (designKeywords.some((k) => allProfileKeywords.includes(k))) score += 20;
      if (skillsLower.some((s) => s.includes('design') || s.includes('graphic') || s.includes('art') || s.includes('figma'))) score += 12;
    }

    if (key === 'cloud_devops') {
      const cloudKeywords = ['cloud', 'devops', 'aws', 'docker', 'kubernetes', 'linux', 'infrastructure'];
      if (cloudKeywords.some((k) => allProfileKeywords.includes(k))) score += 20;
    }

    if (key === 'cybersecurity') {
      const secKeywords = ['security', 'cyber', 'hack', 'ethical hacking', 'network', 'owasp', 'penetration testing'];
      if (secKeywords.some((k) => allProfileKeywords.includes(k))) score += 20;
    }

    // 2. SPECIFIC SKILL MATCHES
    track.keySkills.forEach((skill) => {
      const s = skill.toLowerCase();
      if (skillsLower.some((userSkill) => userSkill.includes(s) || s.includes(userSkill))) {
        score += 6;
      }
    });

    // 3. INTEREST MATCHES
    if (interestsLower.some((i) => track.domain.toLowerCase().includes(i) || track.title.toLowerCase().includes(i))) {
      score += 8;
    }

    // 4. ASSESSMENT RESULTS INTEGRATION
    if (assessment && assessment.scores) {
      const traitScore = assessment.scores[key] || 0;
      score += Math.min(traitScore * 2, 18);
    }

    scoredTracks.push({
      trackKey: key,
      score: Math.min(Math.round(score), 98),
    });
  }

  // Sort by highest score
  scoredTracks.sort((a, b) => b.score - a.score);

  const top3 = scoredTracks.slice(0, 3);
  const recommendations: CareerRecommendation[] = top3.map((item, idx) => {
    const track = TRACK_DETAILS[item.trackKey];
    const reasons: string[] = [];

    if (profile.qualification) {
      reasons.push(`Academic Alignment: Directly leverages your coursework and foundational study in "${profile.qualification}".`);
    } else {
      reasons.push(`Accessible Entry: Features open entry pathways and high industry acceptance for portfolio-driven applicants.`);
    }

    const matchingSkills = track.keySkills.filter((sk) =>
      skillsLower.some((us) => us.includes(sk.toLowerCase()) || sk.toLowerCase().includes(us))
    );
    if (matchingSkills.length > 0) {
      reasons.push(`Skill Transferability: Directly capitalizes on your demonstrated competencies in ${matchingSkills.join(', ')}.`);
    } else {
      reasons.push(`High Skill ROI: Learning ${track.keySkills.slice(0, 2).join(' & ')} unlocks immediate practical employment opportunities.`);
    }

    if (profile.ambitions) {
      reasons.push(`Ambition Synergy: Provides a realistic, milestone-based pathway to achieve your ambition: "${profile.ambitions}".`);
    } else if (profile.futureGoals) {
      reasons.push(`Future Goal Fit: Aligns directly with your long-term focus on "${profile.futureGoals}".`);
    } else {
      reasons.push(`Growth Trajectory: Exceptional long-term industry outlook with ${track.growthOutlook}.`);
    }

    if (assessment && assessment.dominantTraits && assessment.dominantTraits.length > 0) {
      reasons.push(`Aptitude Assessment Match: Strongly reinforced by your assessment results indicating natural affinity for ${assessment.dominantTraits.slice(0, 2).join(' & ')}.`);
    } else if (profile.interests && profile.interests.length > 0) {
      reasons.push(`Interest Synergy: Intersects directly with your stated interest in ${profile.interests.slice(0, 2).join(' & ')}.`);
    }

    return {
      id: `rec-${item.trackKey}-${idx}`,
      title: track.title,
      matchScore: item.score,
      domain: track.domain,
      explanation: `Based on your qualification in ${profile.qualification || 'your program'} and demonstrated affinity for ${track.keySkills.slice(0, 3).join(', ')}, this path strongly aligns with your goal: "${profile.ambitions || 'advancing your career'}".`,
      reasons,
      requiredSkills: track.keySkills,
      beginnerCourses: track.beginnerCourses || [],
      practicalProjects: track.practicalProjects || [],
      typicalRoles: track.typicalRoles,
      salaryRange: track.salaryRange,
      growthOutlook: track.growthOutlook,
      alternativeOptions: track.alternativeTracks,
      isRefinedByAssessment: Boolean(assessment && assessment.dominantTraits && assessment.dominantTraits.length > 0),
    };
  });

  const isRefined = Boolean(assessment && assessment.dominantTraits && assessment.dominantTraits.length > 0);

  return {
    data: recommendations,
    engineUsed: 'heuristic',
    isRealAi: false,
    label: isRefined
      ? 'Refined Career Engine (Personalized with Assessment & Profile)'
      : 'Standard Career Engine (Profile-Based Matching)',
  };
}

// ---------------- 2. ROADMAP GENERATOR ----------------
export async function generateRoadmap(
  careerTitle: string,
  userId: string,
  profile?: StudentProfile
): Promise<AiGenerationResult<PersonalizedRoadmap>> {
  const apiKey = getGeminiApiKey();

  if (apiKey) {
    const prompt = `Create a structured 4-milestone practical learning roadmap for a student aspiring to become a: "${careerTitle}".
Student profile details:
- Current qualification: ${profile?.qualification || 'Undergraduate'}
- Existing skills: ${profile?.skills?.join(', ') || 'Beginner/Intermediate'}
- Ambition: ${profile?.ambitions || 'Job readiness'}

Return strictly JSON with this exact structure:
{
  "overview": "2-3 sentences overview of the learning journey",
  "milestones": [
    {
      "id": "m1",
      "order": 1,
      "title": "Milestone title",
      "description": "Milestone description",
      "estimatedWeeks": 3,
      "courses": [
        { "title": "Course Title", "provider": "Provider Name", "url": "https://...", "free": true }
      ],
      "resources": [
        { "title": "Resource title", "type": "Documentation" | "Video Tutorial" | "Interactive Sandbox" | "Article" | "Cheatsheet", "url": "https://..." }
      ],
      "tasks": [
        {
          "title": "Practical Task Title",
          "description": "Specific project task instructions",
          "practicalGoal": "Concrete deliverable (e.g. GitHub repository or Business Plan)",
          "skills": ["Skill1", "Skill2"]
        }
      ]
    }
  ]
}
Return ONLY valid JSON without any markdown formatting or commentary.`;

    const rawResponse = await callGemini(prompt, apiKey);
    if (rawResponse) {
      try {
        const cleaned = rawResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleaned);
        if (parsed.milestones && Array.isArray(parsed.milestones)) {
          const roadmap: PersonalizedRoadmap = {
            id: `roadmap-${Date.now()}`,
            userId,
            careerTitle,
            generatedAt: new Date().toISOString(),
            overview: parsed.overview || `Personalized curriculum designed to bridge your current level to professional ${careerTitle} readiness.`,
            milestones: parsed.milestones,
          };
          return {
            data: roadmap,
            engineUsed: 'gemini',
            isRealAi: true,
            label: 'AI Roadmap (Generated by Gemini 1.5 Flash)',
          };
        }
      } catch (e) {
        console.warn('Failed parsing Gemini roadmap JSON, using curriculum blueprint.');
      }
    }
  }

  // HEURISTIC CURRICULUM BLUEPRINTS
  const titleLower = careerTitle.toLowerCase();
  const isGameDev = titleLower.includes('game') || titleLower.includes('unity') || titleLower.includes('unreal');
  const isBusinessManagement = titleLower.includes('management') || titleLower.includes('operations') || titleLower.includes('strategy') || titleLower.includes('business administration');
  const isBusinessAnalytics = titleLower.includes('analytics') || titleLower.includes('business analyst') || titleLower.includes('commercial intelligence');
  const isMarketing = titleLower.includes('marketing') || titleLower.includes('growth') || titleLower.includes('brand');
  const isProduct = titleLower.includes('product') || titleLower.includes('apm');
  const isDataAI = titleLower.includes('data') || titleLower.includes('ai') || titleLower.includes('machine');
  const isDesign = titleLower.includes('design') || titleLower.includes('ui') || titleLower.includes('ux');
  const isDevops = titleLower.includes('devops') || titleLower.includes('cloud');
  const isSecurity = titleLower.includes('security') || titleLower.includes('cyber');

  let milestones: RoadmapMilestone[] = [];

  if (isGameDev) {
    milestones = [
      {
        id: 'm-1',
        order: 1,
        title: 'Game Engine Fundamentals & 2D Scripting in Unity',
        description: 'Master C# game scripting, player movement physics, tilemaps, collision events, and basic gameplay loops in Unity.',
        estimatedWeeks: 3,
        courses: [
          { title: "CS50's Introduction to Game Development", provider: 'Harvard University / edX', url: 'https://cs50.harvard.edu/games/', free: true },
          { title: 'Unity Essentials & Junior Programmer Pathway', provider: 'Unity Learn', url: 'https://learn.unity.com/pathway/junior-programmer', free: true }
        ],
        resources: [
          { title: 'Unity Manual & C# Scripting API', type: 'Documentation', url: 'https://docs.unity3d.com/Manual/' },
          { title: 'Brackeys Game Development Tutorials Archive', type: 'Video Tutorial', url: 'https://www.youtube.com/@Brackeys' }
        ],
        tasks: [
          {
            title: '2D Physics Platformer with Player Mechanics',
            description: 'Build a 2D platformer in Unity featuring double-jump, wall-climb, hazard triggers, and coin collection mechanics.',
            practicalGoal: 'Playable WebGL game published on Itch.io with clean GitHub repository containing typed C# scripts.',
            skills: ['Unity (C#)', 'Physics 2D', 'Input System', 'Game Mechanics']
          }
        ]
      },
      {
        id: 'm-2',
        order: 2,
        title: '3D Math, Vector Physics & Asset Integration in Blender',
        description: 'Understand 3D coordinate space, vector mathematics, raycasting, character controllers, and importing custom 3D models from Blender.',
        estimatedWeeks: 4,
        courses: [
          { title: 'Blender 3D Modeling for Game Assets', provider: 'Blender Studio', url: 'https://cloud.blender.org/training/', free: true },
          { title: '3D Math & Physics in Unity', provider: 'Unity Learn', url: 'https://learn.unity.com/', free: true }
        ],
        resources: [
          { title: '3D Vector & Quaternion Transformation Guide', type: 'Cheatsheet', url: 'https://docs.unity3d.com/ScriptReference/Quaternion.html' },
          { title: 'Poly Pizza Free Low-Poly Game Assets', type: 'Interactive Sandbox', url: 'https://poly.pizza/' }
        ],
        tasks: [
          {
            title: '3D Combat Arena with Particle FX & Sound Triggers',
            description: 'Develop a 3D third-person arena prototype where the player navigates obstacles, triggers sound effects, and defeats enemy target dummies.',
            practicalGoal: 'Playable build and video walkthrough showcasing custom Blender models and responsive C# controls.',
            skills: ['3D Vector Math', 'Blender', 'Character Locomotion', 'Particle Systems']
          }
        ]
      },
      {
        id: 'm-3',
        order: 3,
        title: 'Unreal Engine 5: Blueprints, Nanite & Enemy AI',
        description: 'Transition into AAA engine workflows with Unreal Engine 5, using Blueprints for visual gameplay scripting, Lumen lighting, and AI behavior trees.',
        estimatedWeeks: 4,
        courses: [
          { title: 'Unreal Engine 5: Fundamentals for Beginners', provider: 'Epic Games Dev Community', url: 'https://dev.epicgames.com/community/learning', free: true },
          { title: 'AI Behavior Trees & Navigation in UE5', provider: 'Unreal Engine Documentation', url: 'https://docs.unrealengine.com/5.0/en-US/artificial-intelligence-in-unreal-engine/', free: true }
        ],
        resources: [
          { title: 'Unreal Engine 5 Blueprint Best Practices', type: 'Article', url: 'https://dev.epicgames.com/' },
          { title: 'Epic Games Free Marketplace Assets', type: 'Interactive Sandbox', url: 'https://www.unrealengine.com/marketplace' }
        ],
        tasks: [
          {
            title: '3D Exploration & AI Encounter Prototype in UE5',
            description: 'Create an environment prototype in UE5 featuring Lumen dynamic lighting, modular inventory system, and an enemy that patrols and chases using AI behavior trees.',
            practicalGoal: 'Packaged executable build for Windows/Mac accompanied by Blueprint architecture breakdown.',
            skills: ['Unreal Engine 5', 'Blueprints', 'Enemy AI Trees', 'Lumen & Lighting']
          }
        ]
      },
      {
        id: 'm-4',
        order: 4,
        title: 'Game Feel, Audio Design, Optimization & Public Release',
        description: 'Fine-tune screen shake, juice, audio spatialization, frame rate draw call optimizations, and publish your flagship portfolio game.',
        estimatedWeeks: 3,
        courses: [
          { title: 'Game Design Principles & Player Experience', provider: 'CalArts / Coursera', url: 'https://www.coursera.org/learn/game-design', free: true },
          { title: 'Game Optimization & Profiling in Unity/Unreal', provider: 'Unity Official Guide', url: 'https://unity.com/how-to/optimize-game-performance', free: true }
        ],
        resources: [
          { title: 'The Art of Screen Shake & Game Juice', type: 'Article', url: 'https://www.youtube.com/watch?v=AJdEqssNZ-U' },
          { title: 'Itch.io Developer Publishing Documentation', type: 'Documentation', url: 'https://itch.io/docs/creators' }
        ],
        tasks: [
          {
            title: 'Flagship Indie Game Release & Post-Mortem',
            description: 'Publish your complete multi-level game on Itch.io complete with thumbnail art, trailer video, instructions, and write a technical post-mortem on your design process.',
            practicalGoal: 'Live public Itch.io game page URL with play counts, user ratings, and GitHub source code repository.',
            skills: ['Game Publishing', 'Optimization', 'Audio Integration', 'Portfolio Presentation']
          }
        ]
      }
    ];
  } else if (isBusinessManagement) {
    milestones = [
      {
        id: 'm-1',
        order: 1,
        title: 'Foundations of Business Strategy & Corporate Operations',
        description: 'Understand strategic analysis frameworks, value chain positioning, SWOT/PESTEL analysis, and operational organizational models.',
        estimatedWeeks: 3,
        courses: [
          { title: 'Foundations of Business Strategy', provider: 'Univ. of Virginia / Coursera', url: 'https://www.coursera.org/learn/uva-darden-business-strategy', free: true },
          { title: 'Introduction to Operations Management', provider: 'Wharton / Coursera', url: 'https://www.coursera.org/learn/wharton-operations', free: true }
        ],
        resources: [
          { title: 'Harvard Business Review Strategy Classics', type: 'Article', url: 'https://hbr.org/topic/strategy' },
          { title: 'Business Model Canvas Strategyzer Guide', type: 'Cheatsheet', url: 'https://www.strategyzer.com/canvas' }
        ],
        tasks: [
          {
            title: 'Comprehensive Business Model Canvas & TAM Sizing',
            description: 'Select an emerging industry (e.g. EV logistics or AI SaaS). Conduct TAM/SAM/SOM market sizing, complete a Business Model Canvas, and draft a competitive differentiation report.',
            practicalGoal: 'Professional 10-slide strategy deck and market feasibility report document.',
            skills: ['Business Model Canvas', 'Market Sizing', 'Competitive Strategy', 'Slide Storytelling']
          }
        ]
      },
      {
        id: 'm-2',
        order: 2,
        title: 'Corporate Financial Modeling, Budgeting & Valuation',
        description: 'Master income statements, cash flow modeling, capital budgeting, and unit economics calculations in spreadsheet models.',
        estimatedWeeks: 4,
        courses: [
          { title: 'Corporate Financial Decision Making', provider: 'Yale University / Coursera', url: 'https://www.coursera.org/learn/financial-markets-global', free: true },
          { title: 'Financial Accounting Fundamentals', provider: 'Wharton / Coursera', url: 'https://www.coursera.org/learn/wharton-accounting', free: true }
        ],
        resources: [
          { title: 'Corporate Finance Institute (CFI) Modeling Best Practices', type: 'Article', url: 'https://corporatefinanceinstitute.com/' },
          { title: 'Financial Statement Analysis Cheat Sheet', type: 'Cheatsheet', url: 'https://corporatefinanceinstitute.com/resources/accounting/' }
        ],
        tasks: [
          {
            title: '3-Year Commercial Financial Forecast & P&L Model',
            description: 'Build a dynamic 3-statement financial forecast model in Excel/Google Sheets with revenue drivers, headcount expense modeling, and sensitivity analysis.',
            practicalGoal: 'Working spreadsheet model with scenario toggles (Bear/Base/Bull) and executive memo.',
            skills: ['Financial Modeling', 'Excel', 'Cash Flow Analysis', 'Sensitivity Forecasting']
          }
        ]
      },
      {
        id: 'm-3',
        order: 3,
        title: 'Process Optimization, Workflow Audits & Change Management',
        description: 'Map operational bottlenecks, eliminate supply chain friction, implement lean principles, and align cross-functional business teams.',
        estimatedWeeks: 4,
        courses: [
          { title: 'Strategic Leadership and Business Execution', provider: 'Univ. of Illinois / Coursera', url: 'https://www.coursera.org/specializations/strategic-leadership', free: true },
          { title: 'Process Improvement and Lean Operations', provider: 'Coursera', url: 'https://www.coursera.org/', free: true }
        ],
        resources: [
          { title: 'McKinsey Operations Insights & Case Studies', type: 'Article', url: 'https://www.mckinsey.com/capabilities/operations/our-insights' },
          { title: 'BPMN 2.0 Process Mapping Guide', type: 'Documentation', url: 'https://www.bpmn.org/' }
        ],
        tasks: [
          {
            title: 'Operational Workflow Bottleneck Audit & ROI Case',
            description: 'Analyze an operational business process (e.g. vendor fulfillment or onboarding), map inefficiencies using BPMN diagramming, and calculate cost savings of automation.',
            practicalGoal: 'BPMN process map diagram, executive audit memo, and ROI payback calculation model.',
            skills: ['Process Mapping', 'Operations Auditing', 'Cost-Benefit Analysis', 'Lean Six Sigma']
          }
        ]
      },
      {
        id: 'm-4',
        order: 4,
        title: 'Executive Pitch, Go-To-Market Execution & Capstone Plan',
        description: 'Synthesize strategy, finance, operations, and leadership into an investor-ready business plan ready for executive review.',
        estimatedWeeks: 3,
        courses: [
          { title: 'High-Performance Leadership & Stakeholder Management', provider: 'Univ. of Michigan / Coursera', url: 'https://www.coursera.org/learn/leading-teams', free: true }
        ],
        resources: [
          { title: 'Sequoia Capital Pitch Deck Framework', type: 'Article', url: 'https://www.sequoiacap.com/article/writing-a-business-plan/' }
        ],
        tasks: [
          {
            title: 'Investor-Ready Business Plan & Strategic Executive Deck',
            description: 'Author a complete 15-page Strategic Business Plan detailing market problem, operational solution, financial projections, team roadmap, and risk mitigations.',
            practicalGoal: 'Comprehensive Business Plan document (PDF/Notion) with an executive 12-slide pitch deck.',
            skills: ['Executive Writing', 'Pitch Decks', 'Strategic Planning', 'Stakeholder Management']
          }
        ]
      }
    ];
  } else if (isBusinessAnalytics) {
    milestones = [
      {
        id: 'm-1',
        order: 1,
        title: 'Spreadsheet Modeling & Commercial Metric Architecture',
        description: 'Master advanced Excel functions (INDEX/MATCH, XLOOKUP, dynamic arrays, pivot modeling) and commercial KPI frameworks.',
        estimatedWeeks: 3,
        courses: [
          { title: 'Excel Skills for Business: Advanced', provider: 'Macquarie Univ / Coursera', url: 'https://www.coursera.org/learn/excel-advanced', free: true },
          { title: 'Business Analytics: Decision Making Specialization', provider: 'Wharton / Coursera', url: 'https://www.coursera.org/specializations/business-analytics', free: true }
        ],
        resources: [
          { title: 'Microsoft Excel Data Analysis Documentation', type: 'Documentation', url: 'https://support.microsoft.com/excel' },
          { title: 'Commercial SaaS Metrics & Benchmarks Guide', type: 'Article', url: 'https://www.bain.com/' }
        ],
        tasks: [
          {
            title: 'Commercial Sales & Margin Analysis Spreadsheet',
            description: 'Analyze 10,000+ sales transaction rows. Calculate product margin distributions, identify discount leakage, and generate executive summaries with pivot charts.',
            practicalGoal: 'Structured spreadsheet workbook with dynamic pivot models and executive insights memo.',
            skills: ['Excel Advanced', 'Data Cleansing', 'Pivot Modeling', 'Variance Analysis']
          }
        ]
      },
      {
        id: 'm-2',
        order: 2,
        title: 'SQL for Business Intelligence & Database Analytics',
        description: 'Write complex SQL queries (multi-table JOINs, subqueries, CASE WHEN, and window functions) to answer commercial questions.',
        estimatedWeeks: 4,
        courses: [
          { title: 'SQL for Business Decision Makers', provider: 'Mode Analytics Tutorials', url: 'https://mode.com/sql-tutorial/', free: true },
          { title: 'Relational Database Design & SQL', provider: 'Coursera', url: 'https://www.coursera.org/', free: true }
        ],
        resources: [
          { title: 'SQL Window Functions Interactive Guide', type: 'Interactive Sandbox', url: 'https://sqlzoo.net/' },
          { title: 'Mode SQL Analytics Cheatsheet', type: 'Cheatsheet', url: 'https://mode.com/' }
        ],
        tasks: [
          {
            title: 'Customer Churn & Cohort Retention SQL Pipeline',
            description: 'Write SQL queries calculating monthly cohort retention rates, Customer Lifetime Value (LTV), and segmenting users by purchase frequency.',
            practicalGoal: 'Clean SQL script repository on GitHub accompanied by data schema ERD and visual retention curves.',
            skills: ['SQL', 'Cohort Analysis', 'Window Functions', 'Relational Modeling']
          }
        ]
      },
      {
        id: 'm-3',
        order: 3,
        title: 'Interactive Visual Analytics with Power BI & Tableau',
        description: 'Transform raw data into beautiful, interactive executive dashboards with DAX measures, automated data feeds, and drilldowns.',
        estimatedWeeks: 4,
        courses: [
          { title: 'Google Business Intelligence Professional Certificate', provider: 'Google / Coursera', url: 'https://www.coursera.org/professional-certificates/google-business-intelligence', free: true },
          { title: 'Microsoft Power BI Data Analyst Certification Prep', provider: 'Microsoft Learn', url: 'https://learn.microsoft.com/en-us/training/paths/data-analytics-microsoft/', free: true }
        ],
        resources: [
          { title: 'DAX Function Reference Guide', type: 'Documentation', url: 'https://dax.guide/' },
          { title: 'Storytelling with Data Best Practices', type: 'Article', url: 'https://www.storytellingwithdata.com/' }
        ],
        tasks: [
          {
            title: 'Executive KPI & Revenue Dashboard in Power BI',
            description: 'Build an interactive 3-page Power BI dashboard modeling monthly revenue, regional conversion rates, and sales rep pipeline quotas.',
            practicalGoal: 'Public Power BI / Tableau dashboard link and accompanying slide deck explaining findings.',
            skills: ['Power BI', 'DAX Measures', 'Dashboard Design', 'Data Storytelling']
          }
        ]
      },
      {
        id: 'm-4',
        order: 4,
        title: 'Predictive Forecasting, Business Cases & Consulting Capstone',
        description: 'Apply regression forecasting, evaluate unit economics, build business cases, and present recommendations to stakeholders.',
        estimatedWeeks: 3,
        courses: [
          { title: 'Predictive Analytics for Business Decision Makers', provider: 'Univ. of Virginia / Coursera', url: 'https://www.coursera.org/', free: true }
        ],
        resources: [
          { title: 'Consulting Case Interview Analysis Methods', type: 'Article', url: 'https://www.caseinterview.com/' }
        ],
        tasks: [
          {
            title: 'Commercial Growth Strategy Presentation with Data Proof',
            description: 'Synthesize data analysis into an actionable business proposal: identify a $1M+ operational opportunity, back it with data visualizations, and outline an implementation plan.',
            practicalGoal: 'Executive presentation deck (PDF/Slides) with analytical appendices and spreadsheet models.',
            skills: ['Executive Presentations', 'Predictive Modeling', 'Business Cases', 'Strategic Recommendations']
          }
        ]
      }
    ];
  } else if (isMarketing) {
    milestones = [
      {
        id: 'm-1',
        order: 1,
        title: 'Inbound Marketing, Brand Strategy & Content Architecture',
        description: 'Understand the inbound marketing flywheel, buyer persona creation, value propositions, and organic content funnels.',
        estimatedWeeks: 3,
        courses: [
          { title: 'Inbound Marketing & Growth Flywheel Certification', provider: 'HubSpot Academy', url: 'https://academy.hubspot.com/courses/inbound-marketing', free: true },
          { title: 'Meta Certified Digital Marketing Associate Training', provider: 'Meta / Coursera', url: 'https://www.coursera.org/learn/meta-social-media-marketing', free: true }
        ],
        resources: [
          { title: 'HubSpot Buyer Persona Generator', type: 'Interactive Sandbox', url: 'https://www.hubspot.com/make-my-persona' },
          { title: 'Copyblogger Content Strategy Guide', type: 'Article', url: 'https://copyblogger.com/' }
        ],
        tasks: [
          {
            title: 'Customer Persona Profile & Content Funnel Roadmap',
            description: 'Develop 3 detailed buyer personas for a consumer brand, map customer journey stages (Awareness, Consideration, Decision), and build a 3-month editorial calendar.',
            practicalGoal: 'Brand Persona documentation deck and structured multi-channel editorial schedule.',
            skills: ['Buyer Personas', 'Content Strategy', 'Brand Messaging', 'Editorial Planning']
          }
        ]
      },
      {
        id: 'm-2',
        order: 2,
        title: 'Search Engine Optimization (SEO) & Technical Indexability',
        description: 'Master keyword research, search intent mapping, technical on-page SEO, backlink analysis, and SERP competitive auditing.',
        estimatedWeeks: 4,
        courses: [
          { title: 'Google Digital Marketing & E-Commerce Certificate', provider: 'Google / Coursera', url: 'https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce', free: true },
          { title: 'Search Engine Optimization (SEO) Specialization', provider: 'UC Davis / Coursera', url: 'https://www.coursera.org/specializations/seo', free: true }
        ],
        resources: [
          { title: 'Google Search Central SEO Documentation', type: 'Documentation', url: 'https://developers.google.com/search/docs' },
          { title: 'Ahrefs SEO & Keyword Research Guide', type: 'Article', url: 'https://ahrefs.com/blog/seo-basics/' }
        ],
        tasks: [
          {
            title: 'Comprehensive SEO Audit & Organic Growth Plan',
            description: 'Audit an existing web platform: analyze technical site architecture, keyword rankings, content gaps, and propose an actionable 6-month organic growth roadmap.',
            practicalGoal: 'Documented SEO Audit Report with prioritized keyword cluster matrix and on-page recommendations.',
            skills: ['Technical SEO', 'Keyword Research', 'Site Auditing', 'Search Intent']
          }
        ]
      },
      {
        id: 'm-3',
        order: 3,
        title: 'Performance Marketing (Google & Meta Ads) & GA4 Attribution',
        description: 'Set up ad campaigns, configure conversion tracking in Google Analytics 4, manage audience remarketing, and optimize ROAS.',
        estimatedWeeks: 4,
        courses: [
          { title: 'Google Analytics 4 (GA4) Certification', provider: 'Google Skillshop', url: 'https://skillshop.docebosaas.com/learn/course/overview/ga4', free: true },
          { title: 'Paid Social & Performance Advertising', provider: 'Coursera', url: 'https://www.coursera.org/', free: true }
        ],
        resources: [
          { title: 'Meta Ads Blueprint Guide', type: 'Documentation', url: 'https://www.facebook.com/business/learn' },
          { title: 'Google Ads Search Certification Guide', type: 'Documentation', url: 'https://skillshop.exceedlms.com/' }
        ],
        tasks: [
          {
            title: 'Full-Funnel Paid Advertising Campaign Blueprint',
            description: 'Design an omnichannel paid advertising campaign: define budget distribution ($10k test budget), craft high-converting ad copy mockups, and outline conversion tracking parameters.',
            practicalGoal: 'Ad campaign blueprint deck with creative mockups, audience target parameters, and expected ROAS forecast.',
            skills: ['Meta Ads', 'Google Ads', 'Ad Copywriting', 'Attribution Modeling']
          }
        ]
      },
      {
        id: 'm-4',
        order: 4,
        title: 'Conversion Rate Optimization (CRO), A/B Testing & Flagship Case',
        description: 'Audit landing page friction, design hypothesis-driven A/B tests, measure conversion lifts, and publish your flagship marketing portfolio.',
        estimatedWeeks: 3,
        courses: [
          { title: 'Conversion Rate Optimization Principles', provider: 'CXL Institute Open Guides', url: 'https://cxl.com/blog/conversion-rate-optimization/', free: true }
        ],
        resources: [
          { title: 'GoodUI Conversion Patterns & Evidence', type: 'Article', url: 'https://goodui.org/' }
        ],
        tasks: [
          {
            title: 'Flagship Growth Experimentation Case Study',
            description: 'Package your marketing campaigns, SEO improvements, and A/B test results into a polished digital marketing case study demonstrating verifiable ROI.',
            practicalGoal: 'Published digital portfolio case study URL or executive presentation deck ready for hiring reviews.',
            skills: ['CRO', 'A/B Testing', 'Portfolio Presentation', 'Data Storytelling']
          }
        ]
      }
    ];
  } else if (isDataAI) {
    milestones = [
      {
        id: 'm-1',
        order: 1,
        title: 'Python Foundations & Exploratory Data Analysis',
        description: 'Master core numerical libraries, data cleansing with Pandas, and exploratory data visualizations.',
        estimatedWeeks: 3,
        courses: [
          { title: 'Python for Everybody Specialization', provider: 'Coursera (Univ. of Michigan)', url: 'https://www.coursera.org/specializations/python', free: true },
          { title: 'Data Analysis with Python', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/data-analysis-with-python/', free: true }
        ],
        resources: [
          { title: 'Official Pandas Documentation & 10-Minute Tour', type: 'Documentation', url: 'https://pandas.pydata.org/docs/' },
          { title: 'Kaggle Python & Data Visualisation Micro-Courses', type: 'Interactive Sandbox', url: 'https://www.kaggle.com/learn' }
        ],
        tasks: [
          {
            title: 'EDA Report on Real-world Open Dataset',
            description: 'Download a public Kaggle dataset. Clean missing values, handle outliers, and create 5 key insight visualizations.',
            practicalGoal: 'Jupyter notebook published to GitHub with data insights and README summary.',
            skills: ['Python', 'Pandas', 'Matplotlib', 'Data Cleaning']
          }
        ]
      },
      {
        id: 'm-2',
        order: 2,
        title: 'Classical Machine Learning & Statistical Inference',
        description: 'Implement supervised and unsupervised algorithms using Scikit-Learn with cross-validation and hyperparameter tuning.',
        estimatedWeeks: 4,
        courses: [
          { title: 'Machine Learning Specialization by Andrew Ng', provider: 'DeepLearning.AI / Coursera', url: 'https://www.coursera.org/specializations/machine-learning-introduction', free: true },
          { title: 'Scikit-Learn Machine Learning Course', provider: 'INRIA Open Class', url: 'https://inria.github.io/scikit-learn-mooc/', free: true }
        ],
        resources: [
          { title: 'Scikit-Learn Algorithms Cheat Sheet', type: 'Cheatsheet', url: 'https://scikit-learn.org/stable/tutorial/machine_learning_map/index.html' },
          { title: 'StatQuest Machine Learning Video Guides', type: 'Video Tutorial', url: 'https://youtube.com/@statquest' }
        ],
        tasks: [
          {
            title: 'Predictive Churn or Classification Pipeline',
            description: 'Build an end-to-end classifier comparing Random Forest, Logistic Regression, and XGBoost with ROC-AUC evaluation.',
            practicalGoal: 'Working Python script with pipeline, model persistence (joblib), and metrics markdown report.',
            skills: ['Scikit-Learn', 'Feature Engineering', 'Model Evaluation', 'Python']
          }
        ]
      },
      {
        id: 'm-3',
        order: 3,
        title: 'Deep Learning & Neural Network Architectures',
        description: 'Train deep neural networks using PyTorch for computer vision and natural language processing tasks.',
        estimatedWeeks: 4,
        courses: [
          { title: 'Deep Learning with PyTorch', provider: 'fast.ai', url: 'https://course.fast.ai/', free: true },
          { title: 'CS231n: Deep Learning for Computer Vision', provider: 'Stanford Online', url: 'https://cs231n.stanford.edu/', free: true }
        ],
        resources: [
          { title: 'PyTorch Tutorials & Recipe Collection', type: 'Documentation', url: 'https://pytorch.org/tutorials/' },
          { title: 'Hugging Face Transformers Documentation', type: 'Documentation', url: 'https://huggingface.co/docs' }
        ],
        tasks: [
          {
            title: 'Computer Vision or NLP Classification Model',
            description: 'Train a convolutional network or fine-tune a pre-trained transformer model on custom dataset with training loss curves.',
            practicalGoal: 'GitHub repository with training notebook, checkpoint weights, and inference API script.',
            skills: ['PyTorch', 'Transfer Learning', 'Deep Learning', 'GPU Training']
          }
        ]
      },
      {
        id: 'm-4',
        order: 4,
        title: 'Generative AI, LLMs & Production Deployment',
        description: 'Deploy LLM agents, implement Retrieval-Augmented Generation (RAG) with vector databases, and package models as FastAPI endpoints.',
        estimatedWeeks: 3,
        courses: [
          { title: 'Generative AI with Large Language Models', provider: 'DeepLearning.AI / Coursera', url: 'https://www.coursera.org/learn/generative-ai-with-llms', free: true },
          { title: 'LangChain for LLM Application Development', provider: 'DeepLearning.AI', url: 'https://www.deeplearning.ai/short-courses/langchain-for-llm-application-development/', free: true }
        ],
        resources: [
          { title: 'LangChain & LlamaIndex Official Documentation', type: 'Documentation', url: 'https://docs.langchain.com/' },
          { title: 'Pinecone / pgvector Vector Search Guide', type: 'Article', url: 'https://www.pinecone.io/learn/' }
        ],
        tasks: [
          {
            title: 'End-to-End RAG Knowledge Assistant System',
            description: 'Build a production Retrieval-Augmented Generation application that parses PDF documents, stores embeddings in a vector database, and answers user queries.',
            practicalGoal: 'Live deployed web application connected to vector database, with working GitHub repository.',
            skills: ['Generative AI', 'RAG Pipelines', 'Vector Databases', 'FastAPI Deployment']
          }
        ]
      }
    ];
  } else if (isDesign) {
    milestones = [
      {
        id: 'm-1',
        order: 1,
        title: 'Design Principles, Typography & Figma Foundations',
        description: 'Master color theory, visual hierarchy, responsive grids, and core Figma auto-layout features.',
        estimatedWeeks: 3,
        courses: [
          { title: 'Google UX Design Certificate: Foundations', provider: 'Google / Coursera', url: 'https://www.coursera.org/learn/foundations-user-experience-design', free: true },
          { title: 'Figma for UI Design Official Academy', provider: 'Figma', url: 'https://help.figma.com/hc/en-us/categories/360002051613-Figma-Design', free: true }
        ],
        resources: [
          { title: 'Material Design 3 Guidelines', type: 'Documentation', url: 'https://m3.material.io/' },
          { title: 'Refactoring UI Book & Tips', type: 'Article', url: 'https://www.refactoringui.com/' }
        ],
        tasks: [
          {
            title: 'Design System & UI Component Library',
            description: 'Create a reusable design system in Figma featuring auto-layout buttons, inputs, modal dialogs, and dark/light mode tokens.',
            practicalGoal: 'Public Figma community file with components, variants, and interactive documentation.',
            skills: ['Figma', 'Design Systems', 'Auto-Layout', 'UI Components']
          }
        ]
      },
      {
        id: 'm-2',
        order: 2,
        title: 'User Research & Information Architecture',
        description: 'Conduct user interviews, synthesize empathy maps, define user personas, and structure intuitive user flows.',
        estimatedWeeks: 3,
        courses: [
          { title: 'Interaction Design Foundation: User Research', provider: 'IxDF', url: 'https://www.interaction-design.org/', free: false },
          { title: 'Information Architecture Fundamentals', provider: 'Coursera', url: 'https://www.coursera.org/', free: true }
        ],
        resources: [
          { title: 'Nielsen Norman Group UX Research Articles', type: 'Article', url: 'https://www.nngroup.com/articles/' },
          { title: 'Laws of UX Visual Guide', type: 'Cheatsheet', url: 'https://lawsofux.com/' }
        ],
        tasks: [
          {
            title: 'User Research Case Study & Wireframe Flow',
            description: 'Interview 3 potential users for a problem domain, create user personas, journey maps, and low-fidelity wireframes.',
            practicalGoal: 'Case study presentation document detailing problem statement, user findings, and low-fidelity solution.',
            skills: ['User Research', 'Wireframing', 'User Flows', 'Empathy Mapping']
          }
        ]
      },
      {
        id: 'm-3',
        order: 3,
        title: 'High-Fidelity Prototyping & Usability Testing',
        description: 'Build interactive prototypes with micro-interactions and validate designs through structured usability tests.',
        estimatedWeeks: 3,
        courses: [
          { title: 'Advanced Prototyping in Figma', provider: 'Coursera', url: 'https://www.coursera.org/', free: true }
        ],
        resources: [
          { title: 'Web Content Accessibility Guidelines (WCAG 2.1)', type: 'Documentation', url: 'https://www.w3.org/WAI/standards-guidelines/wcag/' }
        ],
        tasks: [
          {
            title: 'Interactive Mobile Application Prototype',
            description: 'Develop an interactive prototype with smart animations, overlays, and complete 5-task usability testing session.',
            practicalGoal: 'Clickable Figma prototype URL accompanied by usability testing matrix and iterations.',
            skills: ['Interactive Prototyping', 'Usability Testing', 'Accessibility (A11y)']
          }
        ]
      },
      {
        id: 'm-4',
        order: 4,
        title: 'Design Hand-off, Frontend Basics & Portfolio Capstone',
        description: 'Master developer handoff, responsive HTML/CSS constraints, and craft a case-study portfolio ready for recruiters.',
        estimatedWeeks: 3,
        courses: [
          { title: 'Responsive Web Design Certification', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/2022/responsive-web-design/', free: true }
        ],
        resources: [
          { title: 'Best UX Portfolios of the Year', type: 'Article', url: 'https://cofolios.com/' }
        ],
        tasks: [
          {
            title: 'Polished End-to-End Product Design Case Study',
            description: 'Package the completed application into an industry-standard case study detailing problem, research, iterations, and final impact.',
            practicalGoal: 'Live portfolio case study URL or Figma deck ready for hiring reviews.',
            skills: ['Portfolio Presentation', 'Developer Handoff', 'Storytelling', 'UI/UX']
          }
        ]
      }
    ];
  } else {
    // Default: Software Engineering / Web Dev / General Technical
    milestones = [
      {
        id: 'm-1',
        order: 1,
        title: 'Modern Frontend & TypeScript Foundations',
        description: 'Master semantic HTML, modern responsive CSS, TypeScript type safety, and React component state management.',
        estimatedWeeks: 3,
        courses: [
          { title: 'The Modern JavaScript Tutorial', provider: 'javascript.info', url: 'https://javascript.info/', free: true },
          { title: 'React Documentation & Official Quick Start', provider: 'React.dev', url: 'https://react.dev/learn', free: true },
          { title: 'Full Stack Open', provider: 'University of Helsinki', url: 'https://fullstackopen.com/en/', free: true }
        ],
        resources: [
          { title: 'TypeScript Handbook for Developers', type: 'Documentation', url: 'https://www.typescriptlang.org/docs/handbook/intro.html' },
          { title: 'Tailwind CSS Documentation & UI Patterns', type: 'Documentation', url: 'https://tailwindcss.com/docs' }
        ],
        tasks: [
          {
            title: 'Responsive Dashboard Web Application',
            description: 'Build a modular, accessible responsive dashboard in React or Next.js with state filtering, search, and dark mode.',
            practicalGoal: 'Live deployed URL (Vercel/Netlify) and clean GitHub repository with typed components.',
            skills: ['React', 'TypeScript', 'Tailwind CSS', 'Component Architecture']
          }
        ]
      },
      {
        id: 'm-2',
        order: 2,
        title: 'Backend Architecture, REST APIs & Databases',
        description: 'Build robust server-side APIs, implement secure authentication, and model relational data with SQL/PostgreSQL.',
        estimatedWeeks: 4,
        courses: [
          { title: 'Backend Development and APIs', provider: 'freeCodeCamp', url: 'https://www.freecodecamp.org/learn/back-end-development-and-apis/', free: true },
          { title: "CS50's Web Programming with Python and JavaScript", provider: 'Harvard Online / edX', url: 'https://cs50.harvard.edu/web/', free: true }
        ],
        resources: [
          { title: 'Prisma ORM & PostgreSQL Data Modeling', type: 'Documentation', url: 'https://www.prisma.io/docs' },
          { title: 'OWASP Top 10 Web Application Security Guide', type: 'Article', url: 'https://owasp.org/www-project-top-ten/' }
        ],
        tasks: [
          {
            title: 'Secure REST API with JWT Auth and SQL Database',
            description: 'Create an Express or Next.js backend with user registration, bcrypt password hashing, JWT cookies, and CRUD endpoints.',
            practicalGoal: 'Working API repository with automated tests and Postman/Swagger documentation collection.',
            skills: ['Node.js', 'SQL / Relational DB', 'JWT Authentication', 'REST APIs']
          }
        ]
      },
      {
        id: 'm-3',
        order: 3,
        title: 'Full-Stack Integration, State & Cloud Deployment',
        description: 'Connect frontend to backend seamlessly with optimistic UI updates, data fetching caching, and CI/CD pipelines.',
        estimatedWeeks: 4,
        courses: [
          { title: 'Next.js App Router Masterclass', provider: 'Vercel Learn', url: 'https://nextjs.org/learn', free: true },
          { title: 'GitHub Actions CI/CD Workshop', provider: 'GitHub Skills', url: 'https://skills.github.com/', free: true }
        ],
        resources: [
          { title: 'TanStack Query (React Query) Guide', type: 'Documentation', url: 'https://tanstack.com/query/latest' },
          { title: 'Web Performance & Core Web Vitals Guide', type: 'Article', url: 'https://web.dev/vitals/' }
        ],
        tasks: [
          {
            title: 'Full-Stack Collaborative Platform with CI/CD',
            description: 'Build a production-grade full-stack platform featuring live updates, database transactions, and an automated GitHub Action deployment pipeline.',
            practicalGoal: 'Live deployed web application connected to a live database, with continuous deployment badge.',
            skills: ['Full-Stack Development', 'CI/CD Pipelines', 'Cloud Deployment', 'Performance Optimization']
          }
        ]
      },
      {
        id: 'm-4',
        order: 4,
        title: 'System Design, Testing & Career Capstone',
        description: 'Understand system scalability, caching, load balancing, unit & integration testing, and technical interview patterns.',
        estimatedWeeks: 3,
        courses: [
          { title: 'System Design Primer by Donne Martin', provider: 'Open Source GitHub', url: 'https://github.com/donnemartin/system-design-primer', free: true },
          { title: 'Testing JavaScript with Jest & Playwright', provider: 'TestingJavaScript.com', url: 'https://testingjavascript.com/', free: false }
        ],
        resources: [
          { title: 'High Scalability Architecture Case Studies', type: 'Article', url: 'http://highscalability.com/' },
          { title: 'NeetCode Algorithm Roadmap', type: 'Interactive Sandbox', url: 'https://neetcode.io/roadmap' }
        ],
        tasks: [
          {
            title: 'Capstone Project with Automated Test Suite & Architecture Docs',
            description: 'Publish your flagship portfolio project with 80%+ test coverage, clean code practices, and a system architecture diagram.',
            practicalGoal: 'Production-ready showcase project highlighted on your resume and portfolio.',
            skills: ['System Design', 'Automated Testing', 'Architecture Documentation', 'Clean Code']
          }
        ]
      }
    ];
  }

  const roadmap: PersonalizedRoadmap = {
    id: `roadmap-${Date.now()}`,
    userId,
    careerTitle,
    generatedAt: new Date().toISOString(),
    overview: `A structured 4-stage progression engineered to guide you from foundational knowledge to demonstrable production projects in ${careerTitle}.`,
    milestones,
  };

  return {
    data: roadmap,
    engineUsed: 'heuristic',
    isRealAi: false,
    label: 'Standard Roadmap Engine (Curriculum Blueprint)',
  };
}

// ---------------- 3. LINKEDIN POST GENERATOR ----------------
export async function generateLinkedInPost(params: {
  studentName: string;
  taskTitle: string;
  skills: string[];
  projectUrl: string;
  notes: string;
  targetCareer: string;
  feedback?: { rating: number; comment: string; mentorName: string };
}): Promise<AiGenerationResult<string>> {
  const apiKey = getGeminiApiKey();

  if (apiKey) {
    const prompt = `Write an authentic, highly engaging, professional LinkedIn post for a student named ${params.studentName}.
Details:
- Career Goal: ${params.targetCareer}
- Completed Milestone Project: "${params.taskTitle}"
- Skills Practiced: ${params.skills.join(', ')}
- Deliverable / Project URL: ${params.projectUrl}
- Student's reflection / Lessons Learned: "${params.notes}"
${params.feedback ? `- Actual Mentor review: "${params.feedback.comment}" by ${params.feedback.mentorName} (Rating: ${params.feedback.rating}/5)` : ''}

Tone and structure requirements:
- Humble yet confident, showcasing practical learning and hands-on execution.
- Emphasize building tangible evidence of abilities rather than just tutorial watching.
- Include an eye-catching opening hook in the first sentence.
- You MUST explicitly include a clear bulleted section for "🛠️ Skills Practiced" detailing the tools and competencies used.
- You MUST explicitly include a clear bulleted section for "💡 Lessons Learned & Technical Insights" summarizing what was learned, hurdles debugged, and architectural realizations.
- If actual mentor feedback is provided, respectfully highlight the mentor's validation.
- If a project or repository link is provided, include it clearly.
- Conclude with an authentic invitation for feedback or questions from senior practitioners in the community.
- Add 4-5 relevant industry hashtags at the bottom.
Return ONLY the drafted post text. Do not wrap in markdown json code fences.`;

    const rawResponse = await callGemini(prompt, apiKey);
    if (rawResponse) {
      return {
        data: rawResponse.trim(),
        engineUsed: 'gemini',
        isRealAi: true,
        label: 'AI Draft (Crafted by Gemini 1.5 Flash)',
      };
    }
  }

  // HEURISTIC LINKEDIN GENERATOR
  const skillsHashtags = params.skills
    .map((s) => `#${s.replace(/[^a-zA-Z0-9]/g, '')}`)
    .slice(0, 4)
    .join(' ');

  const skillsList = params.skills.length > 0
    ? params.skills.map((s) => `• ${s}`).join('\n')
    : '• Strategic Architecture & Problem Solving\n• Modular Execution & Measurable Deliverables';

  const lessons = params.notes && params.notes.trim()
    ? params.notes
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => line.startsWith('•') ? line : `• ${line}`)
        .join('\n')
    : `• Deepened understanding of practical execution vs theoretical tutorials.\n• Overcame real-world hurdles and validated tangible deliverables.\n• Learned the value of documenting project evidence for review.`;

  const mentorSection = params.feedback
    ? `\n🌟 Received actual mentor review from ${params.feedback.mentorName} (${params.feedback.rating}/5 ⭐):\n"${params.feedback.comment}"\n`
    : '';

  const deliverableSection = params.projectUrl
    ? `\n🔗 Project Deliverable / Link: ${params.projectUrl}\n`
    : '';

  const post = `🚀 Excited to share a practical project milestone on my journey toward becoming a ${params.targetCareer || 'Professional'}!

I recently completed work on: "${params.taskTitle}".

Rather than just following passive tutorials, I wanted to build tangible evidence of my skills and tackle real-world challenges. Here is a breakdown of what went into this deliverable:

🛠️ Skills Practiced:
${skillsList}

💡 Lessons Learned & Strategic Insights:
${lessons}
${mentorSection}${deliverableSection}
💬 To the senior practitioners and mentors in my network: what optimizations or next steps would you recommend exploring next? I'd love your thoughts!

${skillsHashtags} #BuildInPublic #LearningInPublic #CareerGrowth #ProjectMilestone #EvidenceDriven`;

  return {
    data: post,
    engineUsed: 'heuristic',
    isRealAi: false,
    label: 'Standard AI Assistant (Template Engine)',
  };
}
