
// CMS with backups, import/export, password menu
(function(){
  const PASSWORD = "admin123";

  function getPageName(){
    let meta=document.querySelector('meta[name="cms-page"]');
    if(meta) return meta.content;
    let p=location.pathname.split('/').pop();
    return p||"index.html";
  }
  const pageName=getPageName();
  const KEY = pageName+"_html";
  const BACKUP_KEY = pageName+"_backup";

  // Load saved
  const saved=localStorage.getItem(KEY);
  if(saved){
    document.open(); document.write(saved); document.close();
  }

  let active=false;

  window.cmsLogin=function(){
    const pw=prompt("Podaj hasło:");
    if(pw===PASSWORD){
      alert("Dostęp przyznany");
      toggleCMS();
    }else alert("Błędne hasło");
  };

  window.toggleCMS=function(){
    active=!active;
    if(active){ enableEditing(); } else disableEditing();
  };

  function enableEditing(){
    document.body.contentEditable=true;
  }
  function disableEditing(){
    document.body.contentEditable=false;
  }

  window.saveAll=function(){
    const html=document.documentElement.outerHTML;
    localStorage.setItem(KEY,html);
    localStorage.setItem(BACKUP_KEY,html);
    alert("Zapisano + utworzono kopię!");
    location.reload();
  };

  window.exportPage=function(){
    const data=localStorage.getItem(KEY)||"";
    const blob=new Blob([data],{type:"text/plain"});
    const a=document.createElement("a");
    a.href=URL.createObjectURL(blob);
    a.download=pageName+"_export.html";
    a.click();
  };

  window.importPage=function(){
    const fileInput=document.createElement("input");
    fileInput.type="file";
    fileInput.accept=".html,.txt";
    fileInput.onchange=e=>{
      const file=e.target.files[0];
      const reader=new FileReader();
      reader.onload=ev=>{
        localStorage.setItem(KEY,ev.target.result);
        alert("Zaimportowano!");
        location.reload();
      };
      reader.readAsText(file);
    };
    fileInput.click();
  };

})();
