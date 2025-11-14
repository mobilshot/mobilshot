
// CMS Lite Premium v3 - edit on/off, save/reset, gallery, lightbox, theme toggle
let editMode=false;

function applyTheme(theme){
  if(theme==='dark') document.documentElement.setAttribute('data-theme','dark');
  else document.documentElement.removeAttribute('data-theme');
  localStorage.setItem('site_theme', theme);
}

function toggleTheme(){
  const cur = localStorage.getItem('site_theme')||'light';
  applyTheme(cur==='dark'?'light':'dark');
}

function initTheme(){
  const saved = localStorage.getItem('site_theme')||'light';
  applyTheme(saved);
  const btn = document.getElementById('themeBtn');
  if(btn) btn.addEventListener('click', toggleTheme);
}

function toggleEdit(){
  editMode = !editMode;
  document.getElementById('editOn').style.display = editMode?'none':'inline-block';
  document.getElementById('editOff').style.display = editMode?'inline-block':'none';
  document.getElementById('saveBtn').style.display = editMode?'inline-block':'none';
  document.getElementById('resetBtn').style.display = editMode?'inline-block':'none';
  document.querySelectorAll('.editable, .caption').forEach(e=>{
    e.contentEditable = editMode;
    e.classList.toggle('editable', editMode);
  });
}

function saveAll(){
  document.querySelectorAll('[data-key]').forEach(el=>{
    localStorage.setItem(el.dataset.key, el.innerHTML);
  });
  // gallery
  const gallery = window.__gallery_state || [];
  localStorage.setItem('gallery', JSON.stringify(gallery));
  alert('Zapisano zmiany lokalnie.');
}

function resetAll(){
  if(!confirm('Przywrócić domyślny stan (usunie lokalne zmiany)?')) return;
  // clear keys we use
  document.querySelectorAll('[data-key]').forEach(el=> localStorage.removeItem(el.dataset.key));
  localStorage.removeItem('gallery');
  localStorage.removeItem('site_theme');
  location.reload();
}

function loadTexts(){
  document.querySelectorAll('[data-key]').forEach(el=>{
    const saved = localStorage.getItem(el.dataset.key);
    if(saved) el.innerHTML = saved;
  });
}

function initGallery(){
  const box = document.getElementById('gallery');
  if(!box) return;
  let gallery = JSON.parse(localStorage.getItem('gallery')||'[]');
  window.__gallery_state = gallery;
  renderGallery();
}

function renderGallery(){
  const box = document.getElementById('gallery');
  box.innerHTML='';
  const gallery = window.__gallery_state || [];
  gallery.forEach((item,i)=>{
    const wrap = document.createElement('div');
    wrap.style.textAlign='center';
    const img = document.createElement('img');
    img.src = item.src;
    img.style.width='100%'; img.style.borderRadius='8px'; img.style.cursor='pointer';
    img.onclick = ()=>openLightbox(item.src);
    wrap.appendChild(img);
    const cap = document.createElement('div');
    cap.className='caption'; cap.dataset.key = 'caption_'+i; cap.innerText = item.caption || 'Opis...';
    cap.onblur = ()=>{ window.__gallery_state[i].caption = cap.innerText; };
    wrap.appendChild(cap);
    const del = document.createElement('button'); del.className='btn'; del.style.marginTop='6px'; del.innerText='Usuń';
    del.onclick = ()=>{ if(confirm('Usunąć zdjęcie?')){ window.__gallery_state.splice(i,1); renderGallery(); } };
    wrap.appendChild(del);
    box.appendChild(wrap);
  });
}

function addImageFile(file){
  if(!file) return alert('Wybierz plik');
  const reader = new FileReader();
  reader.onload = ()=>{
    const gallery = window.__gallery_state || [];
    gallery.push({src: reader.result, caption: 'Opis zdjęcia...'});
    window.__gallery_state = gallery;
    renderGallery();
  };
  reader.readAsDataURL(file);
}

function openLightbox(src){
  const lb = document.getElementById('lightbox');
  lb.style.display='flex';
  lb.querySelector('img').src = src;
}

function closeLightbox(){ document.getElementById('lightbox').style.display='none'; }

window.addEventListener('DOMContentLoaded', ()=>{
  initTheme();
  loadTexts();
  initGallery();
  // wire file input
  const fileInput = document.getElementById('fileInput');
  const addBtn = document.getElementById('addImgBtn');
  if(addBtn && fileInput) addBtn.addEventListener('click', ()=> addImageFile(fileInput.files[0]));
});
