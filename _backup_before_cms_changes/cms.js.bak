
// Ultra-simple global CMS
(function(){
  let active=false;
  window.toggleCMS=function(){
    active=!active;
    document.body.classList.toggle('cms-on',active);
    if(active) enableEditing(); else disableEditing();
  };

  function enableEditing(){
    document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, li, span, div[data-edit]')
      .forEach(el=>{ el.contentEditable=true; el.classList.add('cms-editable'); });

    document.querySelectorAll('img').forEach(img=>{
      img.addEventListener('click', imageReplaceHandler);
      img.classList.add('cms-image');
    });

    if(!document.getElementById('cms-save')){
      const btn=document.createElement('button');
      btn.id='cms-save';
      btn.textContent='Zapisz zmiany';
      btn.style.position='fixed'; btn.style.bottom='20px'; btn.style.right='20px';
      btn.style.zIndex='9999'; btn.style.padding='10px 20px';
      btn.onclick=saveAll;
      document.body.appendChild(btn);
    }
  }

  function disableEditing(){
    document.querySelectorAll('.cms-editable').forEach(el=>{
      el.removeAttribute('contentEditable');
      el.classList.remove('cms-editable');
    });
    document.querySelectorAll('.cms-image').forEach(img=>{
      img.removeEventListener('click', imageReplaceHandler);
      img.classList.remove('cms-image');
    });
    const b=document.getElementById('cms-save');
    if(b) b.remove();
  }

  function imageReplaceHandler(e){
    if(!active) return;
    const url = prompt("Podaj URL nowego obrazu:");
    if(url) e.target.src=url;
  }

  function saveAll(){
    const html = document.documentElement.outerHTML;
    localStorage.setItem(location.pathname+"_html", html);
    alert("Zapisano!");
  }

  // Load saved
  const saved = localStorage.getItem(location.pathname+"_html");
  if(saved) document.open(), document.write(saved), document.close();
})();
