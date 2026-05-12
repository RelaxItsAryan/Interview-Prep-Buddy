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
let recordingStartedAt = null;
let voiceDurations = {};
let confidenceModel = null;
let webcamStream = null;
let visionAnimationFrame = null;
let visionLoadPromise = null;
let faceLandmarker = null;
let poseLandmarker = null;
let lastVisionSampleAt = 0;
let lastMotionPoint = null;
let visionState = null;

document.addEventListener('DOMContentLoaded', () => {
  init3D();
  initTheme();
  initSpeech();
  initVisionState();
  initConfidenceModel();
  
  // Start Text Phase by default
  updateTextUI();
  
  window.toggleMobileMenu = () => {
    document.getElementById('mobileMenu').classList.toggle('active');
  };
  window.addEventListener('beforeunload', stopVisionTracking);
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

  if (id !== 'practice') stopVisionTracking();

  // Reset practice state if entering practice
  if(id === 'practice') {
    resetPracticeSession();
    document.getElementById('text-practice-container').style.display = 'block';
    document.getElementById('voice-practice-container').style.display = 'none';
    updateTextUI();
    startVisionTracking();
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

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function getWordCount(text) {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

function resetPracticeSession() {
  if (isRecording && recognition) recognition.stop();
  clearInterval(timerInt);
  stopVisionTracking();

  practicePhase = 'text';
  currentTextIndex = 0;
  currentVoiceIndex = 0;
  textAnswers = {};
  voiceAnswers = {};
  voiceDurations = {};
  currentTranscript = "";
  seconds = 0;
  isRecording = false;
  recordingStartedAt = null;

  document.getElementById('timer').textContent = "00:00";
  document.getElementById('recordStatus').textContent = "Tap Core to Record";
  document.getElementById('transcriptText').value = "";
  document.querySelector('.neural-core').classList.remove('recording');
  initVisionState();
  initConfidenceModel();
}

function initConfidenceModel() {
  const visionScore = visionState ? visionState.score : 55;
  confidenceModel = {
    startedAt: Date.now(),
    updatedAt: Date.now(),
    score: 55,
    metrics: {
      clarity: 55,
      relevance: 55,
      structure: 55,
      visualConfidence: visionScore,
      voiceScore: 55,
      textScore: 55,
      mcqScore: 55,
      totalFillers: 0,
      totalVoiceWords: 0
    }
  };
  updateLiveConfidenceUI();
}

function updateLiveConfidenceUI() {
  const liveScore = confidenceModel ? confidenceModel.score : 55;
  ['textLiveConfidence', 'voiceLiveConfidence'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = `Live Confidence: ${liveScore}%`;
  });
}

function initVisionState() {
  visionState = {
    score: 55,
    eyeContact: 55,
    posture: 55,
    stability: 55,
    frames: 0,
    available: false,
    active: false
  };
  updateVisionUI();
  setVisionStatus('Waiting to start...');
}

function smoothMetric(currentValue, nextValue, alpha = 0.15) {
  return Math.round((currentValue * (1 - alpha)) + (nextValue * alpha));
}

function setVisionStatus(message) {
  const el = document.getElementById('visionStatus');
  if (el) el.textContent = message;
}

function updateVisionUI() {
  const scoreEl = document.getElementById('visionLiveScore');
  const signalEl = document.getElementById('visionSignals');
  if (scoreEl) scoreEl.textContent = `${Math.round(visionState.score)}`;
  if (signalEl) {
    signalEl.textContent =
      `Eye contact: ${Math.round(visionState.eyeContact)} · ` +
      `Posture: ${Math.round(visionState.posture)} · ` +
      `Stability: ${Math.round(visionState.stability)}`;
  }
}

async function loadVisionModels() {
  if (faceLandmarker && poseLandmarker) return;
  if (visionLoadPromise) return visionLoadPromise;

  visionLoadPromise = (async () => {
    const visionModule = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/+esm');
    const { FaceLandmarker, PoseLandmarker, FilesetResolver } = visionModule;

    const filesetResolver = await FilesetResolver.forVisionTasks(
      'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.18/wasm'
    );

    faceLandmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task'
      },
      runningMode: 'VIDEO',
      numFaces: 1
    });

    poseLandmarker = await PoseLandmarker.createFromOptions(filesetResolver, {
      baseOptions: {
        modelAssetPath: 'https://storage.googleapis.com/mediapipe-models/pose_landmarker/pose_landmarker_lite/float16/1/pose_landmarker_lite.task'
      },
      runningMode: 'VIDEO',
      numPoses: 1
    });
  })().catch(error => {
    visionLoadPromise = null;
    throw error;
  });

  return visionLoadPromise;
}

