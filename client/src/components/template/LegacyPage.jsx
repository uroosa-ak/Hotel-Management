import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

function runScript(script) {
  return new Promise((resolve) => {
    const el = document.createElement('script');
    el.dataset.legacyScript = 'true';
    if (script.type === 'inline') {
      el.text = script.code;
      document.body.appendChild(el);
      resolve();
      return;
    }
    el.src = script.src;
    el.async = false;
    el.onload = resolve;
    el.onerror = resolve;
    document.body.appendChild(el);
  });
}

/**
 * Renders a scraped WordPress/Elementor page with full fidelity,
 * replays its scripts so sliders/menus/accordions/forms function as intended,
 * intercepts internal links for instant client-side routing,
 * and intercepts the booking search form to connect with the MERN booking engine.
 */
export default function LegacyPage({ html, scripts = [], bodyClass = '' }) {
  const containerRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const previousBodyClass = document.body.className;
    if (bodyClass) {
      document.body.className = bodyClass;
    }

    let cancelled = false;

    async function run() {
      for (const script of scripts) {
        if (cancelled) return;
        await runScript(script);
      }
      if (cancelled) return;

      document.dispatchEvent(new Event('DOMContentLoaded', { bubbles: true, cancelable: true }));
      if (window.elementorFrontend?.init) {
        try {
          window.elementorFrontend.init();
        } catch {
          /* noop */
        }
      }
    }

    run();

    return () => {
      cancelled = true;
      document.body.className = previousBodyClass;
      document.querySelectorAll('script[data-legacy-script="true"]').forEach((el) => el.remove());
    };
  }, [html, scripts, bodyClass]);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return undefined;

    // Intercept internal link clicks so navigation stays client-side
    const onClick = (event) => {
      const anchor = event.target.closest?.('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (!href) return;

      // Ignore anchor fragments, external links, mailto, tel
      if (href.startsWith('#') || href.startsWith('http://') || href.startsWith('https://') || href.startsWith('mailto:') || href.startsWith('tel:')) {
        return;
      }

      // Map WordPress demo search/booking links to the real booking engine
      if (href.includes('search-results') || href.includes('booking')) {
        event.preventDefault();
        navigate('/booking');
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }

      // Standard internal routes
      if (href.startsWith('/')) {
        event.preventDefault();
        navigate(href);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    // Intercept horizontal booking search form
    const onSubmit = (event) => {
      const form = event.target.closest?.('form');
      if (!form) return;

      // Check if it's the booking search form
      if (form.classList.contains('mphb_sc_search-form') || form.action?.includes('search-results')) {
        event.preventDefault();
        const checkInInput = form.querySelector('input[name*="check_in_date"], input[id*="check-in"], input[name*="mphb_check_in_date"]');
        const checkOutInput = form.querySelector('input[name*="check_out_date"], input[id*="check-out"], input[name*="mphb_check_out_date"]');
        const adultsSelect = form.querySelector('select[name*="adults"], select[name*="guests"], select[id*="guests"]');

        const params = new URLSearchParams();
        if (checkInInput?.value) params.set('checkIn', checkInInput.value);
        if (checkOutInput?.value) params.set('checkOut', checkOutInput.value);
        if (adultsSelect?.value) params.set('guests', adultsSelect.value);

        navigate(`/rooms?${params.toString()}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    };

    node.addEventListener('click', onClick);
    node.addEventListener('submit', onSubmit);

    return () => {
      node.removeEventListener('click', onClick);
      node.removeEventListener('submit', onSubmit);
    };
  }, [navigate]);

  return <div ref={containerRef} dangerouslySetInnerHTML={{ __html: html }} />;
}
