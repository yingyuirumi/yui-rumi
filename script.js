const menuButton = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.site-nav');

if (menuButton && navigation) {
  const menuLabel = menuButton.querySelector('.sr-only');
  const pageLanguage = document.documentElement.lang;
  const menuCopy = pageLanguage.startsWith('en')
    ? { open: 'Open menu', close: 'Close menu' }
    : pageLanguage.startsWith('ja')
      ? { open: 'メニューを開く', close: 'メニューを閉じる' }
      : pageLanguage === 'zh-Hans'
        ? { open: '打开菜单', close: '关闭菜单' }
        : { open: '開啟選單', close: '關閉選單' };

  const setMenuOpen = (open) => {
    navigation.classList.toggle('open', open);
    menuButton.setAttribute('aria-expanded', String(open));
    if (menuLabel) menuLabel.textContent = open ? menuCopy.close : menuCopy.open;
  };

  menuButton.addEventListener('click', () => {
    setMenuOpen(!navigation.classList.contains('open'));
  });

  navigation.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      setMenuOpen(false);
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && navigation.classList.contains('open')) {
      setMenuOpen(false);
      menuButton.focus();
    }
  });

  document.addEventListener('click', (event) => {
    if (navigation.classList.contains('open') && !navigation.contains(event.target) && !menuButton.contains(event.target)) {
      setMenuOpen(false);
    }
  });
}

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals = document.querySelectorAll('.reveal');

const mobileDepthSections = document.querySelectorAll('[data-mobile-collapse]');
const isMobileViewport = window.matchMedia('(max-width: 760px)').matches;
if (isMobileViewport) {
  mobileDepthSections.forEach((section) => {
    section.open = false;
  });
}

const alignCurrentAnchor = () => {
  if (!window.location.hash) return;
  const anchorId = decodeURIComponent(window.location.hash.slice(1));
  const anchorTarget = document.getElementById(anchorId);
  if (anchorTarget) {
    window.requestAnimationFrame(() => anchorTarget.scrollIntoView({ block: 'start' }));
  }
};

alignCurrentAnchor();
window.addEventListener('hashchange', alignCurrentAnchor);
window.addEventListener('load', alignCurrentAnchor);

const memberToggleCopy = document.documentElement.lang.startsWith('en')
  ? { more: 'More', less: 'Less' }
  : document.documentElement.lang.startsWith('ja')
    ? { more: '詳しく見る', less: '閉じる' }
    : document.documentElement.lang === 'zh-Hans'
      ? { more: '更多', less: '收起' }
      : { more: '更多', less: '收起' };

document.querySelectorAll('.member-card').forEach((card, index) => {
  const biography = card.querySelector(':scope > p');
  if (!biography) return;

  const toggle = document.createElement('button');
  const biographyId = `member-biography-${index + 1}`;
  biography.id = biographyId;
  toggle.className = 'member-toggle';
  toggle.type = 'button';
  toggle.textContent = memberToggleCopy.more;
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', biographyId);
  card.append(toggle);

  toggle.addEventListener('click', () => {
    const expanded = card.classList.toggle('is-expanded');
    toggle.textContent = expanded ? memberToggleCopy.less : memberToggleCopy.more;
    toggle.setAttribute('aria-expanded', String(expanded));
  });
});

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
  .filter((image) => !image.closest('.ying-visual')
    && !image.classList.contains('platform-icon')
    && !image.hasAttribute('data-no-lightbox'));

if (zoomableImages.length) {
  const pageLanguage = document.documentElement.lang;
  const lightboxCopy = pageLanguage.startsWith('en')
    ? { open: 'open full-size image', label: 'Full-size image', close: 'Close full-size image', original: 'Open original file' }
    : pageLanguage.startsWith('ja')
      ? { open: '押して原寸画像を表示', label: '原寸画像', close: '原寸画像を閉じる', original: '元ファイルを開く' }
      : pageLanguage === 'zh-Hans'
        ? { open: '单击查看原图', label: '原图查看', close: '关闭原图', original: '打开原始文件' }
        : { open: '按一下查看原圖', label: '原圖檢視', close: '關閉原圖', original: '開啟原始檔' };
  const lightbox = document.createElement('div');
  const lightboxImage = document.createElement('img');
  const closeButton = document.createElement('button');
  const originalLink = document.createElement('a');
  let lastTrigger = null;

  lightbox.className = 'image-lightbox';
  lightbox.hidden = true;
  lightbox.setAttribute('role', 'dialog');
  lightbox.setAttribute('aria-modal', 'true');
  lightbox.setAttribute('aria-label', lightboxCopy.label);

  closeButton.className = 'image-lightbox-close';
  closeButton.type = 'button';
  closeButton.setAttribute('aria-label', lightboxCopy.close);
  closeButton.textContent = '×';

  // The lightbox still constrains the image to min(92vw, 1600px) by 88vh, so on
  // a phone -- or for anything taller than the viewport -- what it shows is not
  // the real thing. This link is the way out to the actual file, and it carries
  // the pixel size so the reader can tell whether following it is worth it.
  originalLink.className = 'image-lightbox-original';
  originalLink.target = '_blank';
  originalLink.rel = 'noopener';

  const showOriginalSize = () => {
    const width = lightboxImage.naturalWidth;
    const height = lightboxImage.naturalHeight;
    originalLink.textContent = width && height
      ? `${lightboxCopy.original} · ${width} × ${height}`
      : lightboxCopy.original;
  };
  // naturalWidth is 0 until the image decodes, so the size is filled in on load;
  // a cached image is already complete when the lightbox opens and will not fire
  // load again, which is why openLightbox calls this directly as well.
  lightboxImage.addEventListener('load', showOriginalSize);

  lightboxImage.alt = '';
  lightbox.append(lightboxImage, closeButton, originalLink);
  document.body.append(lightbox);

  const closeLightbox = () => {
    lightbox.hidden = true;
    lightboxImage.removeAttribute('src');
    document.body.classList.remove('image-lightbox-open');
    if (lastTrigger) lastTrigger.focus();
  };

  const openLightbox = (image) => {
    lastTrigger = image;
    // Use src, not currentSrc: for images with srcset the browser resolves
    // currentSrc to whichever derivative fits the thumbnail, so zooming would
    // open a downscaled copy. src always points at the full-size original.
    lightboxImage.src = image.src;
    lightboxImage.alt = image.alt;
    originalLink.href = image.src;
    showOriginalSize();
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
      `${image.alt} — ${lightboxCopy.open}`
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
    if (lightbox.hidden) return;
    if (event.key === 'Escape') {
      closeLightbox();
      return;
    }
    if (event.key !== 'Tab') return;
    // The dialog claims aria-modal="true". With only a close button that promise
    // was cheap; now that there is a second control, keep it honestly -- without
    // this, Tab walks out of the overlay into the page behind it, which is still
    // rendered and scrollable underneath.
    const order = [closeButton, originalLink];
    const current = order.indexOf(document.activeElement);
    event.preventDefault();
    const next = event.shiftKey
      ? order[(current <= 0 ? order.length : current) - 1]
      : order[(current + 1) % order.length];
    next.focus();
  });
}
