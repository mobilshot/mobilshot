// Simple local gallery stored in localStorage as base64 data URLs
const GALLERY_KEY = "mobilshot_gallery";

function loadGallery() {
    const raw = localStorage.getItem(GALLERY_KEY);
    return raw ? JSON.parse(raw) : [];
}

function saveGallery(arr) {
    localStorage.setItem(GALLERY_KEY, JSON.stringify(arr));
}

function renderGallery() {
    const grid = document.getElementById("galleryGrid");
    const items = loadGallery();
    grid.innerHTML = "";
    if (items.length === 0) {
        grid.innerHTML = "<p>Galeria jest pusta.</p>";
        return;
    }
    items.forEach((item, idx) => {
        const el = document.createElement("div");
        el.className = "gallery-item";
        el.innerHTML = `
            <img src="${item.data}" alt="${item.name}">
            <div style="font-size:12px; margin-bottom:6px;">${item.name}</div>
            <button class="btn secondary" onclick="downloadImage(${idx})">Pobierz</button>
            <button class="btn danger" onclick="deleteImage(${idx})">Usuń</button>
        `;
        grid.appendChild(el);
    });
}

function addFiles(files) {
    const readerPromises = Array.from(files).map(file => {
        return new Promise((res, rej) => {
            const r = new FileReader();
            r.onload = () => res({ name: file.name, data: r.result });
            r.onerror = () => rej();
            r.readAsDataURL(file);
        });
    });

    Promise.all(readerPromises).then(newItems => {
        const existing = loadGallery();
        const merged = existing.concat(newItems);
        saveGallery(merged);
        renderGallery();
        alert("Dodano " + newItems.length + " zdjęć do galerii.");
    }).catch(() => {
        alert("Błąd przy wczytywaniu plików.");
    });
}

function deleteImage(idx) {
    if (!confirm("Usunąć to zdjęcie z galerii?")) return;
    const items = loadGallery();
    items.splice(idx,1);
    saveGallery(items);
    renderGallery();
}

function clearGallery() {
    if (!confirm("Wyczyścić całą galerię?")) return;
    localStorage.removeItem(GALLERY_KEY);
    renderGallery();
}

function downloadImage(idx) {
    const items = loadGallery();
    const item = items[idx];
    const a = document.createElement("a");
    a.href = item.data;
    a.download = item.name || ("image_" + idx + ".png");
    document.body.appendChild(a);
    a.click();
    a.remove();
}

// Wire UI
document.addEventListener("DOMContentLoaded", () => {
    renderGallery();
    const input = document.getElementById("galleryFileInput");
    const addBtn = document.getElementById("addImagesBtn");
    const clearBtn = document.getElementById("clearGalleryBtn");

    addBtn.addEventListener("click", () => {
        if (input.files.length === 0) {
            alert("Wybierz pliki przed dodaniem.");
            return;
        }
        addFiles(input.files);
        input.value = ""; // reset
    });

    clearBtn.addEventListener("click", clearGallery);

    // support drag & drop on grid
    const grid = document.getElementById("galleryGrid");
    ['dragenter','dragover','dragleave','drop'].forEach(evt=>{
        grid.addEventListener(evt, e=>{ e.preventDefault(); e.stopPropagation(); });
    });
    grid.addEventListener('drop', e=>{
        const dt = e.dataTransfer;
        if (dt && dt.files && dt.files.length) {
            addFiles(dt.files);
        }
    });
});
