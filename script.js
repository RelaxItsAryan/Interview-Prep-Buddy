/* ==========================================
   INTERVIEW PREP BUDDY - ULTIMATE LOGIC
   ========================================== */

// --- 3D PARTICLE ENGINE ---
const init3D = () => {
  const container = document.getElementById('canvas-container');
  if(!container) return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Particle System
  const particlesGeometry = new THREE.BufferGeometry();
  const particlesCount = 700;
  const posArray = new Float32Array(particlesCount * 3);

  for(let i = 0; i < particlesCount * 3; i++) {
    posArray[i] = (Math.random() - 0.5) * 50; // Spread
  }

  particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

  // Material (Dynamic Color)
  const particlesMaterial = new THREE.PointsMaterial({
    size: 0.15,
    color: 0x06b6d4, // Default Cyan
    transparent: true,
    opacity: 0.8,
  });

  const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
  scene.add(particlesMesh);

  // Add floating shapes in corners
  const shapeGeo = new THREE.IcosahedronGeometry(2, 0);
  const shapeMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.1 });
  
  const shape1 = new THREE.Mesh(shapeGeo, shapeMat);
  shape1.position.set(15, 10, -10);
  scene.add(shape1);

  const shape2 = new THREE.Mesh(shapeGeo, shapeMat);
  shape2.position.set(-15, -10, -10);
  scene.add(shape2);

  camera.position.z = 20;

  function animate() {
    requestAnimationFrame(animate);
    
    // Rotate entire system
    particlesMesh.rotation.y += 0.0005;
    particlesMesh.rotation.x += 0.0002;

    shape1.rotation.x += 0.002;
    shape1.rotation.y += 0.002;
    shape2.rotation.x -= 0.002;
    shape2.rotation.y -= 0.002;

    // Theme Color Check
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    
    // Dark Mode: Cyan Particles. Light Mode: Black Particles.
    particlesMaterial.color.setHex(isDark ? 0x06b6d4 : 0x000000);
    shapeMat.color.setHex(isDark ? 0x3b82f6 : 0x000000);
    shapeMat.opacity = isDark ? 0.1 : 0.05;

    renderer.render(scene, camera);
  }
  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
};

// --- DATA: TEXT QUESTIONS (MCQ + TYPING) ---
const textQuestions = [
    // 5 MCQs
    { id: 't1', type: 'mcq', category: 'Behavioral Logic', question: "A team member is constantly missing deadlines. What is your first action?", options: ["Report them to the manager immediately.", "Do their work for them to save the project.", "Talk to them privately to understand the root cause.", "Ignore it as long as it doesn't affect you."], correct: 2 },
    { id: 't2', type: 'mcq', category: 'Critical Thinking', question: "You have two urgent tasks: one is 'Important but not Urgent', the other is 'Urgent but not Important'. Which do you prioritize?", options: ["Important but not Urgent", "Urgent but not Important", "Do both simultaneously", "Delegate the Important task"], correct: 0 },
    { id: 't3', type: 'mcq', category: 'Scenario Logic', question: "A client requests a feature change 2 days before launch. What do you do?", options: ["Say yes immediately to please them.", "Reject it because it's too late.", "Assess the impact and propose a post-launch update.", "Work overtime without telling anyone."], correct: 2 },
    { id: 't4', type: 'mcq', category: 'Ethics', question: "You find a major bug in production that no one else has noticed. What do you do?", options: ["Fix it silently without telling anyone.", "Document it and notify the team immediately.", "Ignore it if it doesn't break the main flow.", "Blame the person who wrote the code."], correct: 1 },
    { id: 't5', type: 'mcq', category: 'Teamwork', question: "Your idea was rejected in a meeting. How do you react?", options: ["Argue until they agree.", "Accept the team's decision and support the chosen path.", "Stop contributing to the meeting.", "Complain to colleagues afterwards."], correct: 1 },
    
    // 5 Typing
    { id: 't6', type: 'text', category: 'Scenario', question: "Describe a situation where you had to learn a new technology quickly. How did you approach it?" },
    { id: 't7', type: 'text', category: 'Behavioral', question: "Tell us about a time you disagreed with a supervisor. How did you handle it?" },
    { id: 't8', type: 'text', category: 'Critical Thinking', question: "If you were given a project with vague requirements, what steps would you take to clarify them?" },
    { id: 't9', type: 'text', category: 'Problem Solving', question: "Explain a complex problem you solved recently in simple terms." },
    { id: 't10', type: 'text', category: 'Values', question: "What motivates you more: working independently or in a team? Why?" }
];

