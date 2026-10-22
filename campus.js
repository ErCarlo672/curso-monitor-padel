(() => {
  const C = window.WPA, CURSO = window.CURSO, DIRECTOS = window.DIRECTOS;
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const view = $('#vista');
  const IMGS = ['tecnica', 'golpes', 'pala', 'pista', 'resto', 'golpe-clave', 'medio', 'grupos', 'entrenar-solo', 'academy'];
  const img = (k) => `assets/img/${IMGS[k % IMGS.length]}.webp`;

  /* ---------- estado (solo en este navegador) ---------- */
  const KEY = 'wpa_campus_demo';
  let S = { done: {}, passed: {}, plan: 'premium', name: '' };
  try { Object.assign(S, JSON.parse(localStorage.getItem(KEY)) || {}); } catch {}
  const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };

  const LEVELS = [['Alumno', 0, 'ph-tennis-ball'], ['Asistente', 150, 'ph-whistle'], ['Monitor', 400, 'ph-chalkboard-teacher'], ['Monitor Wild', 650, 'ph-crown-simple']];
  const totalLessons = CURSO.reduce((s, m) => s + m.lecciones.length, 0);
  const xp = () => Object.keys(S.done).length * 10 + Object.keys(S.passed).length * 30;
  const maxXp = totalLessons * 10 + CURSO.length * 30;
  const level = () => { const x = xp(); let i = 0; LEVELS.forEach((l, k) => { if (x >= l[1]) i = k; }); return i; };
  const unlocked = i => i === 0 || !!S.passed[CURSO[i - 1].id];
  const modDone = m => m.lecciones.every((_, k) => S.done[`${m.id}-${k}`]);
  const allPassed = () => CURSO.every(m => S.passed[m.id]);
  const nextLesson = () => {
    for (let i = 0; i < CURSO.length; i++) {
      const m = CURSO[i];
      if (!unlocked(i)) return null;
      const k = m.lecciones.findIndex((_, k) => !S.done[`${m.id}-${k}`]);
      if (k >= 0) return { i, k };
      if (!S.passed[m.id]) return { i, test: true };
    }
    return null;
  };

  const fechas = (() => {
    const d0 = new Date(C.inicioISO + 'T' + C.horaDirecto + ':00');
    return DIRECTOS.map((_, k) => new Date(d0.getTime() + k * 7 * 864e5));
  })();
  const fmt = d => d.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });

  const head = (t, sub, extra = '') => `<div class="view__head"><div><h1>${t}</h1>${sub ? `<p class="muted">${sub}</p>` : ''}</div>${extra}</div>`;
  const back = (to, txt) => `<a class="back" href="#${to}"><i class="ph ph-arrow-left"></i>${txt}</a>`;

  /* ---------- vistas ---------- */
  const V = {
    inicio() {
      const lv = level(), x = xp(), nx = nextLesson();
      const sig = LEVELS[lv + 1];
      const pct = Math.round(x / maxXp * 100);
      let nextHtml;
      if (!nx) nextHtml = `<div class="empty"><i class="ph-fill ph-confetti"></i><b>Has terminado el temario</b>Ya puedes descargar tu diploma.<div style="margin-top:16px"><a class="btn btn--ball btn--sm" href="#diploma">Ver diploma</a></div></div>`;
      else if (nx.test) nextHtml = `<div class="next"><span class="icon-tile icon-tile--fire" style="width:96px;height:96px;font-size:40px"><i class="ph-fill ph-exam"></i></span><div><p class="mono muted">Módulo ${nx.i + 1}</p><b>Test: ${CURSO[nx.i].titulo}</b><p style="margin-top:12px"><a class="btn btn--fire btn--sm" href="#test/${CURSO[nx.i].id}">Hacer el test</a></p></div></div>`;
      else { const m = CURSO[nx.i]; nextHtml = `<div class="next"><img src="${img(nx.i * 3 + nx.k)}" alt="" width="96" height="128"><div><p class="mono muted">Módulo ${nx.i + 1} · Lección ${nx.k + 1}</p><b>${m.lecciones[nx.k][0]}</b><p style="margin-top:12px"><a class="btn btn--fire btn--sm" href="#l/${m.id}/${nx.k}">${x ? 'Continuar' : 'Empezar'} <i class="ph-fill ph-play"></i></a></p></div></div>`; }
      const prox = fechas.findIndex(d => d > new Date());
      const pi = prox < 0 ? 0 : prox;
      return head(`Hola${S.name ? ', ' + S.name.split(' ')[0] : ''}`, `${C.promocion} · ${C.tarifas[S.plan].nombre}`) + `
        <div class="grid2">
          <section class="panel"><h2>Tu nivel</h2>
            <div class="lvl-row"><div class="ring" style="--p:${pct}"><b>${pct}%</b></div>
            <div><p class="mono muted">Nivel actual</p><p style="font-size:24px;line-height:32px;font-weight:800"><i class="ph-fill ${LEVELS[lv][2]} ball"></i> ${LEVELS[lv][0]}</p>
            <p class="xp">${x} / ${maxXp} puntos${sig ? ` · ${sig[1] - x} para ${sig[0]}` : ''}</p></div></div>
            <div class="levels">${LEVELS.map((l, k) => `<div class="level${k <= lv ? ' on' : ''}"><i class="ph-fill ${l[2]}"></i>${l[0]}</div>`).join('')}</div>
          </section>
          <section class="panel"><h2>Sigue donde lo dejaste</h2>${nextHtml}</section>
          <section class="panel"><h2>Próximo directo</h2>
            <div class="row"><span class="row__ico" style="background:var(--red);color:#fff"><i class="ph-fill ph-broadcast"></i></span><div class="row__main"><b>${DIRECTOS[pi][0]}</b><small>${fmt(fechas[pi])} · ${C.horaDirecto} h</small></div></div>
            <p style="margin-top:16px"><a class="link" href="#directos">Ver calendario completo</a></p>
          </section>
          <section class="panel"><h2>Finde presencial</h2>
            ${S.plan === 'premium'
              ? `<div class="row"><span class="row__ico" style="background:var(--orange);color:#000"><i class="ph-fill ph-map-pin"></i></span><div class="row__main"><b>Plaza confirmada</b><small>${C.findePresencial}</small></div></div><p style="margin-top:16px"><a class="link" href="#finde">Ver programa</a></p>`
              : `<p class="muted">Tu tarifa es Online. Puedes añadir el fin de semana en pista pagando la diferencia.</p><p style="margin-top:16px"><a class="link" href="#finde">Ver opciones</a></p>`}
          </section>
        </div>`;
    },

    temario() {
      return head('Temario', `${totalLessons} lecciones · ${CURSO.length} módulos`) + `<div class="list">${CURSO.map((m, i) => {
        const n = m.lecciones.filter((_, k) => S.done[`${m.id}-${k}`]).length, ok = unlocked(i), p = S.passed[m.id];
        return `<button class="row${p ? ' done' : ''}${ok ? '' : ' locked'}" ${ok ? `data-href="#m/${m.id}"` : 'aria-disabled="true"'}>
          <span class="row__ico"><i class="ph${p ? '-fill ph-check' : ' ' + (ok ? m.icono : 'ph-lock-simple')}"></i></span>
          <span class="row__main"><b>M${i + 1} · ${m.titulo}</b><small>${ok ? `${n} de ${m.lecciones.length} lecciones${p ? ' · test aprobado' : ''}` : 'Aprueba el test del módulo anterior para desbloquearlo'}</small></span>
          <i class="ph ph-caret-right muted"></i></button>`;
      }).join('')}</div>`;
    },

    m(id) {
      const i = CURSO.findIndex(m => m.id === id), m = CURSO[i];
      if (!m || !unlocked(i)) return go('temario');
      const all = modDone(m);
      return back('temario', 'Temario') + head(`M${i + 1} · ${m.titulo}`, m.resumen) + `<div class="list">
        ${m.lecciones.map(([t, d], k) => { const dn = S.done[`${m.id}-${k}`]; return `<button class="row${dn ? ' done' : ''}" data-href="#l/${m.id}/${k}"><span class="row__ico"><i class="ph${dn ? '-fill ph-check' : '-fill ph-play'}"></i></span><span class="row__main"><b>${k + 1}. ${t}</b><small>${d} min</small></span><i class="ph ph-caret-right muted"></i></button>`; }).join('')}
        <button class="row${S.passed[m.id] ? ' done' : ''}${all ? '' : ' locked'}" ${all ? `data-href="#test/${m.id}"` : 'aria-disabled="true"'}><span class="row__ico"><i class="ph-fill ${S.passed[m.id] ? 'ph-check' : 'ph-exam'}"></i></span><span class="row__main"><b>Test del módulo</b><small>${S.passed[m.id] ? 'Aprobado' : all ? '3 preguntas · necesitas acertarlas todas' : 'Se desbloquea al ver todas las lecciones'}</small></span><i class="ph ph-caret-right muted"></i></button>
      </div>${all ? '' : `<p style="margin-top:16px"><button class="link" data-skip="${m.id}">Demo: marcar todas como vistas</button></p>`}`;
    },

    l(id, k) {
      const i = CURSO.findIndex(m => m.id === id), m = CURSO[i]; k = +k;
      if (!m || !unlocked(i) || !m.lecciones[k]) return go('temario');
      const [t, d] = m.lecciones[k], last = k === m.lecciones.length - 1;
      return back(`m/${id}`, `M${i + 1} · ${m.titulo}`) + `
        <div class="player"><img src="${img(i * 3 + k)}" alt="">
          <div class="player__msg"><span><i class="ph-fill ph-play"></i></span><b>${t}</b><p class="muted">Vídeo de ${d} min. En la versión final aquí se reproduce la lección.</p></div></div>
        <div class="view__head" style="margin-top:24px"><div><p class="mono muted">Lección ${k + 1} de ${m.lecciones.length}</p><h1>${t}</h1></div>
        <button class="btn btn--fire" data-done="${id}/${k}">${S.done[`${id}-${k}`] ? 'Vista' : 'Marcar como vista'} <i class="ph-fill ph-check-circle"></i></button></div>
        <section class="panel"><h2>Material de la lección</h2><div class="list">
          <div class="row"><span class="row__ico"><i class="ph ph-file-pdf"></i></span><div class="row__main"><b>Ficha resumen</b><small>PDF · puntos clave y errores típicos</small></div></div>
          <div class="row"><span class="row__ico"><i class="ph ph-clipboard-text"></i></span><div class="row__main"><b>Ejercicios para tu clase</b><small>3 ejercicios con progresión por nivel</small></div></div>
        </div></section>
        <p style="margin-top:24px">${last ? `<a class="link" href="#m/${id}">Volver al módulo y hacer el test</a>` : `<a class="link" href="#l/${id}/${k + 1}">Siguiente lección <i class="ph ph-arrow-right"></i></a>`}</p>`;
    },

    test(id) {
      const i = CURSO.findIndex(m => m.id === id), m = CURSO[i];
      if (!m || !unlocked(i) || !modDone(m)) return go(`m/${id}`);
      return back(`m/${id}`, `M${i + 1} · ${m.titulo}`) + head(`Test · ${m.titulo}`, 'Acierta las 3 para desbloquear el siguiente módulo.') + `
        <form class="qz panel" novalidate data-test="${id}">
          ${m.q.map(([q, ops], n) => `<fieldset><legend>${n + 1}. ${q}</legend>${ops.map((o, j) => `<label><input type="radio" name="q${n}" value="${j}">${o}</label>`).join('')}</fieldset>`).join('')}
          <div data-msg></div>
          <button class="btn btn--fire" type="submit">Corregir test</button>
        </form>`;
    },

    directos() {
      const now = new Date();
      return head('Directos', `Cada semana a las ${C.horaDirecto} h · 90 minutos · quedan grabados`) + `<div class="list">${DIRECTOS.map(([t, s], k) => {
        const past = fechas[k] < now;
        return `<div class="row${past ? ' done' : ''}"><span class="row__ico"${!past ? ' style="background:var(--red);color:#fff"' : ''}><i class="ph-fill ${past ? 'ph-play' : 'ph-broadcast'}"></i></span>
          <div class="row__main"><b>${k + 1}. ${t}</b><small>${fmt(fechas[k])} · ${s}</small></div><span class="chip${past ? '' : ' chip--fire'}">${past ? 'Grabación' : 'Próximo'}</span></div>`;
      }).join('')}</div>`;
    },

    finde() {
      const plan = `<p style="margin-top:24px"><span class="mono muted">Demo · ver como:</span> <button class="link" data-plan="${S.plan === 'premium' ? 'online' : 'premium'}">tarifa ${S.plan === 'premium' ? 'Online' : 'Premium'}</button></p>`;
      if (S.plan !== 'premium') {
        const dif = C.tarifas.premium.precio - C.tarifas.online.precio;
        return head('Finde presencial', C.findePresencial) + `<div class="empty"><i class="ph-fill ph-map-pin"></i><b>No incluido en tu tarifa Online</b>Da clase a alumnos reales con Juan Carlos a tu lado. Quedan ${C.plazasPremiumLibres} plazas.
          <div style="margin-top:24px"><a class="btn btn--fire" href="https://wa.me/${C.whatsapp}?text=${encodeURIComponent('Hola, quiero pasar a Premium y añadir el finde presencial')}" target="_blank" rel="noopener">Pasar a Premium por ${dif} €</a></div></div>` + plan;
      }
      return head('Finde presencial', C.findePresencial, '<span class="chip chip--ball"><i class="ph-fill ph-check-circle"></i> Plaza confirmada</span>') + `
        <div class="grid2">
          <section class="panel"><h2>Dónde</h2><p>Wild Padel Indoor<br><span class="muted">Avenida 4 de Diciembre, 2 · 41702 Dos Hermanas (Sevilla)</span></p>
            <p style="margin-top:16px"><a class="link" href="https://www.google.com/maps/search/?api=1&query=Wild+Padel+Indoor+Dos+Hermanas" target="_blank" rel="noopener"><i class="ph ph-navigation-arrow"></i> Cómo llegar</a></p></section>
          <section class="panel"><h2>Qué traer</h2><div class="list">
            <div class="row"><span class="row__ico"><i class="ph ph-t-shirt"></i></span><div class="row__main"><b>Ropa y zapatillas de pádel</b><small>Dos días en pista</small></div></div>
            <div class="row"><span class="row__ico"><i class="ph ph-clipboard-text"></i></span><div class="row__main"><b>Tu sesión del domingo</b><small>La diseñas en el módulo 6</small></div></div>
          </div></section>
        </div>` + plan;
    },

    diploma() {
      const ok = allPassed(), n = Object.keys(S.passed).length;
      const nombre = S.name || 'Tu nombre';
      return head('Diploma', ok ? 'Enhorabuena. Este es tu diploma.' : `${n} de ${CURSO.length} módulos aprobados`) + `
        <div class="diploma${ok ? '' : ' locked'}">
          ${ok ? '' : `<div class="diploma__lock"><div><i class="ph-fill ph-lock-simple"></i>Aprueba los ${CURSO.length} tests para desbloquearlo</div></div>`}
          <img src="assets/img/logo.webp" alt="Wild Padel" width="168" height="28">
          <h3>${nombre}</h3>
          <p>ha superado el Curso de Monitor de Pádel de Wild Padel Academy${S.plan === 'premium' ? ', con prácticas presenciales en Wild Padel Indoor' : ''}.</p>
          <p style="margin-top:16px"><b>Juan Carlos Sánchez</b><br>Director técnico</p>
          <p class="mono">Código WPA DEMO · verificable en la web</p>
        </div>
        <form class="panel" style="margin-top:16px;display:flex;gap:8px;flex-wrap:wrap;align-items:center" data-name novalidate>
          <label for="nm" class="muted" style="width:100%">Nombre que aparecerá en el diploma</label>
          <input id="nm" class="field" style="text-transform:none;font-family:var(--font)" value="${S.name}" placeholder="Nombre y apellidos" autocomplete="name">
          <button class="btn btn--ghost" type="submit">Guardar</button>
          <p data-msg style="width:100%"></p>
        </form>
        <p style="margin-top:16px"><button class="link" data-reset>Demo: empezar de cero</button></p>`;
    },
  };

  /* ---------- router ---------- */
  function go(h) { location.hash = h; return ''; }
  function render() {
    const [r, ...args] = (location.hash.slice(1) || 'inicio').split('/');
    const fn = V[r] || V.inicio;
    const html = fn(...args);
    if (html === '') return;
    view.innerHTML = html;
    const tabName = { m: 'temario', l: 'temario', test: 'temario' }[r] || r;
    $$('[data-go]').forEach(b => b.dataset.go === tabName ? b.setAttribute('aria-current', 'page') : b.removeAttribute('aria-current'));
    $('[data-username]').textContent = S.name || 'Alumno demo';
    $('[data-initial]').textContent = (S.name || 'A')[0].toUpperCase();
    $('[data-plan]').textContent = 'Tarifa ' + C.tarifas[S.plan].nombre;
    scrollTo(0, 0);
  }
  addEventListener('hashchange', render);
  $$('[data-go]').forEach(b => b.onclick = () => go(b.dataset.go));

  view.addEventListener('click', e => {
    const t = e.target.closest('[data-href],[data-done],[data-skip],[data-plan],[data-reset]');
    if (!t) return;
    if (t.dataset.href) location.hash = t.dataset.href;
    else if (t.dataset.done) {
      const [id, k] = t.dataset.done.split('/');
      S.done[`${id}-${k}`] = true; save();
      const m = CURSO.find(m => m.id === id);
      go(+k < m.lecciones.length - 1 ? `l/${id}/${+k + 1}` : `m/${id}`);
    } else if (t.dataset.skip) {
      const m = CURSO.find(m => m.id === t.dataset.skip);
      m.lecciones.forEach((_, k) => S.done[`${m.id}-${k}`] = true); save(); render();
    } else if (t.dataset.plan) { S.plan = t.dataset.plan; save(); render(); }
    else if (t.dataset.reset) { S = { done: {}, passed: {}, plan: 'premium', name: '' }; save(); go('inicio'); }
  });

  view.addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target, msg = $('[data-msg]', f);
    if (f.dataset.test) {
      const m = CURSO.find(m => m.id === f.dataset.test);
      const answers = m.q.map((_, n) => f.querySelector(`input[name=q${n}]:checked`));
      if (answers.some(a => !a)) { msg.innerHTML = '<p class="msg msg--err">Responde las 3 preguntas antes de corregir.</p>'; return; }
      let ok = 0;
      answers.forEach((a, n) => {
        const good = +a.value === m.q[n][2];
        ok += good;
        $$(`input[name=q${n}]`, f).forEach(inp => inp.parentElement.classList.remove('good', 'bad'));
        a.parentElement.classList.add(good ? 'good' : 'bad');
      });
      if (ok === m.q.length) {
        S.passed[m.id] = true; save();
        const i = CURSO.indexOf(m), nxt = CURSO[i + 1];
        msg.innerHTML = `<p class="msg msg--ok">Test aprobado. +30 puntos.</p>`;
        f.querySelector('button[type=submit]').outerHTML = nxt ? `<a class="btn btn--ball" href="#m/${nxt.id}">Ir al módulo ${i + 2}: ${nxt.titulo}</a>` : `<a class="btn btn--ball" href="#diploma">Ver mi diploma</a>`;
      } else msg.innerHTML = `<p class="msg msg--err">Has acertado ${ok} de ${m.q.length}. Revisa las marcadas en rojo y vuelve a intentarlo.</p>`;
    } else if (f.hasAttribute('data-name')) {
      const v = $('#nm').value.trim();
      if (v.length < 3) { $('#nm').setAttribute('aria-invalid', 'true'); msg.innerHTML = '<span class="msg msg--err" style="display:block">Escribe tu nombre y apellidos.</span>'; return; }
      S.name = v; save(); render();
    }
  });

  render();
  if ('serviceWorker' in navigator && location.protocol === 'https:') navigator.serviceWorker.register('sw.js').catch(() => {});
})();
