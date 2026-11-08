// Service buttons on the homepage: pre-fill the booking form and jump to it.
// Used by index.html's "Book this service" buttons (data-service attribute).
(function () {
  'use strict';

  const serviceSelect = document.getElementById('service');
  const nameInput = document.getElementById('name');
  const bookingSection = document.getElementById('booking');
  if (!serviceSelect || !bookingSection) return;

  document.querySelectorAll('.service-link[data-service]').forEach((btn) => {
    btn.addEventListener('click', () => {
      serviceSelect.value = btn.dataset.service;
      serviceSelect.closest('.field').classList.remove('invalid');
      bookingSection.scrollIntoView({ behavior: 'smooth' });
      setTimeout(() => nameInput && nameInput.focus({ preventScroll: true }), 600);
    });
  });
})();