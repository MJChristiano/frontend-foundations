# Frontend Foundations

A modern, responsive multi-page web application portfolio built with vanilla **HTML5**, **CSS3**, **JavaScript (ES6+)**, and a custom **Python API Server**.

---

## 🚀 Projects Included

This repository showcases six core frontend applications:

1. **Portfolio Home (`index.html`)**: Dynamic project grid, developer journey showcase, theme switcher, contact form, and popup newsletter modal.
2. **CineSearch Movie Explorer (`movies.html`)**: Interactive movie search app fetching live title data, ratings, release years, and poster graphics from TMDB via a Python backend proxy.
3. **Weather Forecast App (`weather.html`)**: Fetches real-time temperature, wind speed, and dynamic location maps from the Open-Meteo & OpenStreetMap APIs.
4. **AI & Automation Dashboard (`ai-app.html`)**: Neural network interface simulator for testing model prompts and routing pipeline queries.
5. **E-Commerce Dashboard (`ecommerce.html`)**: Interactive sales metrics tracker with dynamic chart views and product management tables.
6. **SaaS Landing Page (`saas.html`)**: Pixel-perfect responsive pricing showcase with interactive checkout modal preview.

---

## 🛠 Tech Stack

- **Frontend**: HTML5, CSS3 (Flexbox & Grid, CSS Custom Properties), JavaScript (Vanilla ES6+, Async/Await, Fetch API, LocalStorage).
- **Backend Proxy**: Python 3 (`http.server` module with threading and JSON response handling).
- **APIs**:
  - [TMDB API](https://www.themoviedb.org/settings/api) (The Movie Database) for cinematic data.
  - [Open-Meteo API](https://open-meteo.com/) for live climate metrics.
  - [OpenStreetMap](https://www.openstreetmap.org/) for embedded location rendering.

---

## ⚙️ Getting Started & Installation

### Prerequisites
- [VS Code](https://code.visualstudio.com/) with the **Live Server** extension installed.
- [Python 3.x](https://www.python.org/) installed on your machine.

### Running the Application

1. **Start the Frontend**:
   - Open VS Code in this directory.
   - Right-click `index.html` and select **Open with Live Server**.

2. **Start the Python API Backend** (Required for Movie Search):
   - Open your terminal in the project directory and run:
     ```bash
     python server.py
     ```
   - The backend server will run on `http://127.0.0.1:8000`.

---

## 📁 Repository Structure

```text
├── index.html         # Main Portfolio Home
├── movies.html        # Movie Explorer Interface
├── weather.html       # Weather Forecast Interface
├── ai-app.html        # AI Dashboard Interface
├── ecommerce.html     # E-Commerce Dashboard
├── saas.html          # SaaS Pricing Landing Page
├── style.css          # Global Stylesheet & CSS Variables
├── script.js          # Shared JS Interactions & Movie API Client
├── weather.js         # Weather API Integration Logic
├── server.py          # Python Backend Proxy for TMDB API
└── README.md          # Documentation
```

---

## 👤 Author

Developed by **Michael Christiano** as part of front-end engineering mastery.