// --- DATA: VOICE QUESTIONS (Expanded) ---
const questions = [
  { id: 1, question: "Tell me about yourself.", category: "Behavioral", tip: "Keep it under 2 minutes. Start with your current role." },
  { id: 2, question: "Why do you want to work here?", category: "Motivation", tip: "Connect your skills to the company mission." },
  { id: 3, question: "Describe a challenge you faced.", category: "Behavioral", tip: "Use STAR: Situation, Task, Action, Result." },
  { id: 4, question: "What are your greatest strengths?", category: "Self-Awareness", tip: "Choose strengths relevant to the job." },
  { id: 5, question: "Where do you see yourself in 5 years?", category: "Future Goals", tip: "Show ambition that aligns with the company." },
  { id: 6, question: "How do you handle stress?", category: "Resilience", tip: "Give a concrete example of staying calm." },
  { id: 7, question: "Tell me about a time you led a team.", category: "Leadership", tip: "Focus on how you supported others." },
  { id: 8, question: "What is your biggest weakness?", category: "Self-Awareness", tip: "Mention a weakness and how you are improving it." },
  { id: 9, question: "How do you prioritize tasks?", category: "Productivity", tip: "Mention tools or frameworks like Eisenhower Matrix." },
  { id: 10, question: "Why should we hire you?", category: "Closing", tip: "Summarize your unique value proposition." }
];

// Global State
let currentTextIndex = 0;
let currentVoiceIndex = 0;
let textAnswers = {}; // Stores MCQ selection indices or Text strings
let voiceAnswers = {};
let isRecording = false;
let recognition = null;
let currentTranscript = "";
let timerInt;
let seconds = 0;
let practicePhase = 'text'; // 'text' or 'voice'

document.addEventListener('DOMContentLoaded', () => {
  init3D();
  initTheme();
  initSpeech();
  
  // Start Text Phase by default
  updateTextUI();
  
  window.toggleMobileMenu = () => {
    document.getElementById('mobileMenu').classList.toggle('active');
  };
});

