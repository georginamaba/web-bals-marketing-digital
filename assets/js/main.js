/* BALS Marketing Digital — interacciones */
(() => {
  'use strict';

  const root = document.documentElement;
  root.classList.remove('no-js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Carga del hero ---------- */
  const hero = document.querySelector('.hero');
  const startHero = () => requestAnimationFrame(() => hero && hero.classList.add('is-loaded'));
  if (document.fonts && document.fonts.ready) {
    // Esperamos a las fuentes (máx. 600 ms) para que la animación no "salte"
    Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 600))]).then(startHero);
  } else {
    startHero();
  }

  /* ---------- Header: fondo al hacer scroll + ocultar al bajar ---------- */
  const header = document.querySelector('.site-header');
  let lastY = window.scrollY;
  let ticking = false;
  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle('is-scrolled', y > 20);
    const goingDown = y > lastY && y > 400;
    if (!document.body.classList.contains('menu-open')) {
      header.classList.toggle('is-hidden', goingDown);
    }
    lastY = y;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(onScroll); ticking = true; }
  }, { passive: true });
  onScroll();

  /* ---------- Menú móvil ---------- */
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.getElementById('mobile-menu');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
    document.body.classList.toggle('menu-open', open);
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('is-open')));
    } else {
      menu.classList.remove('is-open');
      setTimeout(() => { if (!menu.classList.contains('is-open')) menu.hidden = true; }, reduceMotion ? 0 : 700);
    }
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  menu.addEventListener('click', (e) => { if (e.target.closest('a')) setMenu(false); });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('menu-open')) { setMenu(false); toggle.focus(); }
  });
  window.matchMedia('(min-width: 901px)').addEventListener('change', (e) => { if (e.matches) setMenu(false); });

  /* ---------- Reveal on scroll ---------- */
  const revealables = document.querySelectorAll('.reveal, .cta-band');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    revealables.forEach((el) => io.observe(el));
  } else {
    revealables.forEach((el) => el.classList.add('is-visible'));
  }

  /* ---------- Enlace activo según la sección ---------- */
  const navLinks = [...document.querySelectorAll('.nav-link')];
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((a) => {
          const active = a.getAttribute('href') === '#' + entry.target.id;
          a.classList.toggle('is-active', active);
          if (active) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Botones magnéticos (solo puntero fino) ---------- */
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches && !reduceMotion) {
    document.querySelectorAll('.magnetic').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * 0.18;
        const y = (e.clientY - r.top - r.height / 2) * 0.28;
        btn.style.transform = `translate(${x}px, ${y}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });

    // Parallax suave del póster del hero
    const poster = document.querySelector('.hero-art');
    if (poster && hero) {
      hero.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 14;
        const y = (e.clientY / window.innerHeight - 0.5) * 10;
        poster.style.transform = `translate(${x}px, ${y}px)`;
      });
      hero.addEventListener('mouseleave', () => { poster.style.transform = ''; });
      poster.style.transition = 'transform .8s cubic-bezier(.22,1,.36,1)';
    }
  }

  /* ---------- Formulario de contacto ---------- */
  const form = document.getElementById('contact-form');
  const success = document.getElementById('form-success');

  // Las cards de servicios preseleccionan el servicio en el formulario
  document.querySelectorAll('.service-link[data-service]').forEach((link) => {
    link.addEventListener('click', () => {
      const box = form.querySelector(`input[name="servicios"][value="${link.dataset.service}"]`);
      if (box) box.checked = true;
    });
  });

  const rules = {
    nombre: (v) => v.trim().length >= 2 || 'Dinos cómo te llamas.',
    email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Revisa tu email, parece que falta algo.',
    mensaje: (v) => v.trim().length >= 10 || 'Cuéntanos un poco más (mínimo 10 caracteres).',
    privacidad: (_, el) => el.checked || 'Necesitamos que aceptes la política de privacidad.',
  };

  const validateField = (el) => {
    const rule = rules[el.name];
    if (!rule) return true;
    const result = rule(el.value, el);
    const field = el.closest('.field');
    const err = document.getElementById(el.id + '-err');
    const ok = result === true;
    field.classList.toggle('has-error', !ok);
    el.setAttribute('aria-invalid', String(!ok));
    if (err) {
      err.textContent = ok ? '' : result;
      if (!ok) el.setAttribute('aria-describedby', err.id); else el.removeAttribute('aria-describedby');
    }
    return ok;
  };

  form.querySelectorAll('input, textarea').forEach((el) => {
    if (!rules[el.name]) return;
    el.addEventListener('blur', () => { if (el.value || el.type === 'checkbox') validateField(el); });
    el.addEventListener('input', () => { if (el.closest('.field').classList.contains('has-error')) validateField(el); });
    el.addEventListener('change', () => { if (el.type === 'checkbox') validateField(el); });
  });

  const showSuccess = (viaMail) => {
    if (viaMail) {
      document.getElementById('success-title').textContent = '¡Ya casi está!';
      document.getElementById('success-text').innerHTML =
        'Hemos abierto tu correo con el mensaje ya escrito: solo te falta darle a <strong>enviar</strong>. ' +
        'Si no se ha abierto, escríbenos a <a href="mailto:hola@balsmarketingdigital.com">hola@balsmarketingdigital.com</a> o llámanos al <a href="tel:+34657349206">+34 657 34 92 06</a>.';
    }
    form.hidden = true;
    success.hidden = false;
    success.focus();
  };

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fields = [...form.querySelectorAll('input, textarea')].filter((el) => rules[el.name]);
    const results = fields.map(validateField);
    const firstInvalid = fields[results.indexOf(false)];
    if (firstInvalid) { firstInvalid.focus(); return; }

    const data = new FormData(form);
    const services = data.getAll('servicios').join(', ') || '—';
    const endpoint = form.dataset.endpoint;
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;

    try {
      if (endpoint) {
        // Envío a un backend/servicio de formularios (p. ej. Formspree) si se configura data-endpoint
        const res = await fetch(endpoint, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
        if (!res.ok) throw new Error('Error ' + res.status);
      } else {
        // Sin backend: abrimos el cliente de correo con el mensaje ya redactado
        const body = [
          `Nombre: ${data.get('nombre')}`,
          `Email: ${data.get('email')}`,
          `Teléfono: ${data.get('telefono') || '—'}`,
          `Tipo de negocio: ${data.get('tipo') || '—'}`,
          `Servicios: ${services}`,
          '',
          data.get('mensaje'),
        ].join('\n');
        const subject = `Nuevo proyecto · ${data.get('nombre')}`;
        window.location.href = `mailto:${form.dataset.mailto}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      }
      showSuccess(!endpoint);
    } catch (err) {
      alert('Vaya, no hemos podido enviar el mensaje. Escríbenos a hola@balsmarketingdigital.com o llámanos al +34 657 34 92 06.');
    } finally {
      btn.disabled = false;
    }
  });

  document.getElementById('form-reset').addEventListener('click', () => {
    form.reset();
    form.querySelectorAll('.has-error').forEach((f) => f.classList.remove('has-error'));
    success.hidden = true;
    form.hidden = false;
    form.querySelector('input').focus();
  });

  /* ---------- Año del footer ---------- */
  const year = document.getElementById('year');
  if (year) year.textContent = new Date().getFullYear();
})();
