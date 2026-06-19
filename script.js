const API_KEY = "33538faf591156da859e085226f611f8";

const container = document.getElementById("newsContainer");
const loadingMsg = document.getElementById("loading");
const errorMsg = document.getElementById("error");

async function fetchNews(topic = "general") {
loadingMsg.textContent = "Fetching news...";
errorMsg.textContent = "";
container.innerHTML = "";

try {
    const url = `https://corsproxy.io/?https://gnews.io/api/v4/top-headlines?country=in&lang=en&topic=${topic}&token=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Unable to fetch news");
    }

    const result = await response.json();

    if (!result.articles || result.articles.length === 0) {
        errorMsg.textContent = "No articles found";
        return;
    }

    showNews(result.articles);

} catch (err) {
    console.error(err);
    errorMsg.textContent = "Unable to load news";
}

loadingMsg.textContent = "";

}

function showNews(articles) {
container.innerHTML = "";

articles.forEach(item => {
    const newsCard = document.createElement("div");
    newsCard.className = "news-card";

    newsCard.innerHTML = `
        <img src="${item.image || 'https://via.placeholder.com/300x200'}" alt="News">
        <h3>${item.title}</h3>
        <p>${item.description || "Description not available."}</p>
        <a href="${item.url}" target="_blank">View Details</a>
    `;

    container.appendChild(newsCard);
});

}

async function searchNews() {
const searchText = document.getElementById("searchInput").value.trim();

if (!searchText) return;

loadingMsg.textContent = "Fetching news...";
errorMsg.textContent = "";
container.innerHTML = "";

try {
    const url = `https://corsproxy.io/?https://gnews.io/api/v4/search?q=${encodeURIComponent(searchText)}&lang=en&token=${API_KEY}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error("Search error");
    }

    const result = await response.json();

    if (!result.articles || result.articles.length === 0) {
        errorMsg.textContent = "No matching results";
        return;
    }

    showNews(result.articles);

} catch (err) {
    console.error(err);
    errorMsg.textContent = "Search unsuccessful";
}

loadingMsg.textContent = "";

}

document.getElementById("searchBtn")
.addEventListener("click", searchNews);

document.querySelectorAll(".category")
.forEach(btn => {
btn.addEventListener("click", () => {
fetchNews(btn.dataset.topic);
});
});

fetchNews();