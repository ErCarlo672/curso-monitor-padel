(() => {
  const C = window.WPA, CURSO = window.CURSO;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const eur = n => n.toLocaleString('es-ES', { maximumFractionDigits: 2 }) + ' €';
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };

  // UTM de la campaña: se guardan para añadirlas al mensaje de WhatsApp
  const params = new URLSearchParams(location.search);
  const utm = ['utm_source', 'utm_campaign', 'utm_content'].map(k => params.get(k)).filter(Boolean).join(' / ');
  if (utm) store.set('wpa_utm', utm);
  const origen = store.get('wpa_utm');
  const wa = txt => `https://wa.me/${C.whatsapp}?text=${encodeURIComponent(txt + (origen ? `\n(Vengo de: ${origen})` : ''))}`;

  /* ---------- datos de config ---------- */
  $$('[data-cfg]').forEach(el => { if (C[el.dataset.cfg]) el.textContent = C[el.dataset.cfg]; });
  $$('[data-garantia]').forEach(el => el.textContent = C.garantiaDias);
  for (const [k, t] of Object.entries(C.tarifas)) {
    $$(`[data-price="${k}"]`).forEach(el => el.textContent = eur(t.precio));
    const split = $(`[data-split="${k}"]`);
    if (split && C.plazos > 1) split.textContent = `o ${C.plazos} plazos de ${eur(Math.ceil(t.precio / C.plazos * 100) / 100)}`;
  }
  if (C.plazos > 1) { $$('[data-plazos]').forEach(el => el.textContent = C.plazos); $('[data-split-hero]').textContent = ` o en ${C.plazos} plazos`; }
  else { $('[data-plazos-note]')?.remove(); const f = $('[data-faq-plazos]'); if (f) f.textContent = 'Por ahora el pago es único. Si lo necesitas, escríbenos y lo vemos.'; }
  const libres = Math.max(0, C.plazasPremiumLibres);
  $('[data-seats]').textContent = libres ? `${libres} de ${C.plazasPremium} plazas libres` : 'Plazas agotadas';
  requestAnimationFrame(() => setTimeout(() => $('[data-seats-bar]').style.width = `${100 - libres / C.plazasPremium * 100 || 4}%`, 400));

  /* ---------- compra: Stripe si hay enlace, si no WhatsApp ---------- */
  $$('[data-buy]').forEach(a => {
    const t = C.tarifas[a.dataset.buy];
    const agotado = a.dataset.buy === 'premium' && !libres;
    if (agotado) { a.textContent = 'Plazas agotadas · Avísame'; a.href = wa('Hola, quiero que me aviséis para la próxima convocatoria Premium'); return; }
    a.href = t.pago || wa(`Hola, quiero reservar plaza en el curso de monitor de pádel, tarifa ${t.nombre} (${eur(t.precio)}). ${C.promocion}.`);
    if (!t.pago) { a.target = '_blank'; a.rel = 'noopener'; }
    a.addEventListener('click', () => track('InitiateCheckout', { value: t.precio, currency: 'EUR', content_name: t.nombre }));
  });
  $$('[data-wa]').forEach(a => { a.href = wa(a.dataset.wa); a.target = '_blank'; a.rel = 'noopener'; });

  /* ---------- temario ---------- */
  const box = $('[data-syllabus]');
  if (box) {
    let total = 0, mins = 0;
    box.innerHTML = CURSO.map((m, i) => {
      const min = m.lecciones.reduce((s, l) => s + l[1], 0);
      total += m.lecciones.length; mins += min;
      return `<details class="mod rv"${i === 0 ? ' open' : ''}>
        <summary><span class="mod__n">M${i + 1}</span><h3>${m.titulo}<small>${m.lecciones.length} lecciones · ${min} min</small></h3><span class="mod__plus"><i class="ph ph-plus"></i></span></summary>
        <div class="mod__body"><p>${m.resumen}</p><ol>${m.lecciones.map(([t, d]) => `<li><span>${t}</span><span>${d} min</span></li>`).join('')}</ol></div>
      </details>`;
    }).join('');
    $('[data-total]').textContent = `${total} lecciones en vídeo, más de ${Math.floor(mins / 60)} horas de contenido y ${window.DIRECTOS.length} directos de 90 minutos.`;
  }

  /* ---------- test de tarifa ---------- */
  const Q = [
    ['¿Cuál es tu nivel de juego?', [['Juego partidos con soltura', 1], ['Compito en torneos o ligas', 2], ['Estoy empezando', 0]]],
    ['¿Has dado alguna clase?', [['Nunca', 2], ['Alguna a amigos o conocidos', 1], ['Ya doy clases', 0]]],
    ['¿Cómo aprendes mejor?', [['Viendo vídeos a mi ritmo', 0], ['Haciendo, en pista y con alguien al lado', 2], ['Un poco de todo', 1]]],
    ['¿Podrías venir un fin de semana a Dos Hermanas?', [['Sí, sin problema', 2], ['Quizá, depende de la fecha', 1], ['No, me queda lejos', -9]]],
  ];
  const quiz = $('[data-quiz]');
  if (quiz) {
    let i = 0, pts = 0, nivel0 = false;
    const draw = () => {
      if (i < Q.length) {
        const [q, ops] = Q[i];
        quiz.innerHTML = `<div class="quiz__progress"><i style="width:${i / Q.length * 100}%"></i></div>
          <p class="mono muted" style="margin-bottom:8px">Pregunta ${i + 1} de ${Q.length}</p><h3>${q}</h3>
          <div class="quiz__opts">${ops.map(([t, p], k) => `<button class="opt" data-k="${k}"><i class="ph ph-arrow-right"></i>${t}</button>`).join('')}</div>`;
        $$('.opt', quiz).forEach(b => b.onclick = () => { const p = ops[b.dataset.k][1]; if (i === 0 && p === 0) nivel0 = true; pts += p; i++; draw(); });
        return;
      }
      const premium = pts >= 5;
      const t = C.tarifas[premium ? 'premium' : 'online'];
      const extra = nivel0 ? ' Te recomendamos llegar con algo más de rodaje en partidos; el curso te pedirá demostrar los golpes básicos.' : '';
      quiz.innerHTML = `<div class="quiz__progress"><i style="width:100%"></i></div><div class="quiz__result">
        <span class="icon-tile ${premium ? 'icon-tile--fire' : 'icon-tile--ball'}"><i class="ph-fill ${premium ? 'ph-crown-simple' : 'ph-device-mobile'}"></i></span>
        <p class="mono muted">Tu tarifa</p><h3>${t.nombre} · ${eur(t.precio)}</h3>
        <p>${premium ? 'Te va a sacar mucho partido practicar en pista con alumnos reales y feedback en el momento.' : 'Puedes formarte a tu ritmo y practicar en tu club. Si luego quieres el finde presencial, pagas la diferencia.'}${extra}</p>
        <div class="hero__cta" style="justify-content:center;margin-top:0"><a class="btn ${premium ? 'btn--fire' : 'btn--ball'}" href="#tarifas">Ver tarifa ${t.nombre}</a><button class="link" data-again>Repetir test</button></div></div>`;
      $('[data-again]', quiz).onclick = () => { i = 0; pts = 0; nivel0 = false; draw(); };
      track('Lead', { content_name: 'test_' + t.nombre });
    };
    draw();
  }

  /* ---------- frase palabra a palabra ---------- */
  const tg = $('[data-words]');
  if (tg) {
    const hot = ['repetición.', 'también.'];
    tg.innerHTML = tg.textContent.trim().split(/\s+/).map(w => `<span class="w${hot.includes(w) ? ' hot' : ''}">${w}</span>`).join(' ');
    const ws = $$('.w', tg);
    let ticking = false;
    const paint = () => {
      ticking = false;
      const r = tg.getBoundingClientRect(), vh = innerHeight;
      const p = Math.min(1, Math.max(0, (vh * .85 - r.top) / (r.height + vh * .35)));
      const n = Math.round(p * ws.length);
      ws.forEach((w, k) => w.classList.toggle('on', k < n));
    };
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { addEventListener('scroll', onS, { passive: true }); paint(); }
      else removeEventListener('scroll', onS);
    });
    const onS = () => { if (!ticking) { ticking = true; requestAnimationFrame(paint); } };
    io.observe(tg);
  }

  /* ---------- reveal ---------- */
  const rio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.rv').forEach(el => rio.observe(el));

  /* ---------- menú ---------- */
  const burger = $('.burger');
  const toggle = open => { document.body.classList.toggle('menu-open', open); burger.setAttribute('aria-expanded', open); burger.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú'); };
  burger.onclick = () => toggle(!document.body.classList.contains('menu-open'));
  $$('#menu a').forEach(a => a.onclick = () => toggle(false));
  addEventListener('keydown', e => e.key === 'Escape' && toggle(false));

  // enlace activo en la nav
  const links = $$('.nav__links a');
  const sio = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    links.forEach(a => a.toggleAttribute('aria-current', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-45% 0px -50% 0px' });
  ['temario', 'campus', 'finde', 'tarifas', 'faq'].forEach(id => { const s = document.getElementById(id); s && sio.observe(s); });

  // barra fija en móvil: aparece tras el hero y se esconde en tarifas
  const sticky = $('[data-sticky]');
  let pastHero = false, inPrices = false;
  const upd = () => sticky.classList.toggle('show', pastHero && !inPrices);
  new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; upd(); }).observe($('.hero'));
  new IntersectionObserver(([e]) => { inPrices = e.isIntersecting; upd(); }).observe($('#tarifas'));

  /* ---------- cookies y píxeles ---------- */
  function track(ev, data) {
    if (window.fbq) fbq('track', ev, data);
    if (window.ttq) ttq.track(ev === 'Lead' ? 'SubmitForm' : ev, data);
  }
  function loadPixels() {
    if (C.metaPixel) {
      !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', C.metaPixel); fbq('track', 'PageView');
    }
    if (C.tiktokPixel) {
      !function(w,d,t){w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=['page','track','identify','instances','debug','on','off','once','ready','alias','group','enableCookie','disableCookie'];ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.load=function(e){var n='https://analytics.tiktok.com/i18n/pixel/events.js';ttq._i=ttq._i||{};ttq._i[e]=[];ttq._i[e]._u=n;var a=d.createElement('script');a.type='text/javascript';a.async=!0;a.src=n+'?sdkid='+e+'&lib='+t;var s=d.getElementsByTagName('script')[0];s.parentNode.insertBefore(a,s)};ttq.load(C.tiktokPixel);ttq.page()}(window,document,'ttq');
    }
  }
  const banner = $('[data-cookies]');
  const hayPixel = C.metaPixel || C.tiktokPixel;
  const choice = store.get('wpa_cookies');
  if (choice === 'si') loadPixels();
  else if (!choice && hayPixel) banner.hidden = false;
  $('[data-cookies-yes]').onclick = () => { store.set('wpa_cookies', 'si'); banner.hidden = true; loadPixels(); };
  $('[data-cookies-no]').onclick = () => { store.set('wpa_cookies', 'no'); banner.hidden = true; };

  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
