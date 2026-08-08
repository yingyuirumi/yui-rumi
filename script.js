const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const open = navigation.classList.toggle('open');
    menuButton.setAttribute('aria-expanded', String(open));
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navigation.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    });
  });
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals = document.querySelectorAll('.reveal');

if (reduceMotion || !('IntersectionObserver' in window)) {
  reveals.forEach((item) => item.classList.add('visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -35px' });

  reveals.forEach((item) => observer.observe(item));
}

const year = document.querySelector('#year');
if (year) year.textContent = String(new Date().getFullYear());

const zoomableImages = Array.from(document.querySelectorAll('main img'))
  .filter((image) => !image.closest('.ying-visual') && !image.classList.contains('platform-icon'));

if (zoomableImages.length) {
  const isEnglish = document.documentElement.lang.startsWith('en');
  const lightbox = document.createElement('div');
  const lightboxImage = document.createElement('img');
  const closeButton = document.createElement('button');
  let lastTrigger = null;

  lightbox.className = 'image-lightbox';
  lightbox.hidden = true;
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', isEnglish ? 'Full-size image' : '原圖檢視');

  closeButton.className = 'image-lightbox-close';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', isEnglish ? 'Close full-size image' : '關閉原圖');
  closeButton.textContent = '×';

  lightboxImage.alt = '';
  lightbox.append(lightboxImage, closeButton);
  document.body.append(lightbox);

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightboxImage.removeAttribute('src');
    document.body.classList.remove('image-lightbox-open');
    if (lastTrigger) lastTrigger.focus();
  };

  const openLightbox = (image) => {
    lastTrigger = image;
    lightboxImage.src = image.currentSrc || image.src;
    lightboxImage.alt = image.alt;
    lightbox.hidden = false;
    document.body.classList.add('image-lightbox-open');
    closeButton.focus();
  };

  zoomableImages.forEach((image) => {
    image.classList.add('zoomable-image');
    image.tabIndex = 0;
    image.setAttribute('role', 'button');
    image.setAttribute(
      'aria-label',
      `${image.alt} — ${isEnglish ? 'open full-size image' : '按一下查看原圖'}`
    );

    image.addEventListener('click', () => openLightbox(image));
    image.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        openLightbox(image);
      }
    });
  });

  closeButton.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });
}
