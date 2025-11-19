//
// CMS with persistent page identity + per-page storage + page switcher + RESET BUTTON
//

(function () {

    // 1. Sprawdź, czy zapisany dokument ma meta z nazwą strony
    let saved = localStorage.getItem((location.pathname.split("/").pop() || "index.html") + "_content");

    if (saved) {
        document.open();
        document.write(saved);
        document.close();
    }

    // --- USTAL NAZWĘ PODSTRONY ---
    let meta = document.querySelector('meta[name="cms-page"]');
    let pageName = meta ? meta.getAttribute("content") : (location.pathname.split("/").pop() || "index.html");

    const STORAGE_KEY = pageName + "_content";


    // --- PANEL CMS ---
    const panel = document.createElement("div");
    panel.style.position = "fixed";
    panel.style.bottom = "20px";
    panel.style.right = "20px";
    panel.style.zIndex = "999999";
    panel.style.display = "flex";
    panel.style.flexDirection = "column";
    panel.style.gap = "10px";
    panel.style.background = "rgba(255,255,255,0.95)";
    panel.style.padding = "10px";
    panel.style.borderRadius = "10px";
    panel.style.boxShadow = "0 0 12px rgba(0,0,0,0.3)";


    // --- LISTA PODSTRON ---
    const pages = [
        "index.html",
        "o_nas.html",
        "oferta.html",
        "cennik.html",
        "galeria.html",
        "aktualnosci.html",
        "kontakt.html",
        "regulamin.html",
        "rodo.html",
        "cookies.html",
        "zgloszenie.html"
    ];

    const select = document.createElement("select");
    select.style.padding = "8px";
    select.style.fontSize = "14px";

    pages.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p;
        opt.textContent = p;
        if (p === pageName) opt.selected = true;
        select.appendChild(opt);
    });

    select.onchange = () => {
        location.href = select.value;
    };


    // --- PRZYCISKI ---
    const btnEdit = document.createElement("button");
    btnEdit.textContent = "✏ Edytuj stronę";
    btnEdit.style.padding = "10px";
    btnEdit.style.cursor = "pointer";

    const btnSave = document.createElement("button");
    btnSave.textContent = "💾 Zapisz zmiany";
    btnSave.style.padding = "10px";
    btnSave.style.cursor = "pointer";
    btnSave.style.display = "none";

    // --- NOWY: PRZYCISK CZYSZCZENIA ---
    const btnReset = document.createElement("button");
    btnReset.textContent = "🗑 Wyczyść CMS";
    btnReset.style.padding = "10px";
    btnReset.style.cursor = "pointer";
    btnReset.style.background = "#ff3333";
    btnReset.style.color = "white";
    btnReset.style.border = "none";
    btnReset.style.borderRadius = "6px";

    btnReset.onclick = () => {
        if (confirm("Czy na pewno chcesz usunąć wszystkie zapisane treści CMS?")) {
            Object.keys(localStorage).forEach(k => {
                if (k.endsWith("_content")) localStorage.removeItem(k);
            });
            alert("Wyczyszczono CMS.");
            location.reload();
        }
    };


    // Dodaj wszystko do panelu
    panel.appendChild(select);
    panel.appendChild(btnEdit);
    panel.appendChild(btnSave);
    panel.appendChild(btnReset);
    document.body.appendChild(panel);


    // --- LOGIKA EDYCJI ---
    let editing = false;

    btnEdit.onclick = () => {
        editing = !editing;

        if (editing) {
            document.body.contentEditable = "true";
            document.designMode = "on";
            btnEdit.textContent = "❌ Wyjdź z edycji";
            btnSave.style.display = "block";
        } else {
            document.body.contentEditable = "false";
            document.designMode = "off";
            btnEdit.textContent = "✏ Edytuj stronę";
            btnSave.style.display = "none";
        }
    };


    // --- ZAPIS STRONY ---
    btnSave.onclick = () => {

        document.body.contentEditable = "false";
        document.designMode = "off";

        // Dodaj meta z nazwą strony jeśli nie istnieje
        if (!meta) {
            meta = document.createElement("meta");
            meta.setAttribute("name", "cms-page");
            meta.setAttribute("content", pageName);
            document.head.appendChild(meta);
        }

        const updated = "<!doctype html>\n" + document.documentElement.outerHTML;

        localStorage.setItem(STORAGE_KEY, updated);

        alert("✔ Zapisano stronę: " + pageName);
        location.reload();
    };

})();
