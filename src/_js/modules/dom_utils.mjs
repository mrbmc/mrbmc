export function wrapElement (el, wrapper) {
    el.parentNode.insertBefore(wrapper, el);
    wrapper.appendChild(el);
}

export function isInViewport (elem) {
    var bounding = elem.getBoundingClientRect(),
        peek = 0;//bounding.height / 10;
    // if(VERBOSE) console.log('isInViewport',elem);
    return (
        bounding.bottom >= (0 - peek) &&
        bounding.top <= ((window.innerHeight || document.documentElement.clientHeight) - peek) &&
        // bounding.left >= 0 &&
        // bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
        true
    );
}

export function parseSrcset(srcset) {
  return srcset.split(',').map(item => {
    const parts = item.trim().split(' ');
    return {
      url: parts[0],
      width: parts[1] ? parseInt(parts[1], 10) : null,
      density: parts[1] && parts[1].includes('x') ? parseFloat(parts[1]) : null,
    };
  });
}
