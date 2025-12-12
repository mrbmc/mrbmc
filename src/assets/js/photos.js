const observer = new IntersectionObserver(observerCallback, {});

function observerCallback(entries, observer) {
  entries.forEach(entry => {
    document.querySelector('[href="#' + entry.target.id + '"]').classList.toggle('active',entry.isIntersecting);
  });
  document.querySelector('#thumbnails a.active').scrollIntoView({ behavior: 'smooth', block: 'center' });
}

window.addEventListener('load', function(e) {
    console.log('photos.js.onload');
    document.querySelectorAll('#gallery > p').forEach(el=>{observer.observe(el)})
});