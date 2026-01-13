/* ==========================================
   Interview Prep Buddy - JavaScript
   ========================================== */

// Mock Data
const questions = [
  {
    id: 1,
    question: "Tell me about yourself and your background.",
    category: "Behavioral",
    tip: "Focus on relevant experience and keep it under 2 minutes."
  },
  {
    id: 2,
    question: "Why do you want to work at our company?",
    category: "Motivation",
    tip: "Research the company beforehand and mention specific aspects that attract you."
  },
  {
    id: 3,
    question: "Describe a challenging project you worked on and how you overcame obstacles.",
    category: "Behavioral",
    tip: "Use the STAR method: Situation, Task, Action, Result."
  },
  {
    id: 4,
    question: "What are your greatest strengths and weaknesses?",
    category: "Self-Assessment",
    tip: "Be honest but strategic. For weaknesses, mention how you're improving."
  },
  {
    id: 5,
    question: "Where do you see yourself in 5 years?",
    category: "Career Goals",
    tip: "Show ambition while aligning with the role and company growth."
  }
];

// ==========================================
// State
// ==========================================
let currentQuestionIndex = 0;
let isRecording = false;
let mediaRecorder = null;
let audioChunks = [];
let timerInterval = null;
let seconds = 0;
let recognition = null;

// 🔥 FIXED STATE
let transcripts = {};     // { questionId: "answer" }
let transcript = "";      // current question transcript only

// ==========================================
// Initialize
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  updateQuestion();
  initSpeechRecognition();
});

// ==========================================
// Theme Toggle
// ==========================================
function initTheme() {
  const savedTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
}

function updateThemeIcon(theme) {
  document.querySelector('.theme-toggle').textContent =
    theme === 'dark' ? '☀️' : '🌙';
}

// ==========================================
// Page Navigation
// ==========================================
function showPage(pageName) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(`page-${pageName}`)?.classList.add('active');

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.toggle('active', link.dataset.page === pageName);
  });

  document.getElementById('mobileMenu')?.classList.remove('active');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// Question Navigation
// ==========================================
function updateQuestion() {
  const question = questions[currentQuestionIndex];

  document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
  document.getElementById('totalQuestions').textContent = questions.length;
  document.getElementById('questionCategory').textContent = question.category;
  document.getElementById('questionText').textContent = question.question;
  document.getElementById('questionTip').innerHTML = `💡 Tip: ${question.tip}`;

  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  document.getElementById('progressFill').style.width = `${progress}%`;

  document.getElementById('prevBtn').disabled = currentQuestionIndex === 0;

  const isLast = currentQuestionIndex === questions.length - 1;
  document.getElementById('nextBtn').style.display = isLast ? 'none' : 'inline-flex';
  document.getElementById('submitBtn').style.display = isLast ? 'inline-flex' : 'none';

  // 🔥 LOAD SAVED TRANSCRIPT
  const qId = question.id;
  transcript = transcripts[qId] || "";
  updateTranscript();

  document.getElementById('transcriptSection').style.display =
    transcript ? 'block' : 'none';

  resetRecorderUI();
}

function nextQuestion() {
  if (currentQuestionIndex < questions.length - 1) {
    currentQuestionIndex++;
    updateQuestion();
  }
}

function prevQuestion() {
  if (currentQuestionIndex > 0) {
    currentQuestionIndex--;
    updateQuestion();
  }
}

// ==========================================
// Speech Recognition
// ==========================================
function initSpeechRecognition() {
  if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognition = new SR();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onresult = (event) => {
      let finalText = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalText += event.results[i][0].transcript + ' ';
        }
      }

      transcript += finalText;
      updateTranscript();
    };

    recognition.onerror = () => stopRecording();
  }
}

// ==========================================
// Recording
// ==========================================
function toggleRecording() {
  isRecording ? stopRecording() : startRecording();
}

async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

    isRecording = true;
    transcript = transcripts[questions[currentQuestionIndex].id] || "";
    seconds = 0;

    updateRecordingUI(true);
    timerInterval = setInterval(updateTimer, 1000);

    recognition?.start();

    mediaRecorder = new MediaRecorder(stream);
    audioChunks = [];
    mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
    mediaRecorder.start();

  } catch {
    showToast('Microphone access denied', 'error');
  }
}

function stopRecording() {
  if (!isRecording) return;

  isRecording = false;
  clearInterval(timerInterval);
  recognition?.stop();

  if (mediaRecorder?.state !== 'inactive') {
    mediaRecorder.stop();
    mediaRecorder.stream.getTracks().forEach(t => t.stop());
  }

  // 🔥 SAVE TRANSCRIPT
  const qId = questions[currentQuestionIndex].id;
  transcripts[qId] = transcript;

  updateRecordingUI(false);

  if (transcript.trim()) {
    document.getElementById('transcriptSection').style.display = 'block';
  }

  showToast('Recording saved!', 'success');
}

// ==========================================
// UI Helpers
// ==========================================
function updateRecordingUI(isOn) {
  document.getElementById('recordIcon').textContent = isOn ? '⏹' : '⏺';
  document.getElementById('recordText').textContent =
    isOn ? 'Stop Recording' : 'Start Recording';
  document.querySelector('.status-icon').textContent = isOn ? '🔴' : '🎤';
  document.querySelector('.status-text').textContent =
    isOn ? 'Recording...' : 'Ready to record';
}

