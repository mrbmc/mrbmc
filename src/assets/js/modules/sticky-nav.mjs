const observer = new IntersectionObserver(intersectionCallback, {});

function intersectionCallback(entries, observer) {
  entries.forEach(entry => {
    if(entry.target.id === 'header') {
      // console.log('Header visibility changed:', entry.isIntersecting);
      document.querySelector('#subnav-toggle').classList.toggle('hide',entry.isIntersecting);
    } else {
      // console.log('Element entered viewport:', entry.target.id);
      document.querySelector('a[href*="#'+entry.target.id+'"]').classList.toggle('on',entry.isIntersecting);
    }
  });
}

export function initStickyNav (parent) {
  if(parent == null) return;

  console.log('initStickyNav',parent);
  parent.querySelectorAll(':scope > li > a').forEach(el => {
    let navTarget = el.getAttribute('href').split('#').pop();
    console.log('Observing nav target:', navTarget);
    observer.observe(document.getElementById(navTarget));
  });

  observer.observe(document.getElementById('header'));

  // add the menu toggle button
  var icon = document.createElement('img');
  icon.setAttribute('src','/images/icons/menu.svg');
  icon.setAttribute('alt','Menu');
  var toggle = document.createElement('a');
  toggle.setAttribute('class','nav-subnav');
  toggle.setAttribute('id','subnav-toggle');
  toggle.setAttribute('href','#subnav');
  toggle.appendChild(icon);
  parent.parentNode.insertBefore(toggle,parent);

  // wire up the toggle behavior
  document.getElementById('subnav-toggle').addEventListener('click', function(e){
    e.preventDefault();
    document.getElementById('subnav').classList.toggle('in');
    document.getElementsByTagName('body')[0].addEventListener('click', function bodyClickListener(ev){
      if(!ev.target.closest('#subnav-toggle')) {
        document.getElementById('subnav').classList.remove('in');
        document.getElementsByTagName('body')[0].removeEventListener('click', bodyClickListener);
      }
    });
  });
}

