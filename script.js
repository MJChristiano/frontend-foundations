// Wait for the browser to fully load the HTML layout
document.addEventListener("DOMContentLoaded", () => {
    console.log("Your enterprise portfolio script is officially connected!");

    // ==========================================
    // 1. DATA PULL: Our Project Information Data
    // ==========================================
    const projectsData = [
        {
            badge: "JavaScript",
            title: "E-Commerce Dashboard",
            description: "A real-time sales tracker with interactive charts and dark-mode themes.",
            link: "ecommerce.html" 
        },
        {
            badge: "CSS Layouts",
            title: "SaaS Landing Page",
            description: "A pixel-perfect responsive layout designed to convert traffic into users.",
            link: "saas.html"
        },
        {
            badge: "API Integration",
            title: "Weather Forecast App",
            description: "Fetches real-time climate data using asynchronous JavaScript functions.",
            link: "weather.html"
        },
        {
            badge: "AI & Automation", 
            title: "My Awesome AI App",
            description: "Fetches real-time AI-generated data using asynchronous JavaScript functions.",
            link: "ai-app.html"
        },
        {
            badge: "Cinema & API", 
            title: "Movie Search App",
            description: "Explore and query live cinematic titles with dynamic card generation.",
            link: "movies.html"
        }
    ];

    // ==========================================
    // 2. DYNAMIC RENDERING ENGINE
    // ==========================================
    const projectsGrid = document.getElementById("projectsGrid");

    if (projectsGrid) {
        projectsGrid.innerHTML = ""; 
        projectsData.forEach(project => {
            const card = document.createElement("div");
            card.className = "project-card";
            card.innerHTML = `
                <div class="project-badge">${project.badge}</div>
                <h3>${project.title}</h3>
                <p>${project.description}</p>
                <a href="${project.link}" class="project-link">View Project &rarr;</a>
            `;
            projectsGrid.appendChild(card);
        });
    }

    // ==========================================
    // 3. PERSISTENT THEME ENGINE (localStorage)
    // ==========================================
    const themeToggle = document.getElementById("themeToggle");
    const savedTheme = localStorage.getItem("portfolio-theme");

    if (savedTheme === "light") {
        document.body.classList.add("light-mode");
        if (themeToggle) themeToggle.innerHTML = "🌙 Dark Mode";
    } else {
        document.body.classList.remove("light-mode");
        if (themeToggle) themeToggle.innerHTML = "☀️ Light Mode";
    }
    
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("light-mode");
            if (document.body.classList.contains("light-mode")) {
                themeToggle.innerHTML = "🌙 Dark Mode";
                localStorage.setItem("portfolio-theme", "light");
            } else {
                themeToggle.innerHTML = "☀️ Light Mode";
                localStorage.setItem("portfolio-theme", "dark");
            }
        });
    }

    // ==========================================
    // 3.5 SAAS PAGE PRICING CARD INTERACTIVITY
    // ==========================================
    const pricingSection = document.getElementById("pricingSection");
    const premiumDashboard = document.getElementById("premiumDashboard");
    const selectedPlanText = document.getElementById("selectedPlanText");
    const finalizeCheckoutBtn = document.getElementById("finalizeCheckoutBtn");

    if (pricingSection) {
        const pricingLinks = pricingSection.querySelectorAll(".project-card .project-link");
        pricingLinks.forEach(link => {
            link.addEventListener("click", (event) => {
                const planName = link.parentElement.querySelector("h3").innerText;
                if (planName === "Contact Us") {
                    event.preventDefault();
                    window.location.href = "index.html#contact";
                } else {
                    event.preventDefault();
                    if (premiumDashboard) {
                        pricingSection.style.display = "none"; 
                        premiumDashboard.style.display = "block"; 
                        if (selectedPlanText) selectedPlanText.innerText = planName; 
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                }
            });
        });
    }

    if (finalizeCheckoutBtn) {
        finalizeCheckoutBtn.addEventListener("click", () => {
            const currentPlan = selectedPlanText ? selectedPlanText.innerText : "Selected";
            alert(`Redirecting secure gateway integration to Stripe checkout for the ${currentPlan} plan...`);
        });
    }

    // ==========================================
    // 3.9 AI PROMPT TERMINAL INTERACTIVITY
    // ==========================================
    const aiPromptForm = document.getElementById("aiPromptForm");
    const promptInput = document.getElementById("promptInput");
    const personaSelect = document.getElementById("personaSelect");
    const aiResponseWrapper = document.getElementById("aiResponseWrapper");
    const aiResponseText = document.getElementById("aiResponseText");
    const copyAiBtn = document.getElementById("copyAiBtn");
    const aiHistoryList = document.getElementById("aiHistoryList");
    const clearHistoryBtn = document.getElementById("clearHistoryBtn");

    // Function to render AI prompt history from LocalStorage
    function renderAiHistory() {
        if (!aiHistoryList) return;
        const history = JSON.parse(localStorage.getItem("ai-prompt-history") || "[]");
        
        if (history.length === 0) {
            aiHistoryList.innerHTML = `<li class="ai-history-item ai-history-empty">No query history saved yet.</li>`;
            return;
        }

        aiHistoryList.innerHTML = "";
        history.forEach(item => {
            const li = document.createElement("li");
            li.className = "ai-history-item";
            li.textContent = `[${item.persona.toUpperCase()}] ${item.prompt}`;
            li.addEventListener("click", () => {
                if (promptInput) promptInput.value = item.prompt;
                if (personaSelect) personaSelect.value = item.persona;
            });
            aiHistoryList.appendChild(li);
        });
    }

    if (aiPromptForm && promptInput && aiResponseText) {
        renderAiHistory();

        aiPromptForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const prompt = promptInput.value.trim();
            const persona = personaSelect ? personaSelect.value : "general";
            if (!prompt) return;

            if (aiResponseWrapper) aiResponseWrapper.style.display = "block";
            aiResponseText.textContent = "Processing query with NeuralCore AI engine...";

            try {
                const apiBase = window.location.port === "8000" ? "" : "http://127.0.0.1:8000";
                const response = await fetch(`${apiBase}/api/ai`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ prompt: prompt, persona: persona })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || "Failed to generate AI response.");

                aiResponseText.textContent = data.response;

                // Save query to localStorage history (keep last 5)
                const history = JSON.parse(localStorage.getItem("ai-prompt-history") || "[]");
                history.unshift({ prompt: prompt, persona: persona });
                localStorage.setItem("ai-prompt-history", JSON.stringify(history.slice(0, 5)));
                renderAiHistory();

                aiPromptForm.reset();
            } catch (error) {
                aiResponseText.textContent = `Error: ${error.message}`;
            }
        });
    }

    if (copyAiBtn && aiResponseText) {
        copyAiBtn.addEventListener("click", () => {
            const textToCopy = aiResponseText.textContent;
            if (textToCopy) {
                navigator.clipboard.writeText(textToCopy).then(() => {
                    const originalText = copyAiBtn.textContent;
                    copyAiBtn.textContent = "✅ Copied!";
                    setTimeout(() => copyAiBtn.textContent = originalText, 2000);
                });
            }
        });
    }

    if (clearHistoryBtn) {
        clearHistoryBtn.addEventListener("click", () => {
            localStorage.removeItem("ai-prompt-history");
            renderAiHistory();
        });
    }

    // ==========================================
    // 3.95 E-COMMERCE TRANSACTION FILTER & ADD ORDER
    // ==========================================
    const filterGroup = document.getElementById("transactionFilterGroup");
    const transactionGrid = document.getElementById("transactionGrid");
    const addTransactionForm = document.getElementById("addTransactionForm");
    let nextOrderNum = 4093;

    if (filterGroup && transactionGrid) {
        const filterBtns = filterGroup.querySelectorAll(".filter-btn");
        filterBtns.forEach(btn => {
            btn.addEventListener("click", () => {
                filterBtns.forEach(b => b.classList.remove("active"));
                btn.classList.add("active");
                const filter = btn.dataset.filter;

                const items = transactionGrid.querySelectorAll(".transaction-item");
                items.forEach(item => {
                    if (filter === "all" || item.dataset.status === filter) {
                        item.style.display = "block";
                    } else {
                        item.style.display = "none";
                    }
                });
            });
        });
    }

    if (addTransactionForm && transactionGrid) {
        addTransactionForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const customerName = document.getElementById("newCustomerInput").value.trim();
            const amount = parseFloat(document.getElementById("newAmountInput").value).toFixed(2);
            const status = document.getElementById("newStatusInput").value;

            if (customerName && !isNaN(amount)) {
                const newCard = document.createElement("div");
                newCard.className = "transaction-item";
                newCard.dataset.status = status;
                newCard.innerHTML = `
                    <strong>Order #${nextOrderNum++}</strong>
                    <span>Customer: ${customerName}</span>
                    <span>Amount: $${amount}</span>
                    <span>Status: ${status}</span>
                `;
                transactionGrid.prepend(newCard);
                addTransactionForm.reset();
            }
        });
    }

    // ==========================================
    // 4.0 REAL LIVE MOVIE SEARCH LOGIC (OMDb API)
    // ==========================================
    const movieForm = document.getElementById("movieSearchForm");
    const movieInput = document.getElementById("movieInput");
    const movieResultsGrid = document.getElementById("movieResultsGrid");

    if (movieForm && movieInput && movieResultsGrid) {
        movieForm.addEventListener("submit", async (event) => {
            event.preventDefault();
            const title = movieInput.value.trim();
            if (!title) return;

            movieResultsGrid.innerHTML = `<div class="project-card"><p>Searching for ${title}...</p></div>`;

            try {
                const apiBase = window.location.port === "8000" ? "" : "http://127.0.0.1:8000";
                const response = await fetch(`${apiBase}/api/movies?title=${encodeURIComponent(title)}`);
                const movie = await response.json();
                if (!response.ok) throw new Error(movie.error);

                const poster = movie.Poster !== "N/A"
                    ? `<img src="${movie.Poster}" alt="${movie.Title} poster" class="movie-poster">`
                    : "";
                movieResultsGrid.innerHTML = `
                    <article class="project-card full-width-card">
                        ${poster}
                        <div class="project-badge">${movie.Type} - ${movie.Year}</div>
                        <h3>${movie.Title}</h3>
                        <p>IMDb rating: ${movie.imdbRating} / 10 | ${movie.Runtime} | ${movie.Genre}</p>
                        <p>${movie.Plot}</p>
                    </article>
                `;
                movieForm.reset();
            } catch (error) {
                movieResultsGrid.innerHTML = `<div class="project-card"><h3>Search unavailable</h3><p>${error.message}</p></div>`;
            }
        });
    }

    // ==========================================
    // 4. POPUP MODAL LOGIC 
    // ==========================================
    const modal = document.querySelector(".modal-overlay");
    const closeBtn = document.querySelector(".close-modal-btn");

    if (closeBtn && modal) {
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }

    // ==========================================
    // 5. CONTACT FORM INTERACTIVITY LOGIC
    // ==========================================
    const contactForm = document.getElementById("mainContactForm");
    
    if (contactForm) {
        contactForm.addEventListener("submit", (event) => {
            event.preventDefault();
            const nameValue = document.getElementById("userName").value;
            const emailValue = document.getElementById("userEmail").value;
            alert(`Thank you, ${nameValue}! Your message has been sent successfully. We will reach out to you at ${emailValue}.`);
            contactForm.reset();
        });
    }
});