/* NAVIGATION */
function showPage(id) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${id}`).classList.add('active');
  
  // Highlight active link
  document.querySelectorAll('.nav-link').forEach(l => {
    l.classList.remove('active');
    if(l.dataset.page === id) l.classList.add('active');
  });

  document.getElementById('mobileMenu').classList.remove('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Reset practice state if entering practice
  if(id === 'practice') {
     practicePhase = 'text';
     currentTextIndex = 0;
     currentVoiceIndex = 0;
     document.getElementById('text-practice-container').style.display = 'block';
     document.getElementById('voice-practice-container').style.display = 'none';
     updateTextUI();
  }
}

function toggleTheme() {
  const root = document.documentElement;
  const curr = root.getAttribute('data-theme');
  root.setAttribute('data-theme', curr === 'dark' ? 'light' : 'dark');
}
function initTheme() {
  const saved = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', saved);
}

/* ============================
   PHASE 1: TEXT PRACTICE LOGIC
   ============================ */
function updateTextUI() {
    const q = textQuestions[currentTextIndex];
    document.getElementById('textCurrentQ').textContent = currentTextIndex + 1;
    document.getElementById('textCategory').textContent = q.category;
    document.getElementById('textQuestionDisplay').textContent = q.question;
    document.getElementById('textProgressFill').style.width = `${((currentTextIndex + 1) / textQuestions.length) * 100}%`;
    document.getElementById('textPrevBtn').disabled = currentTextIndex === 0;

    const container = document.getElementById('textInputArea');
    container.innerHTML = ''; // Clear previous

    if(q.type === 'mcq') {
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'mcq-options fade-in';
        q.options.forEach((opt, idx) => {
            const btn = document.createElement('button');
            btn.className = 'mcq-option-btn';
            btn.textContent = opt;
            // Check if previously selected
            if(textAnswers[q.id] === idx) btn.classList.add('selected');
            
            btn.onclick = () => {
                textAnswers[q.id] = idx; // Save Answer
                // Visual update
                document.querySelectorAll('.mcq-option-btn').forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
            };
            optionsDiv.appendChild(btn);
        });
        container.appendChild(optionsDiv);
    } else {
        const textarea = document.createElement('textarea');
        textarea.className = 'text-answer-input fade-in';
        textarea.placeholder = "Type your answer here...";
        textarea.value = textAnswers[q.id] || "";
        textarea.oninput = (e) => { textAnswers[q.id] = e.target.value; };
        container.appendChild(textarea);
    }
}

function nextTextQuestion() {
    // Validate current answer
    const q = textQuestions[currentTextIndex];
    if(textAnswers[q.id] === undefined || textAnswers[q.id] === "") {
        showToast('Please answer before proceeding', 'error');
        return;
    }

    if(currentTextIndex < textQuestions.length - 1) {
        currentTextIndex++;
        updateTextUI();
    } else {
        // Switch to Voice Phase
        showToast("Text Section Complete! Moving to Voice.", "success");
        document.getElementById('text-practice-container').style.display = 'none';
        document.getElementById('voice-practice-container').style.display = 'block';
        practicePhase = 'voice';
        updateVoiceUI();
    }
}

function prevTextQuestion() {
    if(currentTextIndex > 0) {
        currentTextIndex--;
        updateTextUI();
    }
}


/* ============================
   PHASE 2: VOICE PRACTICE LOGIC
   ============================ */
function updateVoiceUI() {
  const q = questions[currentVoiceIndex];
  document.getElementById('currentQuestion').textContent = currentVoiceIndex + 1;
  document.getElementById('questionCategory').textContent = q.category;
  document.getElementById('questionText').textContent = q.question;
  document.getElementById('questionTip').textContent = `Tip: ${q.tip}`;
  
  const pct = ((currentVoiceIndex + 1) / questions.length) * 100;
  document.getElementById('progressFill').style.width = `${pct}%`;

  document.getElementById('prevBtn').disabled = currentVoiceIndex === 0;
  
  if (currentVoiceIndex === questions.length - 1) {
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('finishBtn').style.display = 'block';
  } else {
    document.getElementById('nextBtn').style.display = 'block';
    document.getElementById('finishBtn').style.display = 'none';
  }

  currentTranscript = voiceAnswers[q.id] || "";
  document.getElementById('transcriptText').value = currentTranscript;
  resetRec();
}

function nextQuestion() { saveVoiceAnswer(); currentVoiceIndex++; updateVoiceUI(); }
function prevQuestion() { saveVoiceAnswer(); currentVoiceIndex--; updateVoiceUI(); }
function saveVoiceAnswer() { voiceAnswers[questions[currentVoiceIndex].id] = currentTranscript; }

function finishSession() {
  saveVoiceAnswer();
  const count = Object.values(voiceAnswers).filter(a => a.trim().length > 0).length;
  if (count === 0) {
    showToast('Please record at least one answer', 'error');
    return;
  }
  showToast('Analyzing full session...', 'success');
  setTimeout(() => { generateReport(); showPage('feedback'); }, 2000);
}

/* RECORDING */
function toggleRecording() { isRecording ? stopRec() : startRec(); }

async function startRec() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    isRecording = true;
    currentTranscript = ""; 
    document.getElementById('transcriptText').value = "";
    document.getElementById('recordStatus').textContent = "Recording...";
    document.querySelector('.neural-core').classList.add('recording');
    
    timerInt = setInterval(() => {
      seconds++;
      const m = String(Math.floor(seconds/60)).padStart(2,'0');
      const s = String(seconds%60).padStart(2,'0');
      document.getElementById('timer').textContent = `${m}:${s}`;
    }, 1000);

    if (recognition) recognition.start();

  } catch (err) {
    showToast('Microphone access denied', 'error');
  }
}

function stopRec() {
  isRecording = false;
  clearInterval(timerInt);
  if (recognition) recognition.stop();
  
  document.querySelector('.neural-core').classList.remove('recording');
  document.getElementById('recordStatus').textContent = "Tap Core to Record";
  
  saveVoiceAnswer();
  if (currentTranscript.length > 0) showToast('Answer saved', 'success');
}

function resetRec() {
  clearInterval(timerInt);
  seconds = 0;
  document.getElementById('timer').textContent = "00:00";
  document.getElementById('recordStatus').textContent = "Tap Core to Record";
  document.querySelector('.neural-core').classList.remove('recording');
}

/* SPEECH API */
function initSpeech() {
  if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onresult = (event) => {
      let final = '';
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) final += event.results[i][0].transcript;
        else interim += event.results[i][0].transcript;
      }
      if(final) currentTranscript += final + " ";
      document.getElementById('transcriptText').value = currentTranscript + interim;
    };
  }
}

function countFillers(text) {
  const fillers = ["um", "uh", "like", "basically", "you know"];
  let count = 0;
  fillers.forEach(f => {
    const regex = new RegExp(`\\b${f}\\b`, "gi");
    count += (text.match(regex) || []).length;
  });
  return count;
}

function countSentences(text) {
  return text.split(/[.!?]/).filter(s => s.trim().length > 0).length;
}

function getSpeedScore(words, seconds) {
  const wpm = (words / seconds) * 60;
  if (wpm >= 120 && wpm <= 160) return 100;
  if (wpm >= 100 && wpm < 120) return 80;
  if (wpm > 160 && wpm <= 180) return 70;
  return 50;
}

function getSpeedScore(words, seconds) {
  const wpm = (words / seconds) * 60;
  if (wpm >= 120 && wpm <= 160) return 100;
  if (wpm >= 100 && wpm < 120) return 80;
  if (wpm > 160 && wpm <= 180) return 70;
  return 50;
}


/* REPORT GENERATION (UPDATED) */
function generateReport() {
  /* ---------- HELPER FUNCTIONS ---------- */
  function countFillers(text) {
    const fillers = ["um", "uh", "like", "basically", "you know"];
    let count = 0;
    fillers.forEach(f => {
      const regex = new RegExp(`\\b${f}\\b`, "gi");
      count += (text.match(regex) || []).length;
    });
    return count;
  }

  function countSentences(text) {
    return text.split(/[.!?]/).filter(s => s.trim().length > 0).length;
  }

  function getSpeedScore(words, seconds) {
    const wpm = (words / Math.max(seconds, 30)) * 60;
    if (wpm >= 120 && wpm <= 160) return 100;
    if (wpm >= 100 && wpm < 120) return 80;
    if (wpm > 160 && wpm <= 180) return 70;
    return 50;
  }

  /* ===============================
     VOICE ANALYSIS
  =============================== */
  let totalVoiceWords = 0;
  let totalFillers = 0;

  Object.values(voiceAnswers).forEach(ans => {
    if (!ans) return;
    totalVoiceWords += ans.split(" ").length;
    totalFillers += countFillers(ans);
  });

  const speedScore = getSpeedScore(totalVoiceWords, seconds || 60);
  const fillerPenalty = totalVoiceWords
    ? (totalFillers / totalVoiceWords) * 100
    : 0;
  const fillerScore = Math.max(40, 100 - fillerPenalty);
  const completenessScore = totalVoiceWords >= 150 ? 100 : 60;

  const voiceScore = Math.round(
    speedScore * 0.4 +
    fillerScore * 0.3 +
    completenessScore * 0.3
  );

  /* ===============================
     TEXT + MCQ ANALYSIS
  =============================== */
  let mcqCorrect = 0;
  let textQualityScore = 0;

  textQuestions.forEach(q => {
    const ans = textAnswers[q.id];

    if (q.type === "mcq") {
      if (ans === q.correct) mcqCorrect++;
    } else {
      if (!ans) return;

      const words = ans.split(" ").length;
      const sentences = countSentences(ans);

      if (sentences >= 3 && words >= 40) textQualityScore += 20;
      else if (sentences >= 2 && words >= 25) textQualityScore += 12;
      else textQualityScore += 6;
    }
  });

  const mcqScore = (mcqCorrect / 5) * 100; // 5 MCQs
  const textScore = Math.min(100, textQualityScore);

  /* ===============================
     FINAL SCORE (WEIGHTED)
  =============================== */
  const finalScore = Math.round(
    mcqScore * 0.25 +
    textScore * 0.30 +
    voiceScore * 0.45
  );

  /* ===============================
     UPDATE UI
  =============================== */
  document.getElementById("overallScore").textContent = finalScore;
  document.querySelector(".circle").style.strokeDasharray = `${finalScore}, 100`;

  let summary = "Good effort. Keep practicing.";
  if (finalScore > 85) summary = "Outstanding! You are interview ready.";
  else if (finalScore > 65) summary = "Strong performance. Minor refinements needed.";

  document.getElementById("feedbackSummary").textContent = summary;

  document.getElementById("barClarity").style.width = `${Math.round(mcqScore)}%`;
  document.getElementById("valClarity").textContent = `${Math.round(mcqScore)}%`;

  document.getElementById("barRelevance").style.width = `${Math.round(textScore)}%`;
  document.getElementById("valRelevance").textContent = `${Math.round(textScore)}%`;

  document.getElementById("barStructure").style.width = `${Math.round(voiceScore)}%`;
  document.getElementById("valStructure").textContent = `${Math.round(voiceScore)}%`;

  /* ===============================
     SMART FEEDBACK
  =============================== */
  const tips = [];

  if (voiceScore < 60)
    tips.push("Speak at a steady pace and avoid rushing.");
  if (totalFillers > 5)
    tips.push("Reduce filler words like 'um', 'like', and 'basically'.");
  if (textScore < 60)
    tips.push("Add clearer reasoning and structured explanations.");
  if (mcqScore < 60)
    tips.push("Review situational and logical decision-making.");

  if (tips.length === 0)
    tips.push("Excellent balance of logic, clarity, and communication.");

  const list = document.getElementById("tipsList");
  list.innerHTML = "";
  tips.forEach(t => {
    const li = document.createElement("li");
    li.textContent = t;
    list.appendChild(li);
  });

  // AI REVIEW (Frontend Simulation)
  const aiReview = generateAIReview({
    finalScore,
    voiceScore,
    textScore,
    mcqScore
  });

  document.getElementById("aiReviewText").textContent = aiReview;

}

function generateAIReview({ finalScore, voiceScore, textScore, mcqScore }) {
  let review = "";

  // Overall
  if (finalScore >= 85) {
    review += "You demonstrated strong interview readiness with clear communication and logical thinking. ";
  } else if (finalScore >= 65) {
    review += "You showed good potential, but some areas need refinement to reach interview-ready confidence. ";
  } else {
    review += "This session highlights foundational skills, but more structured practice is recommended. ";
  }

  // Voice feedback
  if (voiceScore < 60) {
    review += "Your verbal responses were either too brief or lacked flow. Focus on pacing and complete explanations. ";
  } else {
    review += "Your speaking pace and clarity were appropriate, indicating good communication confidence. ";
  }

  // Text feedback
  if (textScore < 60) {
    review += "Written answers would benefit from clearer structure and explicit reasoning steps. ";
  } else {
    review += "Your written responses showed logical thinking and reasonable structure. ";
  }

  // MCQ feedback
  if (mcqScore < 60) {
    review += "Some situational decisions could be improved by considering impact and ethics more carefully. ";
  } else {
    review += "Your situational judgment aligns well with professional expectations. ";
  }

  review += "Continue practicing consistently, and aim to apply structured frameworks like STAR to further improve.";

  return review;
}



function copyTranscript() {
  const text = document.getElementById('transcriptText');
  text.select();
  document.execCommand('copy');
  showToast('Copied to clipboard', 'success');
}

function showToast(msg, type){
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  if(type === 'error') t.style.borderLeftColor = '#f43f5e';
  document.getElementById('toastContainer').appendChild(t);
  setTimeout(() => t.remove(), 3000);
}