function resetRecorderUI() {
  clearInterval(timerInterval);
  seconds = 0;
  document.getElementById('timer').textContent = '00:00';
  updateRecordingUI(false);
}

function updateTimer() {
  seconds++;
  const m = String(Math.floor(seconds / 60)).padStart(2, '0');
  const s = String(seconds % 60).padStart(2, '0');
  document.getElementById('timer').textContent = `${m}:${s}`;
}

function updateTranscript() {
  document.getElementById('transcriptText').textContent =
    transcript || 'Your transcribed text will appear here...';
}

function copyTranscript() {
  navigator.clipboard.writeText(transcript);
  showToast('Copied!', 'success');
}




async function analyzeResponse() {
  const currentQ = questions[currentQuestionIndex];
  const userTranscript = transcripts[currentQ.id];

  if (!userTranscript || userTranscript.trim().length < 5) {
    showToast('Please record a longer answer first!', 'error');
    return;
  }

  const apiKey = window.ENV?.GEMINI_API_KEY;
  if (!apiKey) {
    showToast('API Key not found in env.js', 'error');
    return;
  }

  // Show loading state
  const submitBtn = document.getElementById('submitBtn');
  const originalText = submitBtn.innerHTML;
  submitBtn.disabled = true;
  submitBtn.innerHTML = 'Analyzing... ⏳';

  const prompt = `
    You are an expert technical interviewer. I will give you a mock interview question and my answer. 
    Analyze my answer and return a JSON object with the following structure (do NOT return markdown, just raw JSON):
    {
      "confidenceScore": number (0-100),
      "confidenceMessage": "short encouraging message",
      "clarityScore": number (0-100),
      "clarityFeedback": "short feedback on clarity",
      "relevanceScore": number (0-100),
      "relevanceFeedback": "short feedback on relevance",
      "structureScore": number (0-100),
      "structureFeedback": "short feedback on structure",
      "tips": ["tip 1", "tip 2", "tip 3"]
    }

    Question: "${currentQ.question}"
    Category: "${currentQ.category}"
    My Answer: "${userTranscript}"
  `;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message);
    }

    const aiText = data.candidates[0].content.parts[0].text;
    // Clean up potential markdown code blocks if Gemini sends them
    const cleanJson = aiText.replace(/```json/g, '').replace(/```/g, '').trim();
    const feedbackData = JSON.parse(cleanJson);

    populateFeedbackUI(feedbackData);
    showPage('feedback');
    showToast('Analysis Complete! 🚀', 'success');

  } catch (error) {
    console.error('AI Error:', error);
    showToast('Failed to get AI feedback. Try again.', 'error');
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalText;
  }
}

function populateFeedbackUI(data) {
  // Confidence
  document.querySelector('.confidence-value .score').textContent = data.confidenceScore;
  document.querySelector('.confidence-message').textContent = data.confidenceMessage;

  // Set ring stroke offset (100 - score) is not quite right for 283 circumference
  // Circumference = 2 * PI * 45 ≈ 283
  // Offset = 283 - (283 * score / 100)
  const circle = document.querySelector('.confidence-fill');
  const offset = 283 - (283 * data.confidenceScore / 100);
  circle.style.strokeDashoffset = offset;

  // Clarity
  document.querySelector('.feedback-icon.clarity').nextElementSibling.nextElementSibling.querySelector('.score-fill').style.width = `${data.clarityScore}%`;
  document.querySelector('.feedback-icon.clarity').parentNode.querySelector('.score-value').textContent = `${data.clarityScore}%`;
  document.querySelector('.feedback-icon.clarity').parentNode.querySelector('p').textContent = data.clarityFeedback;

  // Relevance
  document.querySelector('.feedback-icon.relevance').nextElementSibling.nextElementSibling.querySelector('.score-fill').style.width = `${data.relevanceScore}%`;
  document.querySelector('.feedback-icon.relevance').parentNode.querySelector('.score-value').textContent = `${data.relevanceScore}%`;
  document.querySelector('.feedback-icon.relevance').parentNode.querySelector('p').textContent = data.relevanceFeedback;

  // Structure
  document.querySelector('.feedback-icon.structure').nextElementSibling.nextElementSibling.querySelector('.score-fill').style.width = `${data.structureScore}%`;
  document.querySelector('.feedback-icon.structure').parentNode.querySelector('.score-value').textContent = `${data.structureScore}%`;
  document.querySelector('.feedback-icon.structure').parentNode.querySelector('p').textContent = data.structureFeedback;

  // Confidence (Grid Item) - Reusing main Confidence Score if needed or calculating separate
  document.querySelector('.feedback-icon.confidence').nextElementSibling.nextElementSibling.querySelector('.score-fill').style.width = `${data.confidenceScore}%`;
  document.querySelector('.feedback-icon.confidence').parentNode.querySelector('.score-value').textContent = `${data.confidenceScore}%`;
  document.querySelector('.feedback-icon.confidence').parentNode.querySelector('p').textContent = "Based on analysis of your tone and content.";

  // Tips
  const tipsList = document.querySelector('.tips-list');
  tipsList.innerHTML = '';
  data.tips.forEach(tip => {
    const li = document.createElement('li');
    li.textContent = tip;
    tipsList.appendChild(li);
  });
}

// ==========================================
// Toast
// ==========================================
function showToast(msg, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.textContent = msg;
  document.getElementById('toastContainer').appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}