function getDistance2D(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function getAveragePoint(points) {
  const total = points.reduce((acc, p) => ({ x: acc.x + p.x, y: acc.y + p.y }), { x: 0, y: 0 });
  return {
    x: total.x / points.length,
    y: total.y / points.length
  };
}

function computeIrisCenter(landmarks, indices) {
  const points = indices.map(i => landmarks[i]).filter(Boolean);
  if (points.length === 0) return null;
  return getAveragePoint(points);
}

function computeEyeCenterScore(landmarks, eyeInnerIndex, eyeOuterIndex, irisIndices) {
  const inner = landmarks[eyeInnerIndex];
  const outer = landmarks[eyeOuterIndex];
  const iris = computeIrisCenter(landmarks, irisIndices);
  if (!inner || !outer || !iris) return 55;

  const minX = Math.min(inner.x, outer.x);
  const maxX = Math.max(inner.x, outer.x);
  const range = Math.max(maxX - minX, 0.0001);
  const ratio = clamp((iris.x - minX) / range, 0, 1);
  const centeredDeviation = Math.abs(ratio - 0.5);
  return clamp(100 - centeredDeviation * 280, 0, 100);
}

function updateVisionMetrics(faceResult, poseResult) {
  const hasFace = faceResult && faceResult.faceLandmarks && faceResult.faceLandmarks.length > 0;
  const hasPose = poseResult && poseResult.landmarks && poseResult.landmarks.length > 0;

  let eyeContactScore = 55;
  let postureScore = 55;
  let stabilityScore = visionState.stability || 55;
  let trackingPoint = null;

  if (hasFace) {
    const face = faceResult.faceLandmarks[0];
    const leftEyeScore = computeEyeCenterScore(face, 33, 133, [468, 469, 470, 471]);
    const rightEyeScore = computeEyeCenterScore(face, 263, 362, [473, 474, 475, 476]);
    const gazeScore = (leftEyeScore + rightEyeScore) / 2;

    const leftEyeOuter = face[33];
    const rightEyeOuter = face[263];
    const noseTip = face[1];
    if (leftEyeOuter && rightEyeOuter && noseTip) {
      const eyeMidX = (leftEyeOuter.x + rightEyeOuter.x) / 2;
      const eyeWidth = Math.max(Math.abs(rightEyeOuter.x - leftEyeOuter.x), 0.02);
      const headYawNorm = Math.abs((noseTip.x - eyeMidX) / eyeWidth);
      const headScore = clamp(100 - headYawNorm * 120, 0, 100);

      eyeContactScore = Math.round(gazeScore * 0.7 + headScore * 0.3);
      trackingPoint = { x: noseTip.x, y: noseTip.y };
    } else {
      eyeContactScore = Math.round(gazeScore);
    }
  }

  if (hasPose) {
    const pose = poseResult.landmarks[0];
    const leftShoulder = pose[11];
    const rightShoulder = pose[12];
    const nose = pose[0];
    const leftEar = pose[7];
    const rightEar = pose[8];

    if (leftShoulder && rightShoulder && nose) {
      const shoulderTilt = Math.abs(leftShoulder.y - rightShoulder.y);
      const shoulderScore = clamp(100 - shoulderTilt * 360, 0, 100);

      const shoulderMidX = (leftShoulder.x + rightShoulder.x) / 2;
      const shoulderWidth = Math.max(Math.abs(rightShoulder.x - leftShoulder.x), 0.02);
      const headX = (leftEar && rightEar)
        ? (leftEar.x + rightEar.x) / 2
        : nose.x;
      const leanNorm = Math.abs(headX - shoulderMidX) / shoulderWidth;
      const leanScore = clamp(100 - leanNorm * 120, 0, 100);

      postureScore = Math.round(shoulderScore * 0.55 + leanScore * 0.45);
      if (!trackingPoint) trackingPoint = { x: nose.x, y: nose.y };
    }
  }

  if (trackingPoint) {
    if (lastMotionPoint) {
      const movement = getDistance2D(trackingPoint, lastMotionPoint);
      const frameStability = clamp(100 - movement * 2600, 0, 100);
      stabilityScore = smoothMetric(stabilityScore, frameStability, 0.22);
    }
    lastMotionPoint = trackingPoint;
  }

  const visibilityScore = hasFace && hasPose ? 100 : hasFace || hasPose ? 70 : 30;
  const visionScoreRaw =
    eyeContactScore * 0.45 +
    postureScore * 0.35 +
    stabilityScore * 0.20;
  const adjustedVisionScore = clamp(visionScoreRaw * (visibilityScore / 100), 0, 100);

  visionState.eyeContact = smoothMetric(visionState.eyeContact, eyeContactScore);
  visionState.posture = smoothMetric(visionState.posture, postureScore);
  visionState.stability = smoothMetric(visionState.stability, stabilityScore);
  visionState.score = smoothMetric(visionState.score, adjustedVisionScore);
  visionState.frames += 1;
  visionState.available = hasFace || hasPose;
  visionState.active = true;
  setVisionStatus(visionState.available ? 'Analyzing confidence' : 'Align face in camera');
  updateVisionUI();
}

function processVisionFrame() {
  if (!visionState.active) return;

  const video = document.getElementById('visionVideo');
  if (!video || video.readyState < 2 || !faceLandmarker || !poseLandmarker) {
    visionAnimationFrame = requestAnimationFrame(processVisionFrame);
    return;
  }

  const now = performance.now();
  if (now - lastVisionSampleAt >= 120) {
    const faceResult = faceLandmarker.detectForVideo(video, now);
    const poseResult = poseLandmarker.detectForVideo(video, now);
    updateVisionMetrics(faceResult, poseResult);
    recomputeConfidenceModel();
    lastVisionSampleAt = now;
  }

  visionAnimationFrame = requestAnimationFrame(processVisionFrame);
}

async function startVisionTracking() {
  try {
    stopVisionTracking();
    setVisionStatus('Loading model...');
    await loadVisionModels();
    setVisionStatus('Starting camera...');

    webcamStream = await navigator.mediaDevices.getUserMedia({
      video: {
        facingMode: 'user',
        width: { ideal: 640 },
        height: { ideal: 480 }
      },
      audio: false
    });

    const video = document.getElementById('visionVideo');
    video.srcObject = webcamStream;
    await video.play();

    visionState.active = true;
    visionState.available = false;
    lastMotionPoint = null;
    lastVisionSampleAt = 0;
    setVisionStatus('Analyzing confidence');
    processVisionFrame();
  } catch (error) {
    visionState.active = false;
    visionState.available = false;
    setVisionStatus('Camera permission needed');
    showToast('Camera permission is required for real confidence analysis', 'error');
    recomputeConfidenceModel();
  }
}

function stopVisionTracking() {
  if (visionAnimationFrame) {
    cancelAnimationFrame(visionAnimationFrame);
    visionAnimationFrame = null;
  }

  if (webcamStream) {
    webcamStream.getTracks().forEach(track => track.stop());
    webcamStream = null;
  }

  const video = document.getElementById('visionVideo');
  if (video) video.srcObject = null;

  if (visionState) visionState.active = false;
  setVisionStatus('Stopped');
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
                recomputeConfidenceModel();
            };
            optionsDiv.appendChild(btn);
        });
        container.appendChild(optionsDiv);
    } else {
        const textarea = document.createElement('textarea');
        textarea.className = 'text-answer-input fade-in';
        textarea.placeholder = "Type your answer here...";
        textarea.value = textAnswers[q.id] || "";
        textarea.oninput = (e) => {
          textAnswers[q.id] = e.target.value;
          recomputeConfidenceModel();
        };
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
function saveVoiceAnswer() {
  voiceAnswers[questions[currentVoiceIndex].id] = currentTranscript.trim();
  recomputeConfidenceModel();
}

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
    await navigator.mediaDevices.getUserMedia({ audio: true });
    isRecording = true;
    recordingStartedAt = Date.now();
    seconds = 0;
    currentTranscript = ""; 
    document.getElementById('timer').textContent = "00:00";
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
  if (!isRecording) return;

  isRecording = false;
  clearInterval(timerInt);
  if (recognition) recognition.stop();

  const questionId = questions[currentVoiceIndex].id;
  const elapsedSeconds = recordingStartedAt
    ? Math.max(1, Math.round((Date.now() - recordingStartedAt) / 1000))
    : Math.max(seconds, 1);
  voiceDurations[questionId] = (voiceDurations[questionId] || 0) + elapsedSeconds;
  recordingStartedAt = null;
  
  document.querySelector('.neural-core').classList.remove('recording');
  document.getElementById('recordStatus').textContent = "Tap Core to Record";
  
  saveVoiceAnswer();
  if (currentTranscript.length > 0) showToast('Answer saved', 'success');
}

