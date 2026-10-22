/* Temario del curso: lo usan la web de venta y el campus.
   min = minutos de vídeo de cada lección. q = test del módulo [pregunta, opciones, índice correcto]. */
window.CURSO = [
  {
    id: 'm1', titulo: 'El oficio de monitor', icono: 'ph-identification-badge',
    resumen: 'Qué hace un buen monitor, reglamento, seguridad en pista y cómo tratar al alumno desde el primer minuto.',
    lecciones: [
      ['Qué se espera de un monitor de pádel', 12], ['Reglamento esencial para enseñar', 18],
      ['Seguridad, calentamiento y prevención en pista', 14], ['Primera clase: acogida y diagnóstico de nivel', 16],
      ['Comunicación: cómo corregir sin desmotivar', 15],
    ],
    q: [
      ['En el saque, ¿dónde debe botar la bola?', ['En cualquier zona del campo contrario', 'En el cuadro de saque cruzado del rival', 'Detrás de la línea de saque rival'], 1],
      ['Tienes un alumno nuevo. ¿Qué haces antes de corregirle nada?', ['Explicarle toda la técnica de golpes', 'Observarle jugar y diagnosticar su nivel', 'Ponerle directamente a jugar partido'], 1],
      ['Una corrección eficaz debe ser…', ['Larga y con muchos detalles a la vez', 'Breve, concreta y de un solo aspecto', 'Siempre delante de todo el grupo'], 1],
    ],
  },
  {
    id: 'm2', titulo: 'Técnica de fondo de pista', icono: 'ph-tennis-ball',
    resumen: 'Empuñadura, derecha, revés, saque, resto y globo. Golpe a golpe, con los errores típicos y cómo corregirlos.',
    lecciones: [
      ['Empuñadura continental y posición de espera', 10], ['La derecha: gesto, apoyos y errores típicos', 20],
      ['El revés: gesto, apoyos y errores típicos', 20], ['El saque: regularidad antes que potencia', 14],
      ['El resto: el golpe que decide el punto', 18], ['El globo como arma, no como defensa', 16],
    ],
    q: [
      ['¿Qué empuñadura se enseña como base en pádel?', ['Continental', 'Western', 'Semiwestern'], 0],
      ['El error más común en la derecha del principiante es…', ['Golpear demasiado tarde y sin apoyos', 'Usar la empuñadura continental', 'Flexionar las piernas'], 0],
      ['En el saque de pádel, la bola se golpea…', ['Por encima del hombro', 'A la altura de la cintura o por debajo', 'Siempre con efecto liftado'], 1],
    ],
  },
  {
    id: 'm3', titulo: 'Juego de red y golpes aéreos', icono: 'ph-arrow-fat-lines-up',
    resumen: 'Volea, bandeja, víbora y remate. Cuándo enseñar cada uno y con qué progresión para que el alumno no se lesione.',
    lecciones: [
      ['La volea de derecha y de revés', 18], ['La bandeja: mantener la red', 20],
      ['La víbora: cuándo y para quién', 16], ['El remate plano y por 3', 18],
      ['Progresión de golpes aéreos por niveles', 14],
    ],
    q: [
      ['¿Cuál es el objetivo principal de la bandeja?', ['Ganar el punto directo', 'Mantener la posición en la red', 'Sacar la bola por 4'], 1],
      ['¿A quién NO enseñarías todavía la víbora?', ['A un alumno de iniciación', 'A un jugador de competición', 'A un jugador intermedio avanzado'], 0],
      ['En la volea, el movimiento de la pala debe ser…', ['Amplio, como en la derecha de fondo', 'Corto, por delante del cuerpo', 'Siempre de abajo arriba'], 1],
    ],
  },
  {
    id: 'm4', titulo: 'Paredes y cristales', icono: 'ph-squares-four',
    resumen: 'Lo que hace único al pádel. Salida de pared de fondo, lateral, doble pared y contrapared, con ejercicios con cesta.',
    lecciones: [
      ['Leer el bote y la trayectoria tras la pared', 14], ['Salida de pared de fondo de derecha', 16],
      ['Salida de pared de fondo de revés', 16], ['Pared lateral y doble pared', 18],
      ['La contrapared como recurso', 10],
    ],
    q: [
      ['Ante una bola que va a la pared de fondo, el alumno debe…', ['Ir hacia la pared y esperar pegado a ella', 'Acompañar la bola de espaldas a la red y dejar espacio', 'Golpearla antes de que toque la pared siempre'], 1],
      ['¿Qué se enseña primero?', ['Doble pared', 'Pared de fondo', 'Contrapared'], 1],
      ['Para trabajar paredes con iniciación, lo ideal es…', ['Lanzar con cesta bolas controladas', 'Jugar partidos directamente', 'Explicar solo con pizarra'], 0],
    ],
  },
  {
    id: 'm5', titulo: 'Táctica y juego en pareja', icono: 'ph-strategy',
    resumen: 'Posicionamiento, comunicación, lectura del juego y cómo enseñar táctica a grupos de nivel distinto.',
    lecciones: [
      ['Posiciones base: los dos en red, los dos en fondo', 14], ['Ganar la red y defenderla', 18],
      ['Jugar al medio y por qué funciona', 12], ['Comunicación y roles en pareja', 12],
      ['Enseñar táctica con juegos condicionados', 16],
    ],
    q: [
      ['¿Dónde se ganan la mayoría de puntos en pádel amateur?', ['Desde el fondo con potencia', 'Desde la red, con la pareja bien colocada', 'Con el saque'], 1],
      ['Jugar al medio de los rivales sirve para…', ['Generar duda y errores entre ellos', 'Abrir ángulos para el remate', 'Que la bola toque la pared lateral'], 0],
      ['Un juego condicionado es…', ['Un partido normal a 3 sets', 'Un ejercicio con reglas que obligan a usar lo entrenado', 'Un calentamiento sin bola'], 1],
    ],
  },
  {
    id: 'm6', titulo: 'Metodología y diseño de clases', icono: 'ph-clipboard-text',
    resumen: 'Cómo montar una clase de 60 o 90 minutos que se note. Grupos por niveles, menores, clases particulares y plan de temporada.',
    lecciones: [
      ['Estructura de una sesión que funciona', 16], ['El monitor con cesta: lanzar bien es enseñar bien', 18],
      ['Grupos de 4 con niveles distintos', 16], ['Clases con menores: juego y valores', 16],
      ['Clase particular frente a grupo', 12], ['Planificar una temporada por objetivos', 18],
    ],
    q: [
      ['En una clase de grupo, el tiempo de bola por alumno debe ser…', ['Lo más alto posible', 'Lo de menos, lo importante es explicar', 'Solo al final de la clase'], 0],
      ['Con un grupo de niveles mezclados, la mejor opción es…', ['Adaptar el ejercicio por roles o zonas', 'Enseñar al nivel del mejor', 'Separar y que jueguen solos'], 0],
      ['Con menores, la herramienta principal es…', ['La repetición sin descanso', 'El juego con objetivos técnicos', 'La teoría en pizarra'], 1],
    ],
  },
  {
    id: 'm7', titulo: 'Preparación física y prevención', icono: 'ph-heartbeat',
    resumen: 'Calentamiento, trabajo de piernas, prevención de lesiones típicas del pádel y cómo cuidarte tú como monitor.',
    lecciones: [
      ['Calentamiento específico en 8 minutos', 10], ['Desplazamientos y trabajo de piernas', 14],
      ['Lesiones típicas: codo, hombro, gemelo', 14], ['El cuerpo del monitor: horas de cesta sin lesionarte', 12],
    ],
    q: [
      ['El calentamiento debe ser…', ['Estático, solo estiramientos', 'Dinámico y específico del pádel', 'Opcional en clases de una hora'], 1],
      ['La epicondilitis («codo de tenista») suele relacionarse con…', ['Mala técnica y material inadecuado', 'Correr demasiado', 'Jugar en pista cubierta'], 0],
      ['El primer paso tras el golpe del rival es…', ['El split step o paso de ajuste', 'Correr a la red', 'Girar la pala'], 0],
    ],
  },
  {
    id: 'm8', titulo: 'Vivir del pádel: alumnos y marca', icono: 'ph-trend-up',
    resumen: 'Lo que nadie enseña: precios, agenda, trabajar con clubes, Playtomic y cómo usar Instagram para llenar tus clases.',
    lecciones: [
      ['Cuánto cobrar y cómo organizar tu agenda', 14], ['Trabajar para un club o por tu cuenta', 12],
      ['Reservas y pagos con Playtomic', 10], ['Instagram para monitores: el método detrás de 30.000 seguidores', 22],
      ['Fidelizar alumnos: que vuelvan cada temporada', 12],
    ],
    q: [
      ['Para llenar tu agenda de clases, lo más eficaz a largo plazo es…', ['Bajar precios siempre', 'Que tus alumnos noten la mejora y te recomienden', 'Dar clases gratis'], 1],
      ['En redes, el contenido que mejor funciona para un monitor es…', ['Consejos cortos y útiles grabados en pista', 'Solo fotos de resultados', 'Publicar los precios cada día'], 0],
      ['Fidelizar un alumno es más rentable que…', ['Captar uno nuevo', 'Subir el precio', 'Cambiar de club'], 0],
    ],
  },
];

window.DIRECTOS = [
  ['Bienvenida y método Wild', 'Presentación del curso y del campus'],
  ['Corrección de derecha y revés', 'Analizamos vídeos de alumnos'],
  ['Saque y resto', 'Dudas y casos reales'],
  ['Volea y bandeja', 'Progresiones por niveles'],
  ['Remate y víbora', 'Cuándo enseñar cada golpe'],
  ['Paredes', 'Ejercicios con cesta'],
  ['Táctica en pareja', 'Juegos condicionados'],
  ['Diseño de clases', 'Revisamos vuestras sesiones'],
  ['Grupos y menores', 'Casos difíciles'],
  ['Físico y prevención', 'Rutinas para ti y tus alumnos'],
  ['Negocio y redes', 'Cómo conseguir tus primeros alumnos'],
  ['Preparación del examen final', 'Repaso y última corrección'],
];
