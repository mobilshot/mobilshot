//
// Ultra-simple global inline CMS with per-page storage key
//

(function () {

    // Pobieramy nazwę pliku strony, np. "cennik.html"
    const pageName = location.pathname.split("/").pop() || "index.html";

    // Tworzymy unikalny klucz do localStorage
    const STORAGE_KEY = pageName + "_content";

    // --- 1. Odczyt zapisanej treści ---
    let saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        document.open();
        document.write(saved);
        document.close();
    }

    // --- 2. Dodanie panelu CMS ---
    const panel = document.createElement("div");
    panel.style.position = "fixed";
    panel.style.bottom = "20px";
    panel.style.right = "20px";
    panel.style.zIndex = "999999";
    panel.style.display = "flex";
    panel.style.flexDirection = "column";
    panel.style.gap = "10px";

    const btnEdit = document.createElement("button");
    btnEdit.textContent = "✏ Edytuj stronę";
    btnEdit.style.padding = "10px 14px";
    btnEdit.style.fontSize = "14px";
    btnEdit.style.cursor = "pointer";

    const btnSave = document.createElement("button");
    btnSave.textContent = "💾 Zapisz zmiany";
    btnSave.style.padding = "10px 14px";
    btnSave.style.fontSize = "14px";
    btnSave.style.cursor = "pointer";
    btnSave.style.display = "none";

    panel.appendChild(btnEdit);
    panel.appendChild(btnSave);
    document.body.appendChild(panel);

    let isEditing = false;

    // --- 3. Tryb edycji ---
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

    // --- 4. Zapis ---
    btnSave.onclick = () => {
        document.body.contentEditable = "false";
        document.designMode = "off";

        const updated = "<!doctype html>\n" + document.documentElement.outerHTML;

        localStorage.setItem(STORAGE_KEY, updated);

        alert("Zapisano zmiany dla: " + pageName);
        location.reload();
    };

})();
