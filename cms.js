
// Full CMS Lite - Option 2 (publish always visible)
(function(){
  window.editMode = false;

  function applyTheme(t){ if(t==='dark') document.documentElement.setAttribute('data-theme','dark'); else document.documentElement.removeAttribute('data-theme'); localStorage.setItem('site_theme', t); }
  function toggleTheme(){ const cur = localStorage.getItem('site_theme')||'light'; applyTheme(cur==='dark'?'light':'dark'); }
  window.toggleTheme = toggleTheme;
  function initTheme(){ const s = localStorage.getItem('site_theme')||'light'; applyTheme(s); const btn=document.getElementById('themeBtn'); if(btn) btn.addEventListener('click', toggleTheme); }

  window.toggleCMS = function(){
    editMode = !editMode;
    document.body.classList.toggle('cms-edit', editMode);
    document.querySelectorAll('[data-key]').forEach(e=>{ e.contentEditable = editMode; if(editMode) e.classList.add('editable'); else e.classList.remove('editable'); });
    document.querySelectorAll('.caption').forEach(e=>{ e.contentEditable = editMode; if(editMode) e.classList.add('editable'); else e.classList.remove('editable'); });
    // show/hide publish related features - but publish button always visible in Option 2
  };

  window.saveAll = function(){
    document.querySelectorAll('[data-key]').forEach(e=> localStorage.setItem(e.dataset.key, e.innerHTML));
    localStorage.setItem('gallery', JSON.stringify(window.__gallery_state||[]));
    localStorage.setItem('news', JSON.stringify(window.__news_state||[]));
    alert('Zapisano lokalnie.');
  };

  window.resetAll = function(){
    if(!confirm('Przywrócić domyślny stan i usunąć lokalne zmiany?')) return;
    document.querySelectorAll('[data-key]').forEach(e=> localStorage.removeItem(e.dataset.key));
    localStorage.removeItem('gallery'); localStorage.removeItem('news'); localStorage.removeItem('site_theme');
    location.reload();
  };

  function loadTexts(){ document.querySelectorAll('[data-key]').forEach(e=>{ const s=localStorage.getItem(e.dataset.key); if(s) e.innerHTML = s; }); }

  // Gallery
  window.__gallery_state = JSON.parse(localStorage.getItem('gallery')||'[]');
  function renderGallery(){
    const box = document.getElementById('gallery'); if(!box) return; box.innerHTML='';
    (window.__gallery_state||[]).forEach((it,i)=>{
      const wrap=document.createElement('div'); wrap.style.textAlign='center';
      const img=document.createElement('img'); img.src=it.src; img.style.width='100%'; img.style.borderRadius='8px'; img.style.cursor='pointer'; img.onclick = ()=> openLightbox(it.src);
      wrap.appendChild(img);
      const cap=document.createElement('div'); cap.className='caption'; cap.dataset.key='caption_'+i; cap.innerText = it.caption||'Opis...'; cap.onblur = ()=> window.__gallery_state[i].caption = cap.innerText;
      wrap.appendChild(cap);
      const del=document.createElement('button'); del.className='btn'; del.style.marginTop='6px'; del.innerText='Usuń'; del.onclick = ()=>{ if(confirm('Usunąć zdjęcie?')){ window.__gallery_state.splice(i,1); renderGallery(); } };
      wrap.appendChild(del);
      box.appendChild(wrap);
    });
  }
  window.addImageFile = function(file){ if(!file) return alert('Wybierz plik'); const reader=new FileReader(); reader.onload = ()=>{ const g = window.__gallery_state||[]; g.push({src:reader.result, caption:'Opis zdjęcia...'}); window.__gallery_state=g; renderGallery(); }; reader.readAsDataURL(file); };

  window.openLightbox = function(src){ const lb=document.getElementById('lightbox'); if(!lb) return; lb.style.display='flex'; lb.querySelector('img').src = src; }
  window.closeLightbox = function(){ const lb=document.getElementById('lightbox'); if(lb) lb.style.display='none'; }

  // News local + render + publish always visible
  window.__news_state = JSON.parse(localStorage.getItem('news')||'[]');
  window.renderNews = function(list){
    const root = document.getElementById('newsList'); if(!root) return;
    root.innerHTML='';
    (list||[]).sort((a,b)=>b.date-a.date).forEach((n,idx)=>{
      const div=document.createElement('div'); div.className='news-item';
      const d=new Date(n.date);
      div.innerHTML = `<strong>${n.title}</strong> <span class="small"> - ${d.toLocaleString()}</span><p>${n.body}</p>`;
      if(editMode){
        const edit=document.createElement('button'); edit.className='btn'; edit.style.marginRight='8px'; edit.innerText='Edytuj';
        edit.onclick = ()=>{ const t=prompt('Tytuł', n.title); if(t!==null){ const b=prompt('Treść', n.body); if(b!==null){ const L=window.__news_state; L[idx].title=t; L[idx].body=b; window.__news_state=L; localStorage.setItem('news', JSON.stringify(L)); renderNews(L); } } };
        const del = document.createElement('button'); del.className='btn'; del.style.background='#b23'; del.innerText='Usuń'; del.onclick = ()=>{ if(confirm('Usunąć wpis?')){ const L=window.__news_state; L.splice(idx,1); window.__news_state=L; localStorage.setItem('news', JSON.stringify(L)); renderNews(L); } };
        div.appendChild(edit); div.appendChild(del);
      }
      root.appendChild(div);
    });
  };
  window.addNewsLocal = function(title, body){ const L = window.__news_state||[]; L.push({title:title, body:body, date: Date.now()}); window.__news_state=L; localStorage.setItem('news', JSON.stringify(L)); renderNews(L); alert('Dodano aktualność lokalnie.'); };

  window.publishNews = function(){
    const list = window.__news_state || JSON.parse(localStorage.getItem('news')||'[]');
    const blob = new Blob([JSON.stringify(list,null,2)],{type:'application/json'});
    const url = URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='aktualnosci.json'; a.click();
    alert('Plik aktualnosci.json pobrany. Wgraj go do GitHub repo (Add file → Upload file).');
  };

  function loadNewsHosted(){
    fetch('aktualnosci.json').then(r=>{ if(r.ok) return r.json(); throw 0; }).then(data=>{ window.__news_state = data; renderNews(data); }).catch(()=>{ window.__news_state = JSON.parse(localStorage.getItem('news')||'[]'); renderNews(window.__news_state); });
  }

  window.addEventListener('DOMContentLoaded', ()=>{ initTheme(); loadTexts(); renderGallery(); loadNewsHosted();
    const addBtn = document.getElementById('addImgBtn'); const fileInput = document.getElementById('fileInput');
    if(addBtn && fileInput) addBtn.addEventListener('click', ()=> addImageFile(fileInput.files[0]));
    const newsAdd = document.getElementById('addNewsBtn');
    if(newsAdd){ newsAdd.addEventListener('click', ()=>{ const t=document.getElementById('newsTitle').value.trim(); const b=document.getElementById('newsBody').value.trim(); if(!t||!b){ alert('Wypełnij tytuł i treść'); return;} addNewsLocal(t,b); document.getElementById('newsTitle').value=''; document.getElementById('newsBody').value=''; });
    }
  });
})(); 