function resetRec() {
  if (isRecording && recognition) recognition.stop();
  clearInterval(timerInt);
  isRecording = false;
  recordingStartedAt = null;
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
  const safeSeconds = Math.max(seconds, 30);
  const wpm = (words / safeSeconds) * 60;
  if (wpm >= 120 && wpm <= 160) return 100;
  if (wpm >= 100 && wpm < 120) return 80;
  if (wpm > 160 && wpm <= 180) return 70;
  return 50;
}

function recomputeConfidenceModel() {
  const mcqQuestions = textQuestions.filter(q => q.type === 'mcq');
  const openTextQuestions = textQuestions.filter(q => q.type === 'text');

  const answeredMcqs = mcqQuestions.filter(q => Number.isInteger(textAnswers[q.id]));
  const correctMcqs = answeredMcqs.filter(q => textAnswers[q.id] === q.correct).length;
  const mcqScore = answeredMcqs.length
    ? Math.round((correctMcqs / answeredMcqs.length) * 100)
    : 55;

  let textWordTotal = 0;
  let textSentenceTotal = 0;
  let textAnswered = 0;
  openTextQuestions.forEach(q => {
    const ans = (textAnswers[q.id] || "").trim();
    if (!ans) return;
    textAnswered++;
    textWordTotal += getWordCount(ans);
    textSentenceTotal += countSentences(ans);
  });

  const avgTextWords = textAnswered ? textWordTotal / textAnswered : 0;
  const avgTextSentences = textAnswered ? textSentenceTotal / textAnswered : 0;
  const textDepthScore = textAnswered ? clamp((avgTextWords / 45) * 100, 0, 100) : 55;
  const textStructureScore = textAnswered ? clamp((avgTextSentences / 3) * 100, 0, 100) : 55;
  const textScore = textAnswered
    ? Math.round(textDepthScore * 0.5 + textStructureScore * 0.5)
    : 55;

  let totalVoiceWords = 0;
  let totalFillers = 0;
  let totalVoiceSeconds = 0;
  let voiceAnswered = 0;
  questions.forEach(q => {
    const ans = (voiceAnswers[q.id] || "").trim();
    if (!ans) return;
    voiceAnswered++;
    totalVoiceWords += getWordCount(ans);
    totalFillers += countFillers(ans);
    totalVoiceSeconds += Math.max(voiceDurations[q.id] || 0, 15);
  });

  const effectiveVoiceSeconds = totalVoiceSeconds || (voiceAnswered * 30);
  const paceScore = voiceAnswered ? getSpeedScore(totalVoiceWords, effectiveVoiceSeconds) : 55;
  const fillerRatio = totalVoiceWords ? (totalFillers / totalVoiceWords) : 0;
  const clarityFromFillers = voiceAnswered ? clamp((1 - fillerRatio * 4) * 100, 35, 100) : 55;
  const completenessScore = voiceAnswered
    ? clamp(((totalVoiceWords / voiceAnswered) / 24) * 100, 0, 100)
    : 55;
  const voiceScore = voiceAnswered
    ? Math.round(paceScore * 0.35 + clarityFromFillers * 0.40 + completenessScore * 0.25)
    : 55;

  const answeredTotal = answeredMcqs.length + textAnswered + voiceAnswered;
  const expectedTotal = textQuestions.length + questions.length;
  const engagementScore = answeredTotal === 0
    ? 55
    : Math.round(clamp((0.35 + (answeredTotal / expectedTotal) * 0.65) * 100, 0, 100));

  const eyeContact = visionState ? Math.round(visionState.eyeContact) : 55;
  const posture = visionState ? Math.round(visionState.posture) : 55;
  const stability = visionState ? Math.round(visionState.stability) : 55;
  const visualConfidence = visionState ? Math.round(visionState.score) : 55;
  const visualWeight = visionState && visionState.available ? 0.24 : 0.10;
  const nonVisualScore =
    mcqScore * 0.24 +
    textScore * 0.24 +
    voiceScore * 0.37 +
    engagementScore * 0.15;

  const overallScore = Math.round(clamp(
    nonVisualScore * (1 - visualWeight) + (visualConfidence * visualWeight),
    0,
    100
  ));

  const clarity = Math.round(clamp(
    (paceScore * 0.3) + (clarityFromFillers * 0.35) + (eyeContact * 0.35),
    0,
    100
  ));
  const relevance = Math.round(clamp(
    (mcqScore * 0.5) + (textDepthScore * 0.35) + (stability * 0.15),
    0,
    100
  ));
  const structure = Math.round(clamp(
    (textStructureScore * 0.35) + (completenessScore * 0.35) + (posture * 0.30),
    0,
    100
  ));

  const startedAt = confidenceModel ? confidenceModel.startedAt : Date.now();
  confidenceModel = {
    startedAt,
    updatedAt: Date.now(),
    score: overallScore,
    metrics: {
      clarity,
      relevance,
      structure,
      visualConfidence,
      eyeContact,
      posture,
      stability,
      voiceScore,
      textScore,
      mcqScore,
      totalFillers,
      totalVoiceWords
    }
  };

  updateLiveConfidenceUI();
  return confidenceModel;
}

