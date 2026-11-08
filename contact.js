// Contact form: saves the message before offering WhatsApp follow-up.
(function () {
  'use strict';

  const form = document.getElementById('contactForm');
  if (!form) return;

  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const topicSelect = document.getElementById('topic');
  const messageInput = document.getElementById('message');
  const status = document.getElementById('contactStatus');
  const fallback = document.getElementById('contactFallback');
  const whatsAppLink = document.getElementById('contactWhatsApp');
  const submitButton = form.querySelector('[type="submit"]');
  const translate = (value) => window.siteTranslate ? window.siteTranslate(value) : value;
  let whatsappRequest = null;
  let statusKey = '';

  function updateWhatsAppLink() {
    if (!whatsappRequest) return;
    const lines = [
      translate('Hello Shreeram Agri Services,'),
      '',
      `${translate('Name:')} ${whatsappRequest.name}`,
      `${translate('Mobile:')} ${whatsappRequest.phone}`,
      `${translate('Topic:')} ${translate(whatsappRequest.topic || 'General enquiry')}`,
      '',
      `${translate('Message:')} ${whatsappRequest.message}`
    ].join('\n');
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

  [nameInput, phoneInput, messageInput].forEach((input) => {
    input.addEventListener('input', () => input.closest('.field').classList.remove('invalid'));
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const request = {
      name: nameInput.value.trim(),
      phone: phoneInput.value.trim(),
      topic: topicSelect.value,
      message: messageInput.value.trim(),
      language: document.documentElement.lang === 'mr' ? 'mr' : 'en'
    };
    const validName = request.name.length > 1;
    const validPhone = /^[6-9]\d{9}$/.test(request.phone);
    const validMessage = request.message.length > 3;

    document.getElementById('field-name').classList.toggle('invalid', !validName);
    document.getElementById('field-phone').classList.toggle('invalid', !validPhone);
    document.getElementById('field-message').classList.toggle('invalid', !validMessage);
    if (!validName || !validPhone || !validMessage) {
      const firstInvalid = form.querySelector('.field.invalid input, .field.invalid textarea');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    whatsappRequest = request;
    updateWhatsAppLink();

    setStatus('Sending your message…', 'pending');
    fallback.hidden = true;
    submitButton.disabled = true;

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      if (!response.ok) throw new Error('Contact request was rejected.');

      setStatus('Your message has been saved. Continue on WhatsApp to contact our team.', 'success');
      fallback.hidden = false;
      form.reset();
    } catch (error) {
      console.error('Could not submit contact message:', error);
      setStatus("We couldn't save your message. Please try WhatsApp or call instead.", 'error');
      fallback.hidden = false;
    } finally {
      submitButton.disabled = false;
    }
  });
})();
