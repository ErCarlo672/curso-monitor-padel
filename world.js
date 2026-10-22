/* Vuelo de cámara por una pista de pádel 3D controlado por el scroll (Three.js r128, sin módulos).
   La sección [data-world] es alta; el canvas se queda fijo y el scroll mueve la cámara de capítulo en capítulo. */
(function () {
  'use strict';
  var sec = document.querySelector('[data-world]');
  if (!sec) return;
  var canvas = sec.querySelector('canvas');
  var chapters = [].slice.call(sec.querySelectorAll('[data-chapter]'));
  var dots = [].slice.call(sec.querySelectorAll('[data-dot]'));
  var bar = sec.querySelector('[data-world-bar]');

  function setChapter(i) {
    chapters.forEach(function (c, k) { c.classList.toggle('on', k === i); });
    dots.forEach(function (d, k) { d.classList.toggle('on', k <= i); });
  }
  setChapter(0);

  var T = window.THREE;
  var gl = null;
  try { gl = T && canvas.getContext('webgl'); } catch (e) {}
  if (!T || !gl) { sec.classList.add('world--flat'); return; }

  var mobile = matchMedia('(max-width: 900px)').matches;
  var renderer = new T.WebGLRenderer({ canvas: canvas, antialias: !mobile, alpha: false, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(devicePixelRatio || 1, mobile ? 1.5 : 2));
  renderer.setClearColor(0x000000, 1);
  renderer.outputEncoding = T.sRGBEncoding;

  var scene = new T.Scene();
  scene.fog = new T.Fog(0x000000, 22, 60);
  var cam = new T.PerspectiveCamera(mobile ? 58 : 42, 1, 0.1, 200);

  scene.add(new T.HemisphereLight(0xffffff, 0x101020, 0.55));
  var sun = new T.DirectionalLight(0xffffff, 0.9); sun.position.set(-6, 14, 8); scene.add(sun);
  var rim = new T.PointLight(0xff7a1a, 1.4, 30); rim.position.set(9, 4, -6); scene.add(rim);

  var C = { court: 0x163fa0, line: 0xf3f1ea, ball: 0xdfff3d, orange: 0xff7a1a, red: 0xff1f4b, glass: 0x9fc4ff };
  var basic = function (c, o) { return new T.MeshBasicMaterial({ color: c, transparent: o < 1, opacity: o == null ? 1 : o }); };

  // Suelo del "mundo": rejilla tenue que se pierde en la niebla
  var grid = new T.GridHelper(120, 60, 0x272727, 0x181818); grid.position.y = -0.02; scene.add(grid);

  // Pista 20 × 10 m: x a lo largo, z a lo ancho
  var court = new T.Mesh(new T.PlaneGeometry(20, 10), new T.MeshStandardMaterial({ color: C.court, roughness: 0.9 }));
  court.rotation.x = -Math.PI / 2; scene.add(court);
  var apron = new T.Mesh(new T.PlaneGeometry(23, 12.4), new T.MeshStandardMaterial({ color: 0x0c1f52, roughness: 1 }));
  apron.rotation.x = -Math.PI / 2; apron.position.y = -0.01; scene.add(apron);

  function line(x1, z1, x2, z2, w) {
    w = w || 0.06;
    var len = Math.hypot(x2 - x1, z2 - z1);
    var m = new T.Mesh(new T.PlaneGeometry(len, w), basic(C.line));
    m.rotation.x = -Math.PI / 2; m.rotation.z = -Math.atan2(z2 - z1, x2 - x1);
    m.position.set((x1 + x2) / 2, 0.005, (z1 + z2) / 2); scene.add(m); return m;
  }
  line(-6.95, -5, -6.95, 5); line(6.95, -5, 6.95, 5); line(-6.95, 0, 6.95, 0);
  line(-10, -5, 10, -5, 0.04); line(-10, 5, 10, 5, 0.04); line(-10, -5, -10, 5, 0.04); line(10, -5, 10, 5, 0.04);

  // Red
  var net = new T.Mesh(new T.PlaneGeometry(10, 0.88, 40, 4), new T.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.35 }));
  net.rotation.y = Math.PI / 2; net.position.set(0, 0.44, 0); scene.add(net);
  var tape = new T.Mesh(new T.BoxGeometry(0.05, 0.05, 10), basic(0xffffff)); tape.position.set(0, 0.88, 0); scene.add(tape);
  [-5.1, 5.1].forEach(function (z) { var p = new T.Mesh(new T.CylinderGeometry(0.05, 0.05, 1, 8), basic(0x313131)); p.position.set(0, 0.5, z); scene.add(p); });

  // Cristales y malla: paneles translúcidos con aristas
  var glassMat = new T.MeshBasicMaterial({ color: C.glass, transparent: true, opacity: 0.06, side: T.DoubleSide, depthWrite: false });
  var edgeMat = new T.LineBasicMaterial({ color: 0x9fc4ff, transparent: true, opacity: 0.35 });
  var meshMat = new T.MeshBasicMaterial({ color: 0x555555, wireframe: true, transparent: true, opacity: 0.18 });
  function panel(w, h, x, y, z, ry, mesh) {
    var g = new T.PlaneGeometry(w, h, mesh ? Math.round(w * 3) : 1, mesh ? Math.round(h * 3) : 1);
    var p = new T.Mesh(g, mesh ? meshMat : glassMat); p.position.set(x, y, z); p.rotation.y = ry || 0; scene.add(p);
    if (!mesh) { var e = new T.LineSegments(new T.EdgesGeometry(new T.PlaneGeometry(w, h)), edgeMat); e.position.copy(p.position); e.rotation.copy(p.rotation); scene.add(e); }
  }
  [-10, 10].forEach(function (x) {
    panel(10, 3, x, 1.5, 0, Math.PI / 2); panel(10, 1, x, 3.5, 0, Math.PI / 2, true);
    [-5, 5].forEach(function (z) {
      var sx = Math.sign(x);
      panel(2, 3, x - sx * 1, 1.5, z); panel(2, 1, x - sx * 1, 3.5, z, 0, true);
      panel(2, 2, x - sx * 3, 1, z); panel(6, 3, x - sx * 7, 1.5, z, 0, true);
    });
  });

  // Jugadores: fichas de pizarra con anillo en el suelo
  function player(color) {
    var g = new T.Group();
    var body = new T.Mesh(new T.CylinderGeometry(0.28, 0.32, 1.5, 20), new T.MeshStandardMaterial({ color: color, roughness: 0.5, emissive: color, emissiveIntensity: 0.25 }));
    body.position.y = 0.75; g.add(body);
    var head = new T.Mesh(new T.SphereGeometry(0.24, 20, 16), new T.MeshStandardMaterial({ color: 0xf3f1ea, roughness: 0.6 }));
    head.position.y = 1.75; g.add(head);
    var ring = new T.Mesh(new T.RingGeometry(0.45, 0.55, 40), basic(color, 0.9)); ring.rotation.x = -Math.PI / 2; ring.position.y = 0.01; g.add(ring);
    scene.add(g); return g;
  }
  var A1 = player(C.orange), A2 = player(C.orange), B1 = player(C.red), B2 = player(0xf3f1ea);
  var POS = {
    // posiciones [x, z] por capítulo
    A1: [[-8.5, -2.5], [-8.5, -2.5], [-3, -2.2], [-3, -2.2], [-3, -2.2]],
    A2: [[-8.5, 2.5], [-8.5, 2.5], [-3, 2.2], [-3, 2.2], [-3, 2.2]],
    B1: [[3, -2.2], [3, -2.2], [8.5, -2.5], [8.5, -2.5], [8.5, -2.5]],
    B2: [[3, 2.2], [3, 2.2], [8.5, 2.5], [8.5, 2.5], [8.5, 2.5]],
  };

  // Bola y estelas
  var ball = new T.Mesh(new T.SphereGeometry(0.11, 20, 16), new T.MeshBasicMaterial({ color: C.ball }));
  scene.add(ball);
  var glow = new T.PointLight(C.ball, 1.2, 4); ball.add(glow);
  function arcPoints(a, b, h, n) {
    var pts = [];
    for (var i = 0; i <= n; i++) {
      var t = i / n; pts.push(new T.Vector3(a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t + h * 4 * t * (1 - t), a[2] + (b[2] - a[2]) * t));
    }
    return pts;
  }
  function trail(pts, color, op) {
    var curve = new T.CatmullRomCurve3(pts);
    var geo = new T.TubeGeometry(curve, 120, 0.03, 6, false);
    var m = new T.Mesh(geo, basic(color, op == null ? 0.9 : op)); m.geometry.setDrawRange(0, 0); scene.add(m);
    return { mesh: m, curve: curve, total: geo.index.count };
  }
  // capítulo 1: globo desde el fondo que pasa por encima de la pareja en la red
  var lob = trail(arcPoints([-8.5, 1, -2.5], [8.8, 0.15, 1.5], 6.5, 60), C.ball);
  // capítulo 2: dos bolas al medio (táctica)
  var mid1 = trail(arcPoints([8.5, 1, -2.5], [-3.4, 0.4, 0], 1.2, 40).concat(arcPoints([-3.4, 0.4, 0], [5.5, 0.1, 0.1], 0.6, 30).slice(1)), C.orange);
  // capítulo 4: varias trayectorias que se encienden a la vez
  var finale = [
    trail(arcPoints([-3, 1.1, -2.2], [7.5, 0.1, 4], 1, 30), C.ball, 0.7),
    trail(arcPoints([-3, 1.1, 2.2], [6, 0.1, -3.5], 1.4, 30), C.ball, 0.7),
    trail(arcPoints([8.5, 1, 2.5], [-6, 0.1, 0.5], 4.5, 40), C.orange, 0.7),
  ];

  // capítulo 2: zona "al medio" resaltada
  var zone = new T.Mesh(new T.PlaneGeometry(6.95, 2.4), basic(C.red, 0.0)); zone.rotation.x = -Math.PI / 2; zone.position.set(3.48, 0.01, 0); scene.add(zone);
  // capítulo 3: conos de un ejercicio con cesta
  var cones = [];
  [[5, -3.5], [5, 0], [5, 3.5], [2, -1.8], [2, 1.8], [8, -4], [8, 4]].forEach(function (p, k) {
    var c = new T.Mesh(new T.ConeGeometry(0.18, 0.4, 16), new T.MeshStandardMaterial({ color: C.orange, emissive: C.orange, emissiveIntensity: 0.4 }));
    c.position.set(p[0], 0.2, p[1]); c.scale.setScalar(0.001); c.userData.k = k; scene.add(c); cones.push(c);
  });
  var arrows = trail([new T.Vector3(8, 0.03, -4), new T.Vector3(5, 0.03, -3.5), new T.Vector3(2, 0.03, -1.8), new T.Vector3(5, 0.03, 0), new T.Vector3(2, 0.03, 1.8), new T.Vector3(5, 0.03, 3.5), new T.Vector3(8, 0.03, 4)], C.line, 0.8);

  // Paradas de cámara: [posición, objetivo]
  var STOPS = [
    [[-26, 22, 26], [0, 0, 0]],        // 0 vista aérea del mundo
    [[-15, 3.4, -6.5], [-1, 1.4, 0.5]], // 1 detrás del jugador, a ras de pista
    [[2, 5.5, 14], [0, 0.5, 0]],       // 2 lateral junto a la red
    [[1.2, 21, 0.01], [1.2, 0, 0]],     // 3 cenital, como una pizarra
    [[16, 9, -17], [0, 0.5, 0]],        // 4 se aleja y abre plano
  ];
  if (mobile) { STOPS[0][0] = [-30, 30, 30]; STOPS[2][0] = [2, 7, 19]; STOPS[3][0] = [3, 30, 0.01]; STOPS[3][1] = [3, 0, 0]; STOPS[4][0] = [20, 13, -22]; }
  var N = STOPS.length;
  var v3 = function (a) { return new T.Vector3(a[0], a[1], a[2]); };
  var posCurve = new T.CatmullRomCurve3(STOPS.map(function (s) { return v3(s[0]); }), false, 'centripetal');
  var tgtCurve = new T.CatmullRomCurve3(STOPS.map(function (s) { return v3(s[1]); }), false, 'centripetal');

  // Cada parada tiene un rato de calma (la cámara se detiene mientras se lee el texto)
  var HOLD = 0.42;
  function camT(p) {
    var x = p * (N - 1), i = Math.min(N - 2, Math.floor(x)), f = x - i;
    var g = Math.max(0, Math.min(1, (f - HOLD / 2) / (1 - HOLD)));
    g = g * g * (3 - 2 * g);
    return (i + g) / (N - 1);
  }
  var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
  var ease = function (t) { t = clamp(t, 0, 1); return t * t * (3 - 2 * t); };
  function lerpPos(obj, key, s) {
    var a = POS[key], i = Math.min(N - 2, Math.floor(s)), f = ease(s - i);
    obj.position.x = a[i][0] + (a[i + 1][0] - a[i][0]) * f;
    obj.position.z = a[i][1] + (a[i + 1][1] - a[i][1]) * f;
  }
  function reveal(tr, t) { tr.mesh.geometry.setDrawRange(0, Math.floor(tr.total * clamp(t, 0, 1) / 3) * 3); }

  var target = 0, cur = 0, visible = false, last = -1, chapter = 0, clock = 0;
  function progress() {
    var r = sec.getBoundingClientRect();
    return clamp(-r.top / (r.height - innerHeight), 0, 1);
  }

  function frame(now) {
    if (!visible) return;
    requestAnimationFrame(frame);
    draw(now);
  }
  function draw(now) {
    clock = now / 1000;
    target = progress();
    cur += (target - cur) * 0.085;
    var p = cur, s = p * (N - 1);

    var ct = camT(p);
    cam.position.copy(posCurve.getPoint(ct));
    cam.lookAt(tgtCurve.getPoint(ct));

    ['A1', 'A2', 'B1', 'B2'].forEach(function (k) { lerpPos({ A1: A1, A2: A2, B1: B1, B2: B2 }[k], k, s); });
    [A1, A2, B1, B2].forEach(function (g, k) { g.children[2].scale.setScalar(1 + Math.sin(clock * 3 + k) * 0.08); });

    // capítulo 1: el globo se dibuja y la bola lo recorre
    var l1 = clamp((s - 0.35) / 0.9, 0, 1); reveal(lob, l1);
    // capítulo 2: al medio
    var l2 = clamp((s - 1.4) / 0.9, 0, 1); reveal(mid1, l2);
    lob.mesh.material.opacity = 0.9 * (1 - ease((s - 1.6) / 0.5));
    mid1.mesh.material.opacity = 0.9 * (1 - ease((s - 2.5) / 0.5));
    zone.material.opacity = 0.22 * ease((s - 1.5) / 0.5) * (1 - ease((s - 2.6) / 0.4));
    // capítulo 3: conos y recorrido
    cones.forEach(function (c) { var e = ease((s - 2.35 - c.userData.k * 0.06) / 0.25); c.scale.setScalar(Math.max(0.001, e)); });
    reveal(arrows, (s - 2.6) / 0.5);
    // capítulo 4: final
    finale.forEach(function (f, k) { reveal(f, (s - 3.3 - k * 0.12) / 0.5); });

    var bt;
    if (s < 1.4) { bt = lob.curve.getPointAt(Math.max(0.0001, l1)); }
    else if (s < 3.2) { bt = mid1.curve.getPointAt(Math.max(0.0001, l2)); }
    else { bt = finale[2].curve.getPointAt(clamp((s - 3.3) / 0.6, 0.0001, 1)); }
    ball.position.copy(bt);

    var ch = clamp(Math.round(s), 0, N - 1);
    if (ch !== chapter) { chapter = ch; setChapter(ch); }
    if (bar) bar.style.transform = 'scaleX(' + p.toFixed(4) + ')';

    renderer.render(scene, cam);
  }

  function size() {
    var w = canvas.clientWidth, h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    cam.aspect = w / h; cam.updateProjectionMatrix();
  }
  var lastW = innerWidth;
  addEventListener('resize', function () { if (mobile && innerWidth === lastW) return; lastW = innerWidth; size(); });
  size();
  cur = target = progress();
  new IntersectionObserver(function (e) {
    var was = visible; visible = e[0].isIntersecting;
    if (visible && !was) { size(); requestAnimationFrame(frame); }
  }, { rootMargin: '200px 0px' }).observe(sec);
  // primer fotograma aunque aún no se vea
  cur = 0; draw(0);
})();
