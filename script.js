const WHATSAPP_NUMBER = '5534987210841';

function buildWhatsAppLink(message) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

document.querySelectorAll('.js-whatsapp').forEach((button) => {
  const message = button.dataset.message || 'Olá, João! Quero solicitar um orçamento.';
  button.href = buildWhatsAppLink(message);
  button.target = '_blank';
  button.rel = 'noopener';

  button.addEventListener('click', () => {
    if (typeof fbq === 'function') {
      fbq('track', 'Contact');
    }

    if (typeof gtag === 'function') {
      gtag('event', 'click_whatsapp', {
        event_category: 'engagement',
        event_label: 'whatsapp_alcar'
      });
    }

    if (typeof clarity === 'function') {
      clarity('event', 'click_whatsapp_alcar');
    }
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
