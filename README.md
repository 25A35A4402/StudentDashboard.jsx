# 📘 Student Marks Analyzer

A web-based dashboard for analyzing student marks, computing grades, and ranking students across five subjects — **DMGT, JAVA, IDS, UHV, and ADSAA**.

Built as a React artifact (runs entirely in the browser — no backend needed).

---

## 🖥️ Live Features

| Feature | Description |
|---|---|
| 🏆 Rankings Tab | Full ranking table with medal icons, score bars, grades |
| 📋 All Details Tab | Complete raw data view with all subject marks |
| 🔍 Search Tab | Search student by name or roll number |
| 🎉 Class Topper | Auto-highlighted topper banner at the top |
| 📂 CSV Upload | Drag-and-drop or click-to-upload your own CSV |
| 📊 Stats Summary | Quick stats — total students, class average, top score, A+ count |

---

## 🚀 Getting Started

### Option 1 — Run in Claude (No Setup)

Paste the `StudentDashboard.jsx` code directly into [Claude.ai](https://claude.ai) as a React artifact. It runs instantly in the browser with sample data preloaded.

### Option 2 — Run Locally with React

**Prerequisites:** Node.js (v16+), npm

```bash
# 1. Clone the repo
git clone https://github.com/your-username/student-marks-analyzer.git
cd student-marks-analyzer

# 2. Create a new React app
npx create-react-app .

# 3. Install dependencies
npm install papaparse

# 4. Replace src/App.js with StudentDashboard.jsx content

# 5. Start the app
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
student-marks-analyzer/
│
├── StudentDashboard.jsx   # Main React component (entire app)
├── README.md              # This file
└── sample_data.csv        # Optional: sample CSV to test with
```

---

## 📄 CSV Format

Your CSV file must have these exact column headers:

```
Roll_No,Name,DMGT,JAVA,IDS,UHV,ADSAA
1,Aarav Sharma,88,92,85,90,94
2,Bhavana Reddy,76,80,78,72,85
...
```

> The dashboard auto-calculates Total, Average, Grade, and Rank from the uploaded file.

---

## 🎯 Grading System

| Average Score | Grade |
|---|---|
| 90 and above | A+ |
| 80 – 89 | A |
| 70 – 79 | B |
| 60 – 69 | C |
| Below 60 | D |

Ranking uses **minimum rank method** — students with equal totals share the same rank.

---

## 🛠️ Tech Stack

- **React** (functional components + hooks)
- **PapaParse** — CSV parsing
- **Tailwind-compatible inline styles** — no external CSS framework needed
- **Google Fonts** — DM Sans + Space Mono

---

## 📌 Original Streamlit Version

This project was originally built with **Python + Streamlit** and reads from a local CSV file:

```python
import streamlit as st
import pandas as pd

file_path = r"C:\Users\gunasri\Downloads\andhra_student_marks_DMGT_JAVA_IDS_UHV_ADSAA.csv"
df = pd.read_csv(file_path)
```

The React version replaces the local file path with an in-browser CSV uploader so it works anywhere without a Python environment.

To run the original Streamlit version:

```bash
pip install streamlit pandas
streamlit run app.py
```

---

## 🙌 Contributing

Pull requests are welcome! If you'd like to add features like:

- Bar/pie charts for subject-wise performance
- Export results to PDF or Excel
- Dark/light theme toggle
- Per-subject topper highlight

Feel free to fork and submit a PR.

---

## 📃 License

This project is open source and available under the [MIT License](LICENSE).
