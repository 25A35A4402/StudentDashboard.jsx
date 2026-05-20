# 📘 Student Marks Analyzer

A web-based dashboard for analyzing student marks, computing grades, and ranking students across five subjects — **DMGT, JAVA, IDS, UHV, and ADSAA**.

Built as a single `index.html` file — no installation, no build step, runs directly in the browser.

🔗 **Live Demo:** [Click here to open the dashboard](https://25a35a4402.github.io/StudentDashboard.jsx/)

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

## 📁 Project Structure

```
your-repo/
├── index.html             # ✅ Main dashboard — opens directly on link click
├── StudentDashboard.jsx   # React source component
└── README.md              # This file
```

> GitHub Pages automatically serves `index.html` as the homepage when you visit the link.

---

## 📄 CSV Format

Your CSV file must have these exact column headers:

```
Roll_No,Name,DMGT,JAVA,IDS,UHV,ADSAA
1,Aarav Sharma,88,92,85,90,94
2,Bhavana Reddy,76,80,78,72,85
...
```

> The dashboard auto-calculates Total, Average, Grade, and Rank from the uploaded file. Sample data is preloaded by default.

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

- **React 18** (via CDN — no npm needed)
- **PapaParse** — in-browser CSV parsing
- **Babel Standalone** — JSX compiled in browser
- **Google Fonts** — DM Sans + Space Mono

---

## ⚙️ GitHub Pages Setup

To host this on your own GitHub Pages:

1. Upload `index.html` to your repository
2. Go to **Settings → Pages**
3. Set Source: **Deploy from branch** → Branch: `main` → Folder: `/ (root)`
4. Save — your dashboard will be live in 1–2 minutes at `https://your-username.github.io/your-repo/`

---

## 📌 Original Streamlit Version

This project was originally built with **Python + Streamlit**:

```python
import streamlit as st
import pandas as pd

file_path = r"C:\Users\gunasri\Downloads\andhra_student_marks_DMGT_JAVA_IDS_UHV_ADSAA.csv"
df = pd.read_csv(file_path)
```

The `index.html` version replaces the local file path with an in-browser CSV uploader, so it works anywhere without Python or any setup.

---

## 📃 License

This project is open source and available under the [MIT License](LICENSE).
