//
// Ultra-simple CMS with per-page storage + page switcher
//

(function () {

    // Pobieramy nazwę pliku strony
    const pageName = location.pathname.split("/").pop() || "index.html";

    // Unikalny klucz localStorage
    const STORAGE_KEY = pageName + "_content";

    // --- 1. Ładowanie zapisanej treści ---
    let saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        document.open();
        document.write(saved);
        document.close();
    }

    // --- 2. Panel CMS ---
    const panel = document.createElement("div");
    panel.style.position = "fixed";
    panel.style.bottom = "20px";
    panel.style.right = "20px";
    panel.style.zIndex = "999999";
    panel.style.display = "flex";
    panel.style.flexDirection = "column";
    panel.style.gap = "10px";
    panel.style.background = "rgba(255,255,255,0.9)";
    panel.style.padding = "10px";
    panel.style.borderRadius = "8px";
    panel.style.boxShadow = "0 0 8px rgba(0,0,0,0.2)";

    // Lista podstron do przełączania
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

    // Select z listą podstron
    const select = document.createElement("select");
    select.style.padding = "8px";
    select.style.fontSize = "14px";
    select.style.cursor = "pointer";

    // Wypełniamy selecta
    pages.forEach(p => {
        const opt = document.createElement("option");
        opt.value = p;
        opt.textContent = p;
        if (p === pageName) opt.selected = true;
        select.appendChild(opt);
    });

    // Po wybraniu przenosimy do podstrony
    select.onchange = () => {
        location.href = select.value;
    };

    // Przycisk edycji
    const btnEdit = document.createElement("button");
    btnEdit.textContent = "✏ Edytuj stronę";
    btnEdit.style.padding = "10px 14px";
    btnEdit.style.fontSize = "14px";
    btnEdit.style.cursor = "pointer";

    // Przycisk zapisu
    const btnSave = document.createElement("button");
    btnSave.textContent = "💾 Zapisz zmiany";
    btnSave.style.padding = "10px 14px";
    btnSave.style.fontSize = "14px";
    btnSave.style.cursor = "pointer";
    btnSave.style.display = "none";

    panel.appendChild(select);
    panel.appendChild(btnEdit);
    panel.appendChild(btnSave);
    document.body.appendChild(panel);

    let isEditing = false;

    // Tryb edycji
    btnEdit.onclick = () => {
        if (!isEditing) {
            document.body.contentEditable = "true";
            document.designMode = "on";
            btnEdit.textContent = "❌ Wyjdź z edycji";
            btnSave.style.display = "block";
            isEditing = true;
        } else {
            document.body.contentEditable = "false";
            document.designMode = "off";
            btnEdit.textContent = "✏ Edytuj stronę";
            btnSave.style.display = "none";
            isEditing = false;
        }
    };

    // Zapis
    btnSave.onclick = () => {
        document.body.contentEditable = "false";
        document.designMode = "off";

        const updated = "<!doctype html>\n" + document.documentElement.outerHTML;

        localStorage.setItem(STORAGE_KEY, updated);

        alert("Zapisano zmiany dla: " + pageName);
        location.reload();
    };

})();
