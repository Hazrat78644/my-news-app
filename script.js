const COMMON_API_KEY = "pub_28917f8ed8e3e295f249c675b04c8b0066c5f";
const COMMON_URL = "https://newsdata.io/api/1/news";

// Function to reload the page
function reload() {
    window.location.reload();
}

// Function to fetch news data based on a query and language
async function fetchNews(query, language = "en") {
    try {
        const res = await fetch(`${COMMON_URL}?apikey=${COMMON_API_KEY}&q=${query}&language=${language}`);
        const data = await res.json();
        bindData(data.results);
    } catch (error) {
        console.error('Error fetching news:', error);
    }
}

// Function to bind (display) the news data to the HTML template
function bindData(articles) {
    const cardsContainer = document.querySelector('.cards-container');
    const newsCardTemplate = document.getElementById('template-news-card');
    cardsContainer.innerHTML = '';

    articles.forEach(article => {
        if (!article.image_url) return;
        const cardClone = newsCardTemplate.content.cloneNode(true);

        cardClone.querySelector('.card-header img').src = article.image_url;
        cardClone.querySelector('#news-title').textContent = article.title;

        const formattedDate = new Date(article.pubDate).toLocaleString("en-US", { timeZone: "Asia/Jakarta" });
        cardClone.querySelector('#news-source').textContent = `${article.source_id} : ${formattedDate}`;

        cardClone.querySelector('#news-desc').textContent = article.description;

        cardClone.firstElementChild.addEventListener("click", () => {
            window.open(article.link, "_blank");
        });

        cardsContainer.appendChild(cardClone);
    });
}

// Function to handle clicks on navigation items
function onNavItemClick(id) {
    const curSelectedNav = document.querySelector('.active');
    if (curSelectedNav) {
        curSelectedNav.classList.remove('active');
    }
    fetchNews(id);
    document.getElementById(id).classList.add('active');
}

// Function to toggle between dark and light mode
function toggleDarkMode() {
    const body = document.body;
    const darkModeEnabled = body.classList.toggle('dark-mode');
    const elementsToToggle = ['nav', '.news-input', 'h3', 'h6', 'p'];

    elementsToToggle.forEach(elementSelector => {
        const element = document.querySelector(elementSelector);
        if (element) {
            element.classList.toggle('dark-mode-text');
        }
    });

    const darkModeToggleBtn = document.getElementById('dark-mode-toggle');
    if (darkModeToggleBtn) {
        darkModeToggleBtn.innerHTML = darkModeEnabled ? '<i class="fas fa-sun"></i> light mode' : '<i class="fas fa-moon"></i> dark mode';
    }

    localStorage.setItem('darkMode', darkModeEnabled);
}

// Function to handle search button click event
function searchNews() {
    const searchText = document.getElementById('search-text').value;
    if (!searchText) return;
    fetchNews(searchText);
    const curSelectedNav = document.querySelector('.active');
    if (curSelectedNav) {
        curSelectedNav.classList.remove('active');
    }
}

// Check for user's dark mode preference in local storage and apply it
function checkDarkModePreference() {
    const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
    if (darkModeEnabled) {
        toggleDarkMode();
    }
}

// Call functions when the page loads
window.addEventListener("load", () => {
    fetchNews("India");
    checkDarkModePreference();
});

// Add event listeners
const searchButton = document.getElementById('search-button');
if (searchButton) {
    searchButton.addEventListener("click", searchNews);
}
