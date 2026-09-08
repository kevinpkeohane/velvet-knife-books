/* Conversion Tracking — fires GA4 + Meta Pixel events */
(function () {
  function fire(gaEvent, gaParams, metaEvent, metaParams) {
    // GA4
    if (typeof gtag === 'function') {
      gtag('event', gaEvent, gaParams || {});
    }
    // Meta Pixel
    if (typeof fbq === 'function') {
      if (metaEvent === 'trackCustom') {
        fbq('trackCustom', metaParams.name, metaParams.data || {});
      } else {
        fbq('track', metaEvent || 'Lead', metaParams || {});
      }
    }
  }

  document.addEventListener('DOMContentLoaded', function () {

    // ── 1. Mailto link clicks ───────────────────────────────────────────────
    document.querySelectorAll('a[href^="mailto:"]').forEach(function (el) {
      el.addEventListener('click', function () {
        fire(
          'email_click',
          { email: el.href.replace('mailto:', '').split('?')[0], event_category: 'contact' },
          'trackCustom',
          { name: 'EmailClick' }
        );
      });
    });

    // ── 2. Phone link clicks ───────────────────────────────────────────────
    document.querySelectorAll('a[href^="tel:"]').forEach(function (el) {
      el.addEventListener('click', function () {
        fire(
          'phone_click',
          { phone: el.href.replace('tel:', ''), event_category: 'contact' },
          'trackCustom',
          { name: 'PhoneClick' }
        );
      });
    });

    // ── 3. Contact form submissions ────────────────────────────────────────
    document.querySelectorAll('form.contact-form, form[action*="formsubmit"]').forEach(function (form) {
      form.addEventListener('submit', function () {
        fire(
          'generate_lead',
          { event_category: 'contact', event_label: 'contact_form' },
          'Lead',
          { content_name: 'Contact Form' }
        );
      });
    });

    // ── 4. Retailer / buy button clicks (book sites) ───────────────────────
    document.querySelectorAll('a.buy-btn, a[href*="amazon"], a[href*="barnesandnoble"], a[href*="kobo"], a[href*="kennedymaceoghain"]').forEach(function (el) {
      el.addEventListener('click', function () {
        var retailer = 'other';
        var href = el.href || '';
        if (href.includes('amazon'))          retailer = 'amazon';
        else if (href.includes('barnesandnoble')) retailer = 'barnes_noble';
        else if (href.includes('kobo'))        retailer = 'kobo';
        else if (href.includes('kennedymaceoghain')) retailer = 'direct';

        // Try to find book title from parent card
        var card = el.closest('[class*="book"], [class*="card"], section');
        var title = card ? (card.querySelector('h2,h3,h4') || {}).innerText || 'unknown' : 'unknown';

        fire(
          'retailer_click',
          { retailer: retailer, book_title: title.trim().substring(0, 60), event_category: 'purchase_intent' },
          'trackCustom',
          { name: 'RetailerClick', data: { retailer: retailer, book: title.trim().substring(0, 60) } }
        );
      });
    });

    // ── 5. CTA button clicks (Start a project, Get Maven playbook, etc.) ───
    document.querySelectorAll('a.btn-primary, a.nav-cta, button.btn[type="submit"]').forEach(function (el) {
      el.addEventListener('click', function () {
        var label = (el.innerText || el.textContent || '').trim().substring(0, 60);
        fire(
          'cta_click',
          { cta_text: label, event_category: 'engagement' },
          'trackCustom',
          { name: 'CTAClick', data: { cta: label } }
        );
      });
    });

  });
})();
