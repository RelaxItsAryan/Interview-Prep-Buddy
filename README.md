# 🎯 Interview Prep Buddy

# Website Link- [interview-buddy.netlify.app](https://interview-buddy.netlify.app/)
An **open-source interview practice web application** built using **HTML, CSS, and JavaScript**.  
It helps students practice mock interview questions using **voice-based answers**, view **live transcripts**, and explore a **future-ready AI feedback interface**.

This project is designed as a **frontend-first, beginner-friendly open-source project** with clear extension points for AI and backend integration.

---

## ✨ Features

- 🎤 Voice-based interview answers (microphone recording)
- 📝 Live speech-to-text transcription (Web Speech API)
- 📚 Mock interview questions with categories & tips
- 🎥 Pretrained webcam confidence model (eye contact, posture, movement)
- 📊 Real-time confidence score from interview start
- 🤖 Session analysis with heuristic AI-style feedback (frontend)
- 🌗 Dark / Light mode toggle (saved in localStorage)
- 📱 Fully responsive modern UI
- 🧭 Single Page App-style navigation

---

## 🛠 Tech Stack

- **HTML5** – Structure & layout  
- **CSS3** – Styling, theming, responsiveness  
- **Vanilla JavaScript** – App logic & interactions  
- **Web Speech API** – Speech-to-text (temporary solution)
- **MediaPipe Tasks Vision** – Pretrained face + pose landmark inference in browser

> 🔮 Planned (Not implemented yet):
> - Whisper API for accurate transcription  
> - FastAPI backend  
> - Advanced NLP-based feedback & calibrated confidence scoring  

---

## 📁 Project Structure

```
interview-prep-buddy/
├── index.html      # Main HTML file (all pages)
├── styles.css      # Styling, themes, responsiveness
├── script.js       # App logic & interactions
└── README.md       # Project documentation
```

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/RelaxItsAryan/Interview-Prep-Buddy.git
cd interview-prep-buddy
```

### 2️⃣ Run the Project
Simply open `index.html` in your browser:

```bash
open index.html
```

✅ Recommended: Use **Live Server** extension in VS Code.

---

## 🎤 Voice Recording & Transcription

- Uses browser microphone permissions
- Records voice responses
- Converts speech to text using the **Web Speech API**
- Displays transcript after recording

⚠️ Accuracy depends on browser and mic quality.  
This will be replaced by **Whisper API** in future versions.

---

## 🎥 Camera Confidence Analysis

When practice starts, the app opens your webcam and runs **pretrained face and pose models** in-browser to estimate:
- Eye-contact consistency
- Posture quality
- Movement stability

These signals are combined with your text + voice responses for a real-time confidence score.

### Planned Improvements:
- NLP-based answer evaluation
- Advanced multimodal confidence calibration
- Backend-powered AI feedback

---

## 🧑‍🎓 Open Source Contributions

This project is **beginner-friendly** and ideal for students.

### Areas to Contribute:
- 🎨 UI/UX improvements
- 🧩 JavaScript logic enhancements
- 📚 Adding interview questions
- 🤖 AI feedback logic (future)
- 🗣 Speech / Whisper API integration
- 📄 Documentation updates

Look for `// TODO:` comments inside `script.js`.

---

## 🗺 Roadmap

- [ ] FastAPI backend
- [ ] Whisper-based speech-to-text
- [ ] NLP feedback engine
- [ ] Confidence analytics
- [ ] User profiles

---

## 🤝 Contributing

1. Fork the repository
2. Create a new branch
3. Make your changes
4. Submit a Pull Request 🚀

All contributions are welcome!

---

## 📜 License

This project is licensed under the **MIT License**.

---

## ⭐ Support

If you find this project helpful:
- ⭐ Star the repository
- 🍴 Fork it
- 🧑‍💻 Contribute

Built by students, for students ❤️
