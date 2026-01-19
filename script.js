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

// --- APP LOGIC (Batch) ---
const questions = [
  { id: 1, question: "Tell me about yourself.", category: "Behavioral", tip: "Keep it under 2 minutes. Start with your current role." },
  { id: 2, question: "Why do you want to work here?", category: "Motivation", tip: "Connect your skills to the company mission." },
  { id: 3, question: "Describe a challenge you faced.", category: "Behavioral", tip: "Use STAR: Situation, Task, Action, Result." },
  { id: 4, question: "What are your greatest strengths?", category: "Self-Awareness", tip: "Choose strengths relevant to the job." },
  { id: 5, question: "Where do you see yourself in 5 years?", category: "Future Goals", tip: "Show ambition that aligns with the company." }
];

let currentIndex = 0;
let answers = {};
let isRecording = false;
let recognition = null;
let currentTranscript = "";
let timerInt;
let seconds = 0;

document.addEventListener('DOMContentLoaded', () => {
  init3D();
  initTheme();
  updateUI();
  initSpeech();
  
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

/* PRACTICE LOGIC */
function updateUI() {
  const q = questions[currentIndex];
  document.getElementById('currentQuestion').textContent = currentIndex + 1;
  document.getElementById('questionCategory').textContent = q.category;
  document.getElementById('questionText').textContent = q.question;
  document.getElementById('questionTip').textContent = `Tip: ${q.tip}`;
  
  const pct = ((currentIndex + 1) / questions.length) * 100;
  document.getElementById('progressFill').style.width = `${pct}%`;

  document.getElementById('prevBtn').disabled = currentIndex === 0;
  
  if (currentIndex === questions.length - 1) {
    document.getElementById('nextBtn').style.display = 'none';
    document.getElementById('finishBtn').style.display = 'block';
  } else {
    document.getElementById('nextBtn').style.display = 'block';
    document.getElementById('finishBtn').style.display = 'none';
  }

  currentTranscript = answers[q.id] || "";
  document.getElementById('transcriptText').value = currentTranscript;
  resetRec();
}

function nextQuestion() { saveAnswer(); currentIndex++; updateUI(); }
function prevQuestion() { saveAnswer(); currentIndex--; updateUI(); }
function saveAnswer() { answers[questions[currentIndex].id] = currentTranscript; }

function finishSession() {
  saveAnswer();
  const count = Object.values(answers).filter(a => a.trim().length > 0).length;
  if (count === 0) {
    showToast('Please record at least one answer', 'error');
    return;
  }
  showToast('Analyzing session...', 'success');
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
  
  saveAnswer();
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

/* REPORT GENERATION */
function generateReport() {
  let totalWords = 0;
  Object.values(answers).forEach(a => totalWords += a.split(' ').length);
  
  const score = Math.min(100, Math.max(40, totalWords / 3));
  const scoreInt = Math.round(score);
  
  document.getElementById('overallScore').textContent = scoreInt;
  document.querySelector('.circle').style.strokeDasharray = `${scoreInt}, 100`;
  document.getElementById('feedbackSummary').textContent = scoreInt > 80 ? "Excellent! You are interview ready." : "Good start! Expand on your answers.";
  
  document.getElementById('barClarity').style.width = `${Math.min(100, scoreInt + 5)}%`;
  document.getElementById('valClarity').textContent = `${Math.min(100, scoreInt + 5)}%`;
  
  document.getElementById('barRelevance').style.width = `${Math.min(100, scoreInt - 5)}%`;
  document.getElementById('valRelevance').textContent = `${Math.min(100, scoreInt - 5)}%`;
  
  document.getElementById('barStructure').style.width = `${Math.min(100, scoreInt)}%`;
  document.getElementById('valStructure').textContent = `${Math.min(100, scoreInt)}%`;

  const tips = ["Use the STAR method.", "Quantify your achievements.", "Speak confidently."];
  const list = document.getElementById('tipsList');
  list.innerHTML = "";
  tips.forEach(t => {
    const li = document.createElement('li');
    li.textContent = t;
    list.appendChild(li);
  });
}

function copyTranscript() {
  const text = document.getElementById('transcriptText');
  text.select();
  document.execCommand('copy');
  showToast('Copied to clipboard', 'success');
}

function showToast(msg, type) {
  const t = document.createElement('div');
  t.className = 'toast';
  t.textContent = msg;
  if(type === 'error') t.style.borderLeftColor = '#f43f5e';
  document.getElementById('toastContainer').appendChild(t);
  setTimeout(() => t.remove(), 3000);
}