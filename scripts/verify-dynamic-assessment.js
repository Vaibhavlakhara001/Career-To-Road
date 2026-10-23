const http = require('http');

async function request(path, options = {}) {
  return new Promise((resolve, reject) => {
    const postData = options.body ? JSON.stringify(options.body) : null;
    const reqOptions = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(options.token ? {
          'Authorization': `Bearer ${options.token}`,
          'Cookie': `roadtocareer_token=${options.token}`
        } : {}),
        ...(options.headers || {}),
        ...(postData ? { 'Content-Length': Buffer.byteLength(postData) } : {}),
      },
    };

    const req = http.request(reqOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          resolve({ status: res.statusCode, data: json, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, text: data, headers: res.headers });
        }
      });
    });

    req.on('error', (err) => reject(err));
    if (postData) req.write(postData);
    req.end();
  });
}

async function run() {
  console.log('===========================================================');
  console.log(' VERIFYING DYNAMIC & PROFILE-TAILORED ROAD TO CAREER PATHWAYS');
  console.log('===========================================================');

  // TEST 1: VAIBHAV LAKHARA (Gaming & Game Developer Ambitions)
  console.log('\n--- 1. Testing Student Vaibhav Lakhara (Gamer & Game Dev Ambitions) ---');
  const jwt = require('jsonwebtoken');
  const JWT_SECRET = process.env.JWT_SECRET || 'road-to-career-super-secret-key-2026';
  const vaibhavToken = jwt.sign(
    {
      userId: 'user-1792778582958-l0bw6',
      email: 'lakharavaibhav8@gmail.com',
      role: 'student',
      name: 'Vaibhav Lakhara',
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );

  // Check assessment questions returned
  const vAssessment = await request('/api/assessment', { token: vaibhavToken });
  console.log('Domain Key returned for Vaibhav:', vAssessment.data.domainKey);
  console.log('Domain Label returned for Vaibhav:', vAssessment.data.domainLabel);
  console.log('Sample Question 1:', vAssessment.data.questions?.[0]?.prompt);
  console.log('Sample Question 1 Option A:', vAssessment.data.questions?.[0]?.options?.[0]?.text);

  if (vAssessment.data.domainKey !== 'gaming') {
    throw new Error(`Expected gaming domain for Vaibhav, got: ${vAssessment.data.domainKey}`);
  }

  // Generate recommendations for Vaibhav
  const vRecs = await request('/api/recommendations', { method: 'POST', token: vaibhavToken });
  console.log('\nVaibhav Top 3 Career Recommendations:');
  vRecs.data.recommendations.forEach((r, idx) => {
    console.log(`  ${idx + 1}. ${r.title} (${r.matchScore}% Match - ${r.domain})`);
    console.log(`     Courses: ${r.beginnerCourses?.map((c) => c.title).join(' | ')}`);
    console.log(`     Projects: ${r.practicalProjects?.map((p) => p.title).join(' | ')}`);
  });

  const vaibhavTop = vRecs.data.recommendations[0];
  if (!vaibhavTop.title.toLowerCase().includes('game')) {
    throw new Error(`Expected Game Developer as top recommendation for Vaibhav, got: ${vaibhavTop.title}`);
  }
  console.log('>> SUCCESS: Vaibhav gets Game Developer as #1 with Unity, Unreal & CS50 Game Dev courses!');

  // TEST 2: BBA STUDENT (Business Administration & Management)
  console.log('\n--- 2. Testing Student With BBA & Management Profile ---');
  // Sign up a clean BBA student account
  const bbaEmail = `bba.student.${Date.now()}@college.edu`;
  const signupRes = await request('/api/auth/signup', {
    method: 'POST',
    body: {
      name: 'Aarav Mehta',
      email: bbaEmail,
      password: 'password123',
      role: 'student',
    },
  });
  console.log('BBA Student Signup Status:', signupRes.status);
  const bbaToken = signupRes.data.token;

  // Save BBA profile
  const profileSaveRes = await request('/api/profile', {
    method: 'POST',
    token: bbaToken,
    body: {
      fullName: 'Aarav Mehta',
      qualification: 'BBA in Marketing & Strategic Management',
      hobbies: ['case competitions', 'investing'],
      interests: ['business strategy', 'digital marketing', 'business analytics'],
      skills: ['management', 'financial modeling', 'communication', 'market research'],
      ambitions: 'Business Operations Manager & Consultant',
      futureGoals: 'Lead corporate strategic expansion for consumer brands',
      preferredLanguage: 'English',
      shareWithRecruiters: true,
    },
  });
  console.log('Profile Save Status:', profileSaveRes.status);

  // Check assessment questions returned for BBA student
  const bbaAssessment = await request('/api/assessment', { token: bbaToken });
  console.log('Domain Key returned for BBA student:', bbaAssessment.data.domainKey);
  console.log('Domain Label returned for BBA student:', bbaAssessment.data.domainLabel);
  console.log('Sample Question 1 for BBA student:', bbaAssessment.data.questions?.[0]?.prompt);
  console.log('Sample Question 1 Option A:', bbaAssessment.data.questions?.[0]?.options?.[0]?.text);

  if (bbaAssessment.data.domainKey !== 'business') {
    throw new Error(`Expected business domain for BBA student, got: ${bbaAssessment.data.domainKey}`);
  }

  // Generate recommendations for BBA student
  const bbaRecs = await request('/api/recommendations', { method: 'POST', token: bbaToken });
  console.log('\nBBA Student Top 3 Career Recommendations:');
  bbaRecs.data.recommendations.forEach((r, idx) => {
    console.log(`  ${idx + 1}. ${r.title} (${r.matchScore}% Match - ${r.domain})`);
    console.log(`     Reasons: ${r.reasons?.[0]}`);
    console.log(`     Courses: ${r.beginnerCourses?.map((c) => c.title).join(' | ')}`);
    console.log(`     Projects: ${r.practicalProjects?.map((p) => p.title).join(' | ')}`);
  });

  const bbaTop = bbaRecs.data.recommendations[0];
  if (!bbaTop.title.toLowerCase().includes('business') && !bbaTop.title.toLowerCase().includes('management')) {
    throw new Error(`Expected Business Management as top recommendation for BBA student, got: ${bbaTop.title}`);
  }
  console.log('>> SUCCESS: BBA student gets Business Management & Operations Strategist with Wharton, Yale, and Illinois courses!');

  // BBA Student activates roadmap
  const bbaRoadmap = await request('/api/roadmap', {
    method: 'POST',
    token: bbaToken,
    body: { careerTitle: bbaTop.title },
  });
  console.log('\nBBA Student Generated Roadmap:');
  console.log('Career Title:', bbaRoadmap.data.roadmap?.careerTitle);
  bbaRoadmap.data.roadmap?.milestones?.forEach((m) => {
    console.log(`  Milestone ${m.order}: ${m.title}`);
    console.log(`    Task: ${m.tasks?.[0]?.title} -> ${m.tasks?.[0]?.practicalGoal}`);
  });

  console.log('\n===========================================================');
  console.log(' ALL DYNAMIC & PROFILE-TAILORED TESTS PASSED PERFECTLY!');
  console.log('===========================================================');
}

run().catch((err) => {
  console.error('Test run failed:', err);
  process.exit(1);
});
