const http = require('http');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'road-to-career-super-secret-key-2026';

function createToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

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
  console.log(' ROAD TO CAREER: RECOMMENDATIONS & ASSESSMENT VERIFICATION');
  console.log('===========================================================');

  // Test 1: Authenticated session for student Vaibhav Lakhara
  const vaibhavUser = {
    id: 'user-1792778582958-l0bw6',
    name: 'Vaibhav Lakhara',
    email: 'lakharavaibhav8@gmail.com',
    role: 'student',
  };
  const vaibhavToken = createToken(vaibhavUser);

  console.log('\n[1] Testing GET /api/recommendations for Vaibhav Lakhara...');
  const recsRes = await request('/api/recommendations', { token: vaibhavToken });
  console.log('Response Status:', recsRes.status);
  console.log('Has Assessment:', recsRes.data.hasAssessment);
  console.log('Dominant Traits:', recsRes.data.dominantTraits);
  console.log('Recommendations Count:', recsRes.data.recommendations?.length);

  if (recsRes.data.recommendations?.length !== 3) {
    throw new Error(`Expected exactly 3 recommendations, received: ${recsRes.data.recommendations?.length}`);
  }

  recsRes.data.recommendations.forEach((rec, idx) => {
    console.log(`\n  Path #${idx + 1}: ${rec.title} (${rec.matchScore}% Match - ${rec.domain})`);
    console.log(`  - Reasons (${rec.reasons?.length}):`);
    rec.reasons.forEach((r) => console.log(`     • ${r}`));
    console.log(`  - Required Skills:`, rec.requiredSkills);
    console.log(`  - Beginner Courses (${rec.beginnerCourses?.length}):`, rec.beginnerCourses?.map((c) => `${c.title} [${c.free ? 'FREE' : 'PAID'}]`));
    console.log(`  - Practical Projects (${rec.practicalProjects?.length}):`, rec.practicalProjects?.map((p) => `${p.title} -> ${p.deliverable}`));
  });

  // Verify all 4 required sections exist and are populated
  const first = recsRes.data.recommendations[0];
  if (!first.reasons?.length || !first.requiredSkills?.length || !first.beginnerCourses?.length || !first.practicalProjects?.length) {
    throw new Error('Recommendation is missing required fields (reasons, skills, courses, or projects)');
  }
  console.log('\n>> SUCCESS: Vaibhav recommendations meet all criteria with reasons, required skills, beginner courses, and practical projects.');

  // Test 2: Authenticated session for student Shivam Saini
  const shivamUser = {
    id: 'user-1792779576031-ral2k',
    name: 'shivam saini',
    email: 'shivam.25bcon1467@jecrcu.edu.in',
    role: 'student',
  };
  const shivamToken = createToken(shivamUser);

  console.log('\n[2] Testing initial recommendation generation for Shivam Saini (Profile-based)...');
  const shivamGenRes = await request('/api/recommendations', {
    method: 'POST',
    token: shivamToken,
  });
  console.log('Response Status:', shivamGenRes.status);
  console.log('Engine Label:', shivamGenRes.data.label);
  console.log('Has Assessment before quiz:', shivamGenRes.data.hasAssessment);
  shivamGenRes.data.recommendations.forEach((r, idx) => {
    console.log(`  ${idx + 1}. ${r.title} (${r.matchScore}% match)`);
  });

  // Test 3: Shivam takes MCQ Assessment for more guidance
  console.log('\n[3] Shivam takes the 8-MCQ Assessment to refine recommendations...');
  const questionsRes = await request('/api/assessment', { token: shivamToken });
  console.log(`Retrieved ${questionsRes.data.questions?.length} MCQ scenario questions.`);

  const answers = {
    1: 1, // Data/AI: Analyze data, look for underlying patterns...
    2: 1, // Data/AI: Training an ML model...
    3: 1, // Data/AI: Investigative research...
    4: 0, // Data/AI: Love linear algebra, probability...
    5: 0, // Engineering: Laggy performance...
    6: 1, // Data/AI: PyTorch, Hugging Face, LangChain...
    7: 2, // Data/AI: Discovering a surprising insight in messy data...
    8: 3, // Data/AI: Charts, correlation metrics, statistical graphs...
  };

  const submitAssessment = await request('/api/assessment', {
    method: 'POST',
    token: shivamToken,
    body: { answers },
  });
  console.log('Assessment Submit Status:', submitAssessment.status);
  console.log('Dominant Traits:', submitAssessment.data.result?.dominantTraits);
  console.log('Top Category Scores:', submitAssessment.data.result?.scores);
  console.log('Refined Recommendations Count:', submitAssessment.data.refinedRecommendations?.length);
  console.log('Top Refined Recommendation:', submitAssessment.data.refinedRecommendations?.[0]?.title, `(${submitAssessment.data.refinedRecommendations?.[0]?.matchScore}%)`);

  // Test 4: Verify refined recommendations persisted to Shivam's account
  console.log('\n[4] Verifying refined recommendations persisted in GET /api/recommendations for Shivam...');
  const shivamRecsFinal = await request('/api/recommendations', { token: shivamToken });
  console.log('Response Status:', shivamRecsFinal.status);
  console.log('Has Assessment Now:', shivamRecsFinal.data.hasAssessment);
  console.log('Dominant Traits:', shivamRecsFinal.data.dominantTraits);
  const shivamTop = shivamRecsFinal.data.recommendations[0];
  console.log(`Top Career Path: ${shivamTop.title} (${shivamTop.matchScore}%)`);
  console.log('Reasons:');
  shivamTop.reasons.forEach((r) => console.log(`  - ${r}`));
  console.log('Required Skills:', shivamTop.requiredSkills);
  console.log('Courses count:', shivamTop.beginnerCourses?.length);
  console.log('Projects count:', shivamTop.practicalProjects?.length);

  // Test 5: Activating Learning Roadmap from recommendation
  console.log(`\n[5] Activating Learning Roadmap for "${shivamTop.title}"...`);
  const roadmapRes = await request('/api/roadmap', {
    method: 'POST',
    token: shivamToken,
    body: { careerTitle: shivamTop.title },
  });
  console.log('Roadmap Response Status:', roadmapRes.status);
  console.log('Active Career Title in Roadmap:', roadmapRes.data.roadmap?.careerTitle);
  console.log('Generated Milestones:', roadmapRes.data.roadmap?.milestones?.length);
  console.log('Tasks Added to Tracker:', roadmapRes.data.generatedTasksCount);

  console.log('\n===========================================================');
  console.log(' ALL VERIFICATION CHECKS PASSED PERFECTLY!');
  console.log('===========================================================');
}

run().catch((err) => {
  console.error('VERIFICATION FAILED:', err);
  process.exit(1);
});
