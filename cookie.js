
document.addEventListener('DOMContentLoaded', function(){
  if(!localStorage.getItem('cookies_accepted')){
    const bar = document.createElement('div');
    bar.className='cookie-bar';
    bar.innerHTML = '<div>Ta strona używa cookies. <a href="polityka.html">Polityka prywatności</a></div><div><button class="btn" id="cookieOk">OK</button></div>';
    document.body.appendChild(bar);
    document.getElementById('cookieOk').onclick = function(){ localStorage.setItem('cookies_accepted','1'); bar.remove(); };
  }
});
