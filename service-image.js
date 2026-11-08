(function () {
  'use strict';

  const modal = document.getElementById('equipmentImageModal');
  const closeButton = document.getElementById('closeEquipmentImage');
  const modalTitle = document.getElementById('equipmentImageTitle');
  if (!modal || !closeButton || !modalTitle) return;

  const galleries = modal.querySelectorAll('[data-gallery-group]');
  let triggerButton = null;
  let previousOverflow = '';

  function closeModal() {
    modal.hidden = true;
    document.body.style.overflow = previousOverflow;
    if (triggerButton) triggerButton.focus();
  }

  document.querySelectorAll('.service-image-button[data-gallery]').forEach((button) => {
    button.addEventListener('click', () => {
      const gallery = modal.querySelector(`[data-gallery-group="${button.dataset.gallery}"]`);
      if (!gallery) {
        console.error(`No image gallery found for "${button.dataset.gallery}".`);
        return;
      }

      galleries.forEach((item) => {
        item.hidden = item !== gallery;
      });
      triggerButton = button;
      previousOverflow = document.body.style.overflow;
      modalTitle.textContent = button.textContent.trim();
      modal.setAttribute('aria-label', button.getAttribute('aria-label') || modalTitle.textContent);
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
      closeButton.focus();
    });
  });

  closeButton.addEventListener('click', closeModal);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeModal();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !modal.hidden) closeModal();
  });
})();
