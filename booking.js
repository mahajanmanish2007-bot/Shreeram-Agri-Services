// Booking form: validates and saves the request before offering WhatsApp follow-up.
(function () {
  'use strict';

  const form = document.getElementById('bookingForm');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const serviceSelect = document.getElementById('service');
  const dateInput = document.getElementById('date');
  const villageInput = document.getElementById('village');
  const notesInput = document.getElementById('notes');
  const status = document.getElementById('bookingStatus');
  const fallback = document.getElementById('bookingFallback');
  const whatsAppLink = document.getElementById('bookingWhatsApp');
  const submitButton = form.querySelector('[type="submit"]');
  const translate = (value) => window.siteTranslate ? window.siteTranslate(value) : value;
  let whatsappRequest = null;
  let statusKey = '';

  function updateWhatsAppLink() {
    if (!whatsappRequest) return;
    const lines = [
      translate('Hello Shreeram Agri Services, I would like to book a service.'),
      '',
      `${translate('Name:')} ${whatsappRequest.name}`,
      `${translate('Mobile:')} ${whatsappRequest.phone}`,
      `${translate('Service:')} ${translate(whatsappRequest.service)}`,
      whatsappRequest.village ? `${translate('Location:')} ${whatsappRequest.village}` : null,
      whatsappRequest.preferredDate ? `${translate('Preferred date:')} ${whatsappRequest.preferredDate}` : null,
      whatsappRequest.notes ? `${translate('Details:')} ${whatsappRequest.notes}` : null
    ].filter(Boolean).join('\n');
    whatsAppLink.href = `https://wa.me/917972080355?${new URLSearchParams({ text: lines })}`;
  }

  function setStatus(key, state) {
    statusKey = key;
    status.textContent = translate(key);
    status.dataset.state = state;
  }

  document.addEventListener('languagechange', () => {
    if (statusKey) status.textContent = translate(statusKey);
    updateWhatsAppLink();
  });

  phoneInput.addEventListener('input', () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, '').slice(0, 10);
  });

  [nameInput, phoneInput, serviceSelect].forEach((input) => {
    const clearError = () => input.closest('.field').classList.remove('invalid');
    input.addEventListener('input', clearError);
    input.addEventListener('change', clearError);
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const request = {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      service: serviceSelect.value,
      preferredDate: dateInput.value,
      village: villageInput.value.trim(),
      notes: notesInput.value.trim(),
      language: document.documentElement.lang === 'mr' ? 'mr' : 'en'
    };
    const validName = request.name.length > 1;
    const validPhone = /^[6-9]\d{9}$/.test(request.phone);
    const validService = request.service !== '';

    document.getElementById('field-name').classList.toggle('invalid', !validName);
    document.getElementById('field-phone').classList.toggle('invalid', !validPhone);
    document.getElementById('field-service').classList.toggle('invalid', !validService);
    if (!validName || !validPhone || !validService) {
      const firstInvalid = form.querySelector('.field.invalid input, .field.invalid select');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    whatsappRequest = request;
    updateWhatsAppLink();

    setStatus('Sending your request…', 'pending');
    fallback.hidden = true;
    submitButton.disabled = true;

    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      if (!response.ok) throw new Error('Booking request was rejected.');

      setStatus('Request saved. Continue on WhatsApp to contact our team.', 'success');
      fallback.hidden = false;
      form.reset();
    } catch (error) {
      console.error('Could not submit booking request:', error);
      setStatus("We couldn't save your request. Please try WhatsApp or call instead.", 'error');
      fallback.hidden = false;
    } finally {
      submitButton.disabled = false;
    }
  });
})();
