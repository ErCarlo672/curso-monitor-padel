/* =========================================================
   CONFIGURACIÓN DEL CURSO · lo único que hay que tocar
   para cambiar precios, fechas, enlaces de pago o píxeles.
   ========================================================= */
window.WPA = {
  marca: 'Wild Padel Academy',
  coach: 'Juan Carlos Sánchez',
  instagram: 'https://www.instagram.com/juancarlos__sanchez/',
  instagramClub: 'https://www.instagram.com/wildpadelindoor/',
  whatsapp: '34641101365',            // sin + ni espacios
  email: 'administracion@wildpadel.es',

  // Convocatoria. Cambia estos textos en cada promoción.
  promocion: 'Promoción de enero 2027',
  inicio: '12 de enero de 2027',
  inicioISO: '2027-01-12',            // primer directo; los siguientes, cada semana
  horaDirecto: '20:30',
  findePresencial: 'Sábado 6 y domingo 7 de marzo de 2027',
  plazasPremium: 12,                  // plazas totales del finde presencial
  plazasPremiumLibres: 12,            // actualiza a mano según vendas

  tarifas: {
    online:  { nombre: 'Online',  precio: 699, pago: '' },  // pega aquí el Payment Link de Stripe
    premium: { nombre: 'Premium', precio: 899, pago: '' },  // pega aquí el Payment Link de Stripe
  },
  plazos: 3,                          // pago en 3 plazos (Stripe + Klarna). Pon 0 para ocultarlo
  garantiaDias: 14,                   // días de garantía de devolución

  // Píxeles para las campañas en redes. Solo se cargan si el visitante acepta cookies.
  metaPixel: '',                      // ID del píxel de Meta (Instagram / Facebook)
  tiktokPixel: '',                    // ID del píxel de TikTok

  // Diplomas emitidos (para la página de verificación). Añade uno por alumno certificado.
  diplomas: [
    // { codigo: 'WPA-2027-001', nombre: 'Nombre Apellido', tarifa: 'Premium', fecha: '2027-04-10' },
  ],
};
