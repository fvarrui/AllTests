const CONFIG = {

  // ── MARCA / METADATOS ──────────────────────────────────────────────────────
  title:       "Test Logopeda — SCS 2022",
  badge:       "Servicio Canario de la Salud · 2022",
  appName:     "Logopeda",
  appSubtitle: 'Exclusivo para <span style="color: orange;">Nayky</span>',
  processType: "Proceso Selectivo Estabilización",
  docLink:     "https://www3.gobiernodecanarias.org/sanidad/scs/content/3415df07-9288-11ee-99c6-2947b39d0097/Certificaci%C3%B3n%20repertorio%20definitivo%20de%20Logopeda.pdf",

  // ── TEMA VISUAL ───────────────────────────────────────────────────────────
  theme: 'default',   // nombre de carpeta en themes/ (default, ocean, ...)

  // ── CONFIGURACIÓN POR DEFECTO DEL TEST ────────────────────────────────────
  defaults: {
    numQuestions: 30,
    rangeFrom:    1,
    rangeTo:      100,
    sliderMin:    5,
    sliderStep:   5,
    presets:      [10, 25, 50, 100],
  },

};

// Aplica el último tema guardado de forma síncrona (evita parpadeo al cargar).
// Si no hay nada guardado, quiz.js aplicará el tema por defecto al arrancar.
(function () {
  const saved = localStorage.getItem('quizTheme');
  if (saved) document.getElementById('appTheme').href = saved;
})();
