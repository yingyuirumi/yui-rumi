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
mobileDepthSections.forEach((section) => {
  section.open = false;
});

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
  .filter((image) => !image.closest('.ying-visual') && !image.classList.contains('platform-icon'));

if (zoomableImages.length) {
  const pageLanguage = document.documentElement.lang;
  const lightboxCopy = pageLanguage.startsWith('en')
    ? { open: 'open full-size image', label: 'Full-size image', close: 'Close full-size image' }
    : pageLanguage.startsWith('ja')
      ? { open: '押して原寸画像を表示', label: '原寸画像', close: '原寸画像を閉じる' }
      : pageLanguage === 'zh-Hans'
        ? { open: '单击查看原图', label: '原图查看', close: '关闭原图' }
        : { open: '按一下查看原圖', label: '原圖檢視', close: '關閉原圖' };
  const lightbox = document.createElement('div');
  const lightboxImage = document.createElement('img');
  const closeButton = document.createElement('button');
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
    if (event.key === 'Escape' && !lightbox.hidden) closeLightbox();
  });
}