function getScoreSummary(score) {
  if (score > 85) return "Outstanding! You are interview ready.";
  if (score > 65) return "Strong performance. Minor refinements needed.";
  return "Good effort. Keep practicing.";
}


/* REPORT GENERATION (UPDATED) */
function generateReport() {
  const model = recomputeConfidenceModel();
  const finalScore = model.score;
  const {
    clarity,
    relevance,
    structure,
    visualConfidence,
    eyeContact,
    posture,
    voiceScore,
    textScore,
    mcqScore,
    totalFillers
  } = model.metrics;

  /* ===============================
     UPDATE UI
  =============================== */
  document.getElementById("overallScore").textContent = finalScore;
  document.querySelector(".circle").style.strokeDasharray = `${finalScore}, 100`;
  document.getElementById("feedbackSummary").textContent = getScoreSummary(finalScore);

  document.getElementById("barClarity").style.width = `${clarity}%`;
  document.getElementById("valClarity").textContent = `${clarity}%`;

  document.getElementById("barRelevance").style.width = `${relevance}%`;
  document.getElementById("valRelevance").textContent = `${relevance}%`;

  document.getElementById("barStructure").style.width = `${structure}%`;
  document.getElementById("valStructure").textContent = `${structure}%`;

  document.getElementById("barPresence").style.width = `${visualConfidence}%`;
  document.getElementById("valPresence").textContent = `${visualConfidence}%`;

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
  if (!visionState || !visionState.available)
    tips.push("Enable camera tracking for real eye-contact and posture-based confidence scoring.");
  if (visualConfidence < 60)
    tips.push("Keep your face centered, maintain eye contact, and sit upright for stronger confidence signals.");
  if (eyeContact < 60)
    tips.push("Look toward the camera more consistently to improve perceived confidence.");
  if (posture < 60)
    tips.push("Reduce leaning and keep shoulders level to project stronger posture.");

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
    mcqScore,
    visualConfidence
  });

  document.getElementById("aiReviewText").textContent = aiReview;

}

function generateAIReview({ finalScore, voiceScore, textScore, mcqScore, visualConfidence }) {
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

  if (visualConfidence < 60) {
    review += "Visual confidence signals were weak at times, especially around eye contact or posture. ";
  } else {
    review += "Your on-camera eye contact and posture reflected confident presence. ";
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
