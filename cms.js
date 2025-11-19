// Minimal safe client-side CMS (Option B)
// - Edits only elements with data-edit attributes
// - Saves a JSON map into localStorage under 'cms_content_'+location.pathname
// - Provides a small floating panel: Edit / Save / Load / Reset / Export / Import / Exit
(function(){
  const STORAGE_KEY = 'cms_content_' + location.pathname;
  let active = false;

  // Create panel
  const panel = document.createElement('div');
  panel.id = 'mini-cms-panel';
  panel.style.position = 'fixed';
  panel.style.right = '12px';
  panel.style.bottom = '12px';
  panel.style.zIndex = 99999;
  panel.style.background = 'rgba(255,255,255,0.95)';
  panel.style.border = '1px solid rgba(0,0,0,0.08)';
  panel.style.padding = '8px';
  panel.style.borderRadius = '8px';
  panel.style.boxShadow = '0 6px 18px rgba(0,0,0,0.08)';
  panel.style.fontFamily = 'sans-serif';
  panel.style.fontSize = '13px';
  panel.style.display = 'none';

  function btn(label, cb){
    const b = document.createElement('button');
    b.textContent = label;
    b.style.margin = '3px';
    b.style.padding = '6px 8px';
    b.style.borderRadius = '6px';
    b.style.border = '1px solid rgba(0,0,0,0.08)';
    b.style.background = '#fff';
    b.onclick = cb;
    return b;
  }

  panel.appendChild(btn('Zapisz', saveAll));
  panel.appendChild(btn('Wczytaj', loadAll));
  panel.appendChild(btn('Resetuj', resetAll));
  panel.appendChild(btn('Eksport', exportJSON));
  panel.appendChild(btn('Import', ()=>fileInput.click()));
  panel.appendChild(btn('Wyłącz', toggleCMS));

  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = 'application/json';
  fileInput.style.display = 'none';
  fileInput.addEventListener('change', function(e){
    const f = e.target.files[0];
    if(!f) return;
    const reader = new FileReader();
    reader.onload = function(ev){
      try{
        const data = JSON.parse(ev.target.result);
        applyDataMap(data);
        alert('Zaimportowano dane.');
      }catch(err){ alert('Błąd importu: '+err); }
    };
    reader.readAsText(f, 'utf-8');
  });
  panel.appendChild(fileInput);

  document.body.appendChild(panel);

  // Small toggle button
  const toggleButton = document.createElement('button');
  toggleButton.textContent = 'CMS';
  toggleButton.title = 'Toggle CMS editor';
  toggleButton.style.position = 'fixed';
  toggleButton.style.right = '12px';
  toggleButton.style.bottom = '12px';
  toggleButton.style.zIndex = 99998;
  toggleButton.style.padding = '8px 10px';
  toggleButton.style.borderRadius = '8px';
  toggleButton.style.border = '1px solid rgba(0,0,0,0.12)';
  toggleButton.style.background = '#fff';
  toggleButton.onclick = toggleCMS;
  document.body.appendChild(toggleButton);

  // Toggle function
  function toggleCMS(){
    active = !active;
    panel.style.display = active ? 'block' : 'none';
    toggleButton.style.display = active ? 'none' : 'block';
    if(active) enableEditing(); else disableEditing();
  }
  window.toggleCMS = toggleCMS;

  // Enable editing only for [data-edit] elements
  function enableEditing(){
    const edits = document.querySelectorAll('[data-edit]');
    edits.forEach(el=>{
      el.contentEditable = true;
      el.classList.add('cms-editable');
      // visual hint
      el.style.outline = '2px dashed rgba(0,0,0,0.08)';
      el.style.padding = el.style.padding || '2px';
    });

    // image click to replace (only for images with data-edit)
    document.querySelectorAll('img[data-edit]').forEach(img=>{
      img.style.cursor = 'pointer';
      img.addEventListener('click', imageReplaceHandler);
    });
  }

  function disableEditing(){
    const edits = document.querySelectorAll('[data-edit]');
    edits.forEach(el=>{
      el.contentEditable = false;
      el.classList.remove('cms-editable');
      el.style.outline = '';
    });
    document.querySelectorAll('img[data-edit]').forEach(img=>{
      img.style.cursor = '';
      img.removeEventListener('click', imageReplaceHandler);
    });
  }

  function imageReplaceHandler(e){
    const url = prompt("Podaj URL nowego obrazu (lub zostaw puste):");
    if(url) e.target.src = url;
  }

  // Save only the innerHTML/textContent of elements with data-edit
  function saveAll(){
    const map = {};
    document.querySelectorAll('[data-edit]').forEach(el=>{
      const key = el.getAttribute('data-edit');
      if(!key) return;
      if(el.tagName.toLowerCase()==='img'){
        map[key] = {type: 'img', src: el.src, alt: el.alt};
      } else {
        map[key] = {type: 'html', value: el.innerHTML};
      }
    });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    alert('Zapisano pola CMS (localStorage).');
  }

  // Load from storage and apply
  function loadAll(){
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw){ alert('Brak zapisanych danych.'); return; }
    try{
      const data = JSON.parse(raw);
      applyDataMap(data);
      alert('Wczytano zapisane treści.');
    }catch(err){
      alert('Błąd wczytywania: '+err);
    }
  }

  function applyDataMap(data){
    Object.keys(data||{}).forEach(key=>{
      const value = data[key];
      const el = document.querySelector('[data-edit="'+key+'"]');
      if(!el) return;
      if(value.type === 'img' && el.tagName.toLowerCase()==='img'){
        el.src = value.src || el.src;
        if(value.alt) el.alt = value.alt;
      } else if(value.type === 'html'){
        el.innerHTML = value.value || '';
      }
    });
  }

  // Reset: remove storage entry and reload page (restores original HTML)
  function resetAll(){
    if(confirm('Usunąć zapisane zmiany dla tej strony?')){
      localStorage.removeItem(STORAGE_KEY);
      location.reload();
    }
  }

  // Export JSON file for committing or backup
  function exportJSON(){
    const raw = localStorage.getItem(STORAGE_KEY);
    if(!raw){ alert('Brak danych do eksportu.'); return; }
    const blob = new Blob([raw], {type:'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = (location.pathname.replace(/\//g,'_') || 'page') + '_cms.json';
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // Import handled via file input -> applyDataMap

  // Auto-load on start (if present)
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    if(raw){
      // Apply gently after DOM loaded
      document.addEventListener('DOMContentLoaded', ()=>{
        try{
          const data = JSON.parse(raw);
          applyDataMap(data);
        }catch(e){ console.warn('CMS load failed', e); }
      });
    }
  }catch(e){ console.warn('CMS init error', e); }

})();