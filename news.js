
// --- SYSTEM AKTUALNOŚCI MOBILSHOT --- //
const STORAGE_KEY = "mobilshot_news";

function loadNews() {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
}

function saveNews(arr) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
}

function renderNews() {
    const box = document.getElementById("newsContainer");
    const news = loadNews();
    box.innerHTML = "";
    if (news.length === 0) {
        box.innerHTML = "<p>Brak aktualności.</p>";
        return;
    }
    news.forEach((item,i)=>{
        const el=document.createElement("div");
        el.className="news-item";
        el.innerHTML = `<h3>${item.title}</h3>
                        <p>${item.text}</p>
                        <small>${item.date}</small><br>
                        <button onclick="deleteNews(${i})" class="btn danger">Usuń</button>`;
        box.appendChild(el);
    });
}

function addNews() {
    const title = prompt("Tytuł aktualności:");
    if(!title) return;
    const text = prompt("Treść aktualności:");
    if(!text) return;
    const news = loadNews();
    news.push({title, text, date:new Date().toLocaleString("pl-PL")});
    saveNews(news);
    renderNews();
}

function deleteNews(i){
    const news = loadNews();
    news.splice(i,1);
    saveNews(news);
    renderNews();
}

function publishNews(){
    alert("Aktualności zostały zapisane i opublikowane.");
    renderNews();
}

document.addEventListener("DOMContentLoaded", renderNews);
