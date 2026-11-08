// Gallery on gallery.html: category filters and a fullscreen lightbox.
(function () {
  'use strict';

  const grid = document.getElementById('galleryGrid');
  if (!grid) return;

  // Filters
  const filterButtons = document.querySelectorAll('.filter-btn');
  const items = grid.children;

  filterButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterButtons.forEach((b) => b.classList.toggle('active', b === btn));

      const filter = btn.dataset.filter;
      Array.from(items).forEach((item) => {
        const category = item.dataset.category;
        const show = filter === 'all' || category === 'all' || category === filter;
        item.classList.toggle('hidden', !show);
      });
    });
  });

  // Lightbox
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  if (!lightbox) return;

  function openLightbox(src, alt, caption) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightboxCaption.textContent = caption;
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  // Only photo items open the lightbox, not placeholders
  grid.querySelectorAll('.gallery-item:not(.placeholder)').forEach((item) => {
    const img = item.querySelector('img');
    if (!img) return;

    item.addEventListener('click', () => {
      const caption = item.querySelector('.caption');
      openLightbox(img.src, img.alt, caption ? caption.textContent.trim() : '');
    });
  });

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeLightbox();
  });
})();