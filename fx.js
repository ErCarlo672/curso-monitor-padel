/* Animaciones de scroll estilo Apple. Todo gratis: GSAP + ScrollTrigger locales y JS propio.
   Cada efecto va en safe(): si uno falla, los demás siguen y el contenido ya está en el HTML. */
(function () {
  'use strict';
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return [].slice.call((r || document).querySelectorAll(s)); };
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var fine = matchMedia('(pointer: fine)').matches;
  function safe(fn, name) { try { fn(); } catch (e) { console.warn('[fx] ' + name, e); } }

  // Progreso 0..1 de una sección alta con hijo sticky
  function prog(el) { var r = el.getBoundingClientRect(); return clamp(-r.top / (r.height - innerHeight), 0, 1); }

  // Un solo bucle de scroll, con requestAnimationFrame, para todas las escenas
  var scenes = [];
  var ticking = false;
  function tick() { ticking = false; scenes.forEach(function (s) { if (s.live) s.fn(prog(s.el)); }); }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(tick); } }
  function scene(el, fn) {
    var s = { el: el, fn: fn, live: false };
    scenes.push(s);
    new IntersectionObserver(function (e) { s.live = e[0].isIntersecting; if (s.live) fn(prog(el)); }, { rootMargin: '100px 0px' }).observe(el);
    fn(prog(el));
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);

  /* ---------- campus: pantallas del móvil ---------- */
  safe(function () {
    var el = $('[data-show]'); if (!el) return;
    var screens = $$('[data-screen]', el), steps = $$('[data-step]', el), phone = $('.show__phone', el);
    var cur = -1;
    scene(el, function (p) {
      var i = clamp(Math.floor(p * screens.length), 0, screens.length - 1);
      if (i !== cur) {
        cur = i;
        screens.forEach(function (s, k) { s.classList.toggle('on', k === i); });
        steps.forEach(function (s, k) { s.classList.toggle('on', k === i); });
      }
      var ry = (p - 0.5) * 36, rx = 8 - Math.sin(p * Math.PI) * 8;
      phone.style.transform = 'rotateY(' + ry.toFixed(2) + 'deg) rotateX(' + rx.toFixed(2) + 'deg) translateY(' + ((0.5 - Math.abs(p - 0.5)) * -24).toFixed(1) + 'px)';
    });
  }, 'show');

  /* ---------- cifra gigante ---------- */
  safe(function () {
    var el = $('[data-big]'); if (!el) return;
    var num = $('[data-big-num]', el), cap = $('.big__cap', el);
    scene(el, function (p) {
      var a = clamp(p / 0.7, 0, 1), e = 1 - Math.pow(1 - a, 3);
      num.style.transform = 'scale(' + (1.7 - 0.7 * e).toFixed(3) + ')';
      num.style.backgroundPosition = (100 - e * 100).toFixed(1) + '% 0';
      cap.style.opacity = clamp((p - 0.45) / 0.25, 0, 1);
      cap.style.transform = 'translateY(' + ((1 - clamp((p - 0.45) / 0.25, 0, 1)) * 32).toFixed(1) + 'px)';
    });
  }, 'big');

  /* ---------- hero: entrada y salida con GSAP ---------- */
  safe(function () {
    if (!window.gsap) return;
    var g = window.gsap;
    if (window.ScrollTrigger) g.registerPlugin(window.ScrollTrigger);
    var hero = $('.hero'), text = $('.hero__grid > div:first-child'), stage = $('.hero .phone-stage');
    g.set(stage, { transformPerspective: 1100 });
    var tl = g.timeline({ defaults: { ease: 'expo.out', duration: 1.2 } });
    tl.from($$('.hero .eyebrow, .hero h1, .hero__sub, .hero__cta, .hero .proof'), { y: 48, opacity: 0, stagger: 0.09 })
      .from($('.hero .phone'), { y: 180, rotateX: 38, opacity: 0, duration: 1.6 }, 0.15)
      .from($$('.hero .float'), { scale: 0.6, opacity: 0, stagger: 0.12, ease: 'back.out(1.7)', duration: 0.9 }, 0.8);
    if (!window.ScrollTrigger) return;
    g.to(stage, { y: -90, rotateX: 16, scale: 0.9, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 } });
    g.to(text, { y: -70, opacity: 0.15, ease: 'none', scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.6 } });

    // tarjetas que entran escalonadas, como en las páginas de producto
    $$('.pains, .steps, .bento, .prices, .stats').forEach(function (box) {
      var kids = [].slice.call(box.children);
      kids.forEach(function (k) { k.classList.remove('rv'); k.classList.add('in'); });
      g.from(kids, { y: 80, opacity: 0, rotateX: -8, transformPerspective: 900, stagger: 0.1, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: box, start: 'top 85%' } });
    });

    // titulares que se separan letra a letra al entrar no: solo un deslizamiento limpio con máscara
    $$('.h2').forEach(function (h) {
      g.from(h, { clipPath: 'inset(0 0 100% 0)', y: 40, duration: 1.1, ease: 'expo.out', scrollTrigger: { trigger: h, start: 'top 88%' } });
    });
  }, 'hero');

  /* ---------- inclinación 3D en tarifas y botones magnéticos ---------- */
  safe(function () {
    if (!fine) return;
    $$('.price, .card').forEach(function (c) {
      c.classList.add('tilt');
      c.addEventListener('mousemove', function (e) {
        var r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        c.style.transform = 'perspective(900px) rotateY(' + (x * 6).toFixed(2) + 'deg) rotateX(' + (-y * 6).toFixed(2) + 'deg) translateY(-4px)';
      });
      c.addEventListener('mouseleave', function () { c.style.transform = ''; });
    });
    $$('.btn--fire, .btn--ball').forEach(function (b) {
      b.addEventListener('mousemove', function (e) {
        var r = b.getBoundingClientRect();
        b.style.transform = 'translate(' + ((e.clientX - r.left - r.width / 2) * 0.18).toFixed(1) + 'px,' + ((e.clientY - r.top - r.height / 2) * 0.3).toFixed(1) + 'px)';
      });
      b.addEventListener('mouseleave', function () { b.style.transform = ''; });
    });
  }, 'micro');

  // Red de seguridad: nada se queda oculto aunque falle un observador
  setTimeout(function () { $$('.rv:not(.in)').forEach(function (e) { e.classList.add('in'); }); }, 6000);
})